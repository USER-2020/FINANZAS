<?php

namespace Tests\Unit;

use App\Services\Invoices\InvoiceParserService;
use Tests\TestCase;

class InvoiceParserServiceTest extends TestCase
{
    public function test_it_extracts_colombian_invoice_values(): void
    {
        $invoice = app(InvoiceParserService::class)->parse([
            'text' => "SUPERMERCADO\nNIT 900123456-7\nFECHA 07/11/2026\nLeche 2 $4.500\nTOTAL $9.000",
            'lines' => [
                ['text' => 'SUPERMERCADO', 'confidence' => 0.99],
                ['text' => 'NIT 900123456-7', 'confidence' => 0.98],
                ['text' => 'FECHA 07/11/2026', 'confidence' => 0.97],
                ['text' => 'Leche 2 $4.500', 'confidence' => 0.95],
                ['text' => 'TOTAL $9.000', 'confidence' => 0.96],
            ],
        ]);

        $this->assertSame('SUPERMERCADO', $invoice['merchant']);
        $this->assertSame('900123456-7', $invoice['nit']);
        $this->assertSame('2026-11-07', $invoice['date']);
        $this->assertSame(9000.0, $invoice['total']);
        $this->assertCount(1, $invoice['items']);
    }

    public function test_it_marks_incomplete_ocr_for_review_without_inventing_totals(): void
    {
        $invoice = app(InvoiceParserService::class)->parse([
            'text' => 'RESTAURANTE\nCONSUMO',
            'lines' => [
                ['text' => 'RESTAURANTE', 'confidence' => 0.98],
                ['text' => 'CONSUMO', 'confidence' => 0.94],
            ],
        ]);

        $this->assertNull($invoice['total']);
        $this->assertTrue($invoice['requires_review']);
    }

    public function test_it_parses_a_colombian_thermal_receipt_without_treating_phone_as_an_item(): void
    {
        $invoice = app(InvoiceParserService::class)->parse([
            'text' => "MINIMARKET\nLA ESQUINA\nNIT 901.234.567-8\nTel: (606) 123 4567\nFecha: 2024-09-17\nFactura de Venta No. 001-000123\n1 x Agua Cristal 600 ml 2.500\n1 x Galletas Saltín 3.200\n1 x Juguito Hit 200 ml 2.800\nTOTAL\n$ 8.500",
            'lines' => [
                ['text' => 'MINIMARKET', 'confidence' => 1],
                ['text' => 'LA ESQUINA', 'confidence' => 1],
                ['text' => 'NIT 901.234.567-8', 'confidence' => 1],
                ['text' => 'Tel: (606) 123 4567', 'confidence' => 1],
                ['text' => 'Fecha: 2024-09-17', 'confidence' => 1],
                ['text' => 'Factura de Venta No. 001-000123', 'confidence' => 1],
                ['text' => '1 x Agua Cristal 600 ml 2.500', 'confidence' => 1],
                ['text' => '1 x Galletas Saltín 3.200', 'confidence' => 1],
                ['text' => '1 x Juguito Hit 200 ml 2.800', 'confidence' => 1],
                ['text' => 'TOTAL', 'confidence' => 1],
                ['text' => '$ 8.500', 'confidence' => 1],
            ],
        ]);

        $this->assertSame('MINIMARKET LA ESQUINA', $invoice['merchant']);
        $this->assertSame('901.234.567-8', $invoice['nit']);
        $this->assertSame('2024-09-17', $invoice['date']);
        $this->assertSame(8500.0, $invoice['total']);
        $this->assertCount(3, $invoice['items']);
        $this->assertFalse($invoice['requires_review']);
    }

