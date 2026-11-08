<?php

namespace App\Services\OCR;

use App\Exceptions\OcrServiceException;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PaddleOCRService
{
    /**
     * @return array{success: bool, text: string, lines: array<int, array{text: string, confidence: float|null}>}
     */
    public function scan(UploadedFile $file): array
    {
        $stream = fopen($file->getRealPath(), 'r');

        if ($stream === false) {
            throw new OcrServiceException('No se pudo leer el archivo de factura.', 422);
        }

        try {
            $response = $this->client()
                ->attach('file', $stream, $file->getClientOriginalName())
                ->post(rtrim((string) config('services.paddleocr.url'), '/') . '/ocr');
        } catch (ConnectionException $exception) {
            Log::error('PaddleOCR no disponible.', [
                'exception' => $exception::class,
                'message' => $exception->getMessage(),
            ]);
            throw new OcrServiceException('El servicio OCR no está disponible en este momento.', 504, $exception);
        } catch (\Throwable $exception) {
            Log::error('Error al conectar con PaddleOCR.', [
                'exception' => $exception::class,
                'message' => $exception->getMessage(),
            ]);
            throw new OcrServiceException('No fue posible procesar la factura.', 502, $exception);
        } finally {
            fclose($stream);
        }

        if ($response->status() === 413) {
            throw new OcrServiceException('La factura supera el tamaño permitido por el servicio OCR.', 413);
        }

        if ($response->status() === 415) {
            throw new OcrServiceException('El formato de la factura no es compatible.', 415);
        }

        if ($response->failed()) {
            Log::error('PaddleOCR devolvió un error HTTP.', [
                'status' => $response->status(),
                'error' => $response->json('errorMsg') ?? $response->json('detail'),
            ]);
            throw new OcrServiceException(
                $response->status() === 422
                    ? 'El servicio OCR no pudo validar la imagen enviada.'
                    : 'El servicio OCR rechazó la factura.',
                $response->status() === 422 ? 422 : 502
            );
        }

        $payload = $response->json();

        // El wrapper propio desplegado en el VPS normaliza la respuesta a este contrato.
        if (is_array($payload) && ($payload['success'] ?? false) === true && is_string($payload['text'] ?? null)) {
            return [
                'success' => true,
                'text' => trim($payload['text']),
                'lines' => collect($payload['lines'] ?? [])
                    ->filter(fn ($line) => is_array($line) && is_string($line['text'] ?? null))
                    ->map(fn (array $line) => [
                        'text' => trim($line['text']),
                        'confidence' => isset($line['confidence']) && is_numeric($line['confidence']) ? (float) $line['confidence'] : null,
                    ])
                    ->values()
                    ->all(),
            ];
        }

        $ocrResults = data_get($payload, 'result.ocrResults');

        if (! is_array($ocrResults)) {
            Log::error('Respuesta inválida de PaddleOCR.', ['status' => $response->status()]);
            throw new OcrServiceException('La respuesta del servicio OCR no es válida.', 502);
        }

        $lines = collect($ocrResults)
            ->flatMap(function ($page) {
                $result = is_array($page) ? ($page['prunedResult'] ?? []) : [];
                $texts = is_array($result) ? ($result['rec_texts'] ?? []) : [];
                $scores = is_array($result) ? ($result['rec_scores'] ?? []) : [];

                return collect($texts)->values()->map(fn ($text, $index) => [
                    'text' => trim((string) $text),
                    'confidence' => isset($scores[$index]) && is_numeric($scores[$index]) ? (float) $scores[$index] : null,
                ]);
            })
            ->filter(fn (array $line) => $line['text'] !== '')
            ->values()
            ->all();

        return [
            'success' => true,
            'text' => collect($lines)->pluck('text')->implode("\n"),
            'lines' => $lines,
        ];
    }

    private function client(): PendingRequest
    {
        $client = Http::withHeaders(['Accept' => 'application/json'])
            ->connectTimeout(10)
            ->timeout(90);

        $apiKey = config('services.paddleocr.key');

        return filled($apiKey) ? $client->withHeader('X-API-Key', (string) $apiKey) : $client;
    }
}
