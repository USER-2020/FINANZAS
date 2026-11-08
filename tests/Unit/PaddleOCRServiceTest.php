<?php

namespace Tests\Unit;

use App\Services\OCR\PaddleOCRService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class PaddleOCRServiceTest extends TestCase
{
    public function test_it_sends_the_file_to_the_configured_ocr_service(): void
    {
        config([
            'services.paddleocr.url' => 'https://ocr.test',
            'services.paddleocr.key' => 'test-secret',
        ]);

        Http::fake([
            'https://ocr.test/ocr' => Http::response([
                'success' => true,
                'text' => 'TOTAL 4500',
                'lines' => [['text' => 'TOTAL 4500', 'confidence' => 0.96]],
            ]),
        ]);

        $result = app(PaddleOCRService::class)->scan(UploadedFile::fake()->image('factura.jpg'));

        $this->assertSame('TOTAL 4500', $result['text']);
        $this->assertSame(0.96, $result['lines'][0]['confidence']);
        Http::assertSent(fn ($request) => $request->hasHeader('X-API-Key', 'test-secret') && $request->url() === 'https://ocr.test/ocr');
    }
}