    public function test_it_groups_items_from_a_structured_electronic_invoice(): void
    {
        $invoice = app(InvoiceParserService::class)->parse([
            'lines' => collect([
                'TIENDAS DE TODOS!',
                'FACTURA ELECTRONICA DE VENTA N: I914282324',
                'FECHA: 2026-11-06 20:01:24',
                'ITEM CODIGO DESCRIPCION',
                'CANT UN.MED VR UNI VR BASE DTO IVA % IVA VR TOTAL',
                '1 7700304282685 PAPAS FRITAS SABOR B',
                '1',
                'UND',
                '3.400,00 2.857,00',
                '542,86',
                '19,00',
                '3.400,00',
                '2 7700304202096 LIMONADA DE PANELA T',
                '2',
                'UND',
                '8.400,00 7.059,00',
                '1.341,18',
                '19,00',
                '8.400,00',
                '3 7700304609529 CHICHARRON DE CERDO',
                '1',
                'UND',
                '3.990,00 3.800,00',
                '190,00',
                '5,00',
                '3.990,00',
                'TOTAL ARTICULOS: 3',
                'SUBTOTAL: 13.715,96',
                'IVA: 2.074,04',
                'TOTAL: 15.790,00',
            ])->map(fn (string $text) => ['text' => $text, 'confidence' => 0.99])->all(),
        ]);

        $this->assertSame('structured_invoice', $invoice['document_type']);
        $this->assertSame(15790.0, $invoice['total']);
        $this->assertCount(3, $invoice['items']);
        $this->assertSame(['PAPAS FRITAS SABOR B', 'LIMONADA DE PANELA T', 'CHICHARRON DE CERDO'], array_column($invoice['items'], 'description'));
        $this->assertSame([3400.0, 8400.0, 3990.0], array_column($invoice['items'], 'total'));
        $this->assertFalse($invoice['requires_review']);
    }

    public function test_it_parses_thermal_items_when_ocr_splits_price_into_next_line(): void
    {
        $invoice = app(InvoiceParserService::class)->parse([
            'lines' => collect([
                'MINIMARKET LA ESQUINA',
                'Factura de Venta No. 001-000123',
                '1 x Agua Cristal 600 ml',
                '2.500',
                '1 x Galletas Saltín',
                '3.200',
                '1 x Juguito Hit 200 ml',
                '2.800',
                'TOTAL',
                '$ 8.500',
            ])->map(fn (string $text) => ['text' => $text, 'confidence' => 0.99])->all(),
        ]);

        $this->assertCount(3, $invoice['items']);
        $this->assertSame(['Agua Cristal 600 ml', 'Galletas Saltín', 'Juguito Hit 200 ml'], array_column($invoice['items'], 'description'));
        $this->assertSame([2500.0, 3200.0, 2800.0], array_column($invoice['items'], 'total'));
        $this->assertSame(8500.0, $invoice['total']);
    }

    public function test_it_reconstructs_thermal_rows_when_ocr_splits_quantity_and_x(): void
    {
        $invoice = app(InvoiceParserService::class)->parse([
            'lines' => collect([
                'Factura de Venta',
                '1',
                'x',
                'Agua Cristal 600 ml',
                '2.500',
                'TOTAL',
                '$ 2.500',
            ])->map(fn (string $text) => ['text' => $text, 'confidence' => 0.95])->all(),
        ]);

        $this->assertCount(1, $invoice['items']);
        $this->assertSame('Agua Cristal 600 ml', $invoice['items'][0]['description']);
        $this->assertSame(2500.0, $invoice['items'][0]['total']);
    }

    public function test_it_uses_loose_thermal_fallback_when_ocr_drops_the_x(): void
    {
        $invoice = app(InvoiceParserService::class)->parse([
            'lines' => collect([
                'Factura de Venta',
                '1',
                'Agua Cristal 600 ml',
                '2.500',
                '1',
                'Galletas Saltín',
                '3.200',
                'TOTAL',
                '$ 5.700',
            ])->map(fn (string $text) => ['text' => $text, 'confidence' => 0.95])->all(),
        ]);

        $this->assertCount(2, $invoice['items']);
        $this->assertSame(['Agua Cristal 600 ml', 'Galletas Saltín'], array_column($invoice['items'], 'description'));
        $this->assertSame([2500.0, 3200.0], array_column($invoice['items'], 'total'));
    }
}
