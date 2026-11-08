<?php

namespace App\Http\Controllers;

use App\Exceptions\OcrServiceException;
use App\Http\Controllers\Concerns\InteractsWithTenant;
use App\Services\Invoices\InvoiceParserService;
use App\Services\OCR\PaddleOCRService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class InvoiceScanController extends Controller
{
    use InteractsWithTenant;

    public function __construct(
        private readonly PaddleOCRService $ocr,
        private readonly InvoiceParserService $parser,
    ) {
    }

    public function scan(Request $request): JsonResponse
    {
        $this->ensureOperationalAccess($request);

        $validated = $request->validate([
            'file' => ['required', 'file', 'mimes:jpg,jpeg,png,webp', 'max:8192'],
        ]);

        try {
            $ocrResult = $this->ocr->scan($validated['file']);
            $invoice = $this->parser->parse($ocrResult);

            return response()->json([
                'success' => true,
                'invoice' => $invoice,
                'ocr' => [
                    'confidence' => $invoice['confidence'],
                    'raw_text' => $invoice['raw_text'],
                ],
            ]);
        } catch (OcrServiceException $exception) {
            return response()->json([
                'success' => false,
                'message' => $exception->getMessage(),
            ], $exception->status);
        } catch (\Throwable $exception) {
            Log::error('Error inesperado al escanear factura.', ['exception' => $exception::class]);

            return response()->json([
                'success' => false,
                'message' => 'No se pudo interpretar la factura. Intenta nuevamente.',
            ], 500);
        }
    }
}
