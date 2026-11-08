<?php

namespace App\Services\Invoices;

use Carbon\Carbon;

class InvoiceParserService
{
    /**
     * @param array{text: string, lines: array<int, array{text: string, confidence: float|null}>} $ocr
     * @return array<string, mixed>
     */
    public function parse(array $ocr): array
    {
        $lines = collect($ocr['lines'] ?? [])
            ->pluck('text')
            ->filter(fn ($line) => is_string($line) && trim($line) !== '')
            ->map(fn (string $line) => trim(preg_replace('/\s+/', ' ', $line)))
            ->values();
        $text = $lines->implode("\n");

        $total = $this->amountNear($lines, ['total', 'total pagado', 'valor a pagar', 'importe']);
        $subtotal = $this->amountNear($lines, ['subtotal', 'base gravable']);
        $tax = $this->amountNear($lines, ['iva', 'impuesto', 'tributo']);
        $discount = $this->amountNear($lines, ['descuento']);

        $items = $this->items($lines);
        $confidenceValues = collect($ocr['lines'] ?? [])->pluck('confidence')->filter(fn ($value) => is_numeric($value));
        $confidence = $confidenceValues->isNotEmpty() ? round((float) $confidenceValues->avg(), 4) : null;
        $requiresReview = $total === null || $confidence === null || $confidence < 0.88 || $this->itemsMismatch($items, $total);

        return [
            'document_type' => $this->documentType($lines, $items),
            'merchant' => $this->merchant($lines),
            'nit' => $this->nit($text),
            'invoice_number' => $this->match($text, '/\b(?:factura|fact\.?|invoice|n[uú]mero|no\.?)\s*(?:de\s*venta)?\s*[:#-]?\s*([A-Z0-9][A-Z0-9-]{2,})/i'),
            'date' => $this->date($text),
            'currency' => 'COP',
            'subtotal' => $subtotal,
            'tax' => $tax,
            'discount' => $discount,
            'total' => $total,
            'items' => $items,
            'requires_review' => $requiresReview,
            'confidence' => $confidence,
            'raw_text' => $text,
        ];
    }

    private function merchant($lines): ?string
    {
        $merchantLines = $lines->take(6)
            ->takeWhile(fn (string $line) => ! preg_match('/^(nit|fecha|factura|tel[eé]fono|tel\.?|calle|carrera|direcci[oó]n|r[eé]gimen|\d+\s*x\s+)/i', $line))
            ->reject(fn (string $line) => preg_match('/(factura|nit|fecha|tel[eé]fono|r[eé]gimen|direcci[oó]n|total)/i', $line))
            ->reject(fn (string $line) => preg_match('/^\+?[\d\s().-]+$/', $line))
            ->take(2)
            ->values()
            ->all();

        return count($merchantLines) > 0 ? implode(' ', $merchantLines) : null;
    }

    private function date(string $text): ?string
    {
        if (! preg_match('/\b(\d{1,2})[\/-](\d{1,2})[\/-](\d{2,4})\b/', $text, $match)) {
            if (! preg_match('/\b(\d{4})[\/-](\d{1,2})[\/-](\d{1,2})\b/', $text, $match)) {
                return null;
            }

            return $this->safeDate($match[1], $match[2], $match[3], 'Y-m-d');
        }

        $year = strlen($match[3]) === 2 ? '20'.$match[3] : $match[3];
        return $this->safeDate($year, $match[2], $match[1], 'Y-m-d');
    }

    private function safeDate(string $year, string $month, string $day, string $format): ?string
    {
        try {
            return Carbon::createFromFormat($format, sprintf('%04d-%02d-%02d', $year, $month, $day))->format('Y-m-d');
        } catch (\Throwable) {
            return null;
        }
    }

    private function amountNear($lines, array $labels): ?float
    {
        // Primero buscamos importes en la misma línea del rótulo. Se ignoran
        // encabezados como "VR TOTAL" y "TOTAL ARTICULOS", que no son totales.
        foreach ($lines as $index => $line) {
            foreach ($labels as $label) {
                if (preg_match('/\b'.preg_quote($label, '/').'\b.*?((?:COP\s*)?\$?\s*[0-9][0-9.,]*)/i', $line, $match)
                    && ! preg_match('/\b(?:vr|valor)\s+total\b|\btotal\s+art[ií]culos?\b/i', $line)) {
                    $amount = $this->money($match[1]);
                    if ($amount !== null) return $amount;
                }
            }
        }

        // En recibos térmicos el rótulo y el importe pueden llegar separados.
        // Solo se permite cuando la línea es exactamente el rótulo; así no se
        // confunde "VR TOTAL" con el total de la compra.
        foreach ($lines as $index => $line) {
            foreach ($labels as $label) {
                if (! preg_match('/^\s*'.preg_quote($label, '/').'\s*:?\s*$/i', $line)) {
                    continue;
                }

                foreach ([$lines->get($index + 1), $lines->get($index + 2), $lines->get($index + 3)] as $nearbyLine) {
                    if (is_string($nearbyLine) && preg_match('/(?:COP\s*)?\$?\s*([0-9][0-9.,]*)\s*$/i', $nearbyLine, $nearbyMatch)) {
                        $amount = $this->money($nearbyMatch[1]);
                        if ($amount !== null) return $amount;
                    }
                }
            }
        }

        return null;
    }

    private function items($lines): array
    {
        $structured = $this->structuredItems($lines);
        if ($structured !== []) {
            return $structured;
        }

        $thermal = $this->thermalItems($lines);
        if ($thermal !== []) {
            return $thermal;
        }

        $invoiceStart = $lines->search(fn (string $line) => preg_match('/factura\s+(?:de\s+)?venta|invoice/i', $line));
        $candidateLines = $invoiceStart !== false ? $lines->slice($invoiceStart + 1) : $lines;

        return $candidateLines
            ->takeWhile(fn (string $line) => ! preg_match('/^(total|subtotal|iva|impuesto|descuento|medio\s+de\s+pago|pago|efectivo|cambio)/i', $line))
            ->map(fn (string $line) => $this->parseItemLine($line))
            ->filter()
            ->take(20)
            ->values()
            ->all();
    }

    /**
     * Lee recibos térmicos donde el OCR entrega el producto y el importe en
     * cajas distintas. Ejemplo: "1 x Agua Cristal" seguido de "2.500".
     */
    private function thermalItems($lines): array
    {
        $start = $lines->search(fn (string $line) => preg_match('/factura\s+(?:de\s+)?venta|medio\s+de\s+pago|\d+\s*x\s+/i', $line));
        $candidateLines = $start === false ? $lines : $lines->slice($start + 1);
        $items = [];
        $count = $candidateLines->count();

        for ($index = 0; $index < $count; $index++) {
            $line = trim((string) $candidateLines->get($index));
            $match = null;

            if (preg_match('/^(?:total|subtotal|iva|impuesto|descuento|medio\s+de\s+pago|pago|efectivo|cambio)/i', $line)) {
                break;
            }

            if (! preg_match('/^\s*(\d+(?:[.,]\d+)?)\s*x\s+(.+?)(?:\s+(?:COP\s*)?\$?\s*([0-9][0-9.,]{2,}))?\s*$/i', $line, $match)) {
                // PaddleOCR también puede separar "1", "x" y la descripción
                // en detecciones consecutivas. Reconstruimos la fila antes de
                // descartarla.
                $combined = $line;
                $combinedIndex = $index;
                for ($lookAhead = $index + 1; $lookAhead < min($index + 5, $count); $lookAhead++) {
                    $combined .= ' '.trim((string) $candidateLines->get($lookAhead));
                    if (preg_match('/^\s*(\d+(?:[.,]\d+)?)\s*x\s+(.+?)\s+(?:COP\s*)?\$?\s*([0-9][0-9.,]{2,})\s*$/i', $combined, $combinedMatch)) {
                        $match = $combinedMatch;
                        $combinedIndex = $lookAhead;
                        break;
                    }
                }

                if (! isset($match[1], $match[2])) {
                    continue;
                }

                $index = $combinedIndex;
            }

            $quantity = $this->quantity($match[1]);
            $description = trim($match[2]);
            $total = isset($match[3]) ? $this->money($match[3]) : null;

            // Precio separado en la siguiente línea o después de una línea
            // adicional de descripción.
            $lookAhead = $index + 1;
            while ($total === null && $lookAhead < min($index + 4, $count)) {
                $nearby = trim((string) $candidateLines->get($lookAhead));
                if (preg_match('/^(?:COP\s*)?\$?\s*([0-9][0-9.,]*)\s*$/i', $nearby, $amountMatch)) {
                    $total = $this->money($amountMatch[1]);
                    $index = $lookAhead;
                    break;
                }

                if (! preg_match('/^(?:total|subtotal|iva|impuesto|descuento|medio\s+de\s+pago|pago|efectivo|cambio)/i', $nearby)
                    && ! preg_match('/^\s*\d+(?:[.,]\d+)?\s*x\s+/i', $nearby)) {
                    $description .= ' '.trim($nearby);
                }
                $lookAhead++;
            }

            if ($total === null) {
                continue;
            }

            $items[] = [
                'description' => trim($description),
                'quantity' => $quantity,
                'unit_price' => round($total / max($quantity, 1), 2),
                'line_total' => $total,
                'total' => $total,
            ];

            unset($match);
        }

        if ($items === []) {
            $items = $this->thermalLooseItems($candidateLines);
        }

        return array_slice($items, 0, 20);
    }

    /**
     * Último fallback para OCR que devuelve cada palabra en una caja distinta:
     * "Agua Cristal 600 ml" y después "2.500", sin conservar la x.
     */
    private function thermalLooseItems($lines): array
    {
        $items = [];
        $history = [];

        foreach ($lines as $line) {
            $line = trim((string) $line);

            if (preg_match('/^(?:total|subtotal|iva|impuesto|descuento|medio\s+de\s+pago|pago|efectivo|cambio)/i', $line)) {
                break;
            }

            if (preg_match('/^(?:COP\s*)?\$?\s*([0-9][0-9.,]*)\s*$/i', $line, $amountMatch)
                && (preg_match('/[.,]/', $amountMatch[1]) || $this->money($amountMatch[1]) >= 1000)) {
                $total = $this->money($amountMatch[1]);
                $description = trim(implode(' ', $history));
                $description = preg_replace('/^\s*\d+(?:[.,]\d+)?\s*x?\s*/i', '', $description) ?? $description;
                $description = preg_replace('/\s+/', ' ', $description);

                if ($total !== null && $description !== '' && ! preg_match('/(fecha|hora|nit|tel[eé]fono|direcci[oó]n|factura|calle|carrera)/i', $description)) {
                    $quantity = 1.0;
                    if (preg_match('/^\s*(\d+(?:[.,]\d+)?)\s+(?:x\s+)?/i', implode(' ', $history), $quantityMatch)) {
                        $quantity = $this->quantity($quantityMatch[1]);
                    }

                    $items[] = [
                        'description' => trim($description),
                        'quantity' => $quantity,
                        'unit_price' => round($total / max($quantity, 1), 2),
                        'line_total' => $total,
                        'total' => $total,
                    ];
                }

                $history = [];
                continue;
            }

            $history[] = $line;
            $history = array_slice($history, -8);
        }

        return $items;
    }

    /**
     * Agrupa las líneas de facturas electrónicas que tienen una tabla de
     * productos. En OCR cada fila suele llegar fragmentada en varias líneas:
     * código/descripción, cantidad, unidad, valores e importe final.
     */
    private function structuredItems($lines): array
    {
        $tableStart = false;

        // PaddleOCR puede devolver el encabezado en una sola línea o separado
        // en varias cajas de texto. Buscamos las palabras dentro de una ventana.
        foreach ($lines as $index => $line) {
            $headerWindow = $lines->slice($index, 6)->implode(' ');
            if (preg_match('/\b(?:item|ítem)\b/i', $headerWindow)
                && preg_match('/\b(?:codigo|código|descripcion|descripción)\b/i', $headerWindow)) {
                $tableStart = $index;
                break;
            }
        }

        // Si el OCR perdió el encabezado, el código de barras permite localizar
        // el comienzo de la tabla igualmente.
        if ($tableStart === false) {
            $productStart = $lines->search(fn (string $line) => preg_match('/^\s*\d+\s+\d{8,15}(?:\s+.*)?$/', $line));
            $tableStart = $productStart === false ? false : max(0, $productStart - 1);
        }

        if ($tableStart === false) {
            return [];
        }

        $candidateLines = $lines->slice($tableStart + 1)->values();
        $groups = [];
        $current = null;

        foreach ($candidateLines as $line) {
            if (preg_match('/^\s*(\d+)\s+(\d{8,15})(?:\s+(.+?))?\s*$/', $line, $match)) {
                if ($current !== null) {
                    $groups[] = $current;
                }

                $current = [
                    'description' => trim($match[3] ?? ''),
                    'quantity' => null,
                    'lines' => [],
                ];
                continue;
            }

            if (preg_match('/^(?:total\s+art[ií]culos?|subtotal|descuento|base\s*\/\s*imp|iva|total|forma\s+de\s+pago|medio\s+de\s+pago)/i', $line)) {
                break;
            }

            if ($current === null) {
                continue;
            }

            // En algunos documentos la descripción llega en la caja siguiente
            // al código. No debemos convertir "UND" en el nombre del producto.
            if ($current['description'] === ''
                && ! preg_match('/^(?:und|unidad|un|kg|g|lb|litro|lt|ml)$/i', $line)
                && ! preg_match('/^\s*\d+(?:[.,]\d+)?\s*$/', $line)) {
                $current['description'] = trim($line);
                continue;
            }

            $current['lines'][] = $line;

            // La cantidad suele aparecer sola después de la descripción.
            if ($current['quantity'] === null && preg_match('/^\s*(\d+(?:[.,]\d+)?)\s*$/', $line, $quantityMatch)) {
                $current['quantity'] = $this->quantity($quantityMatch[1]);
            }
        }

        if ($current !== null) {
            $groups[] = $current;
        }

        return collect($groups)
            ->map(function (array $group): ?array {
                $amounts = [];

                foreach ($group['lines'] as $line) {
                    preg_match_all('/(?:COP\s*)?\$?\s*([0-9]{1,3}(?:[.,][0-9]{3})*(?:,[0-9]{2})?|[0-9]+(?:,[0-9]{2})?)\b/i', $line, $matches);
                    foreach ($matches[1] ?? [] as $value) {
                        $amount = $this->money($value);
                        if ($amount !== null) {
                            $amounts[] = $amount;
                        }
                    }
                }

                if ($amounts === []) {
                    return null;
                }

                $lineTotal = (float) end($amounts);
                $quantity = (float) ($group['quantity'] ?: 1);

                return [
                    'description' => $group['description'],
                    'quantity' => $quantity,
                    'unit_price' => round($lineTotal / max($quantity, 1), 2),
                    'line_total' => $lineTotal,
                    'total' => $lineTotal,
                ];
            })
            ->filter()
            ->take(20)
            ->values()
            ->all();
    }

    private function parseItemLine(string $line): ?array
    {
        // Formato habitual: 1 x Producto 2.500
        if (preg_match('/^\s*(\d+(?:[.,]\d+)?)\s*x\s+(.+?)\s+(?:COP\s*)?\$?\s*([0-9][0-9.,]{2,})\s*$/i', $line, $match)) {
            $quantity = $this->quantity($match[1]);
            $total = $this->money($match[3]);
            if ($total !== null) {
                return [
                    'description' => trim($match[2]),
                    'quantity' => $quantity,
                    'unit_price' => round($total / max($quantity, 1), 2),
                    'line_total' => $total,
                    'total' => $total,
                ];
            }
        }

        // Formato compacto usado por algunos OCR: Producto 2 $4.500
        if (preg_match('/^(.+?)\s+(\d+(?:[.,]\d+)?)\s+(?:COP\s*)?\$?\s*([0-9][0-9.,]{2,})\s*$/i', $line, $match)) {
            if (preg_match('/(tel[eé]fono|direcci[oó]n|fecha|hora|nit|factura|calle|carrera)/i', $match[1])) return null;
            $quantity = $this->quantity($match[2]);
            $total = $this->money($match[3]);
            if ($total !== null) {
                return [
                    'description' => trim($match[1]),
                    'quantity' => $quantity,
                    'unit_price' => round($total / max($quantity, 1), 2),
                    'line_total' => $total,
                    'total' => $total,
                ];
            }
        }

        return null;
    }

    private function documentType($lines, array $items): string
    {
        $text = strtolower($lines->implode(' '));

        if (count($items) > 0 && preg_match('/medio\s+de\s+pago|factura\s+de\s+venta|\d+\s*x\s+/i', $text)) {
            return 'thermal_receipt';
        }

        if (preg_match('/iva|subtotal|impuesto|cufe|resoluci[oó]n|fecha\s+de\s+emisi[oó]n/i', $text)) {
            return 'structured_invoice';
        }

        return 'generic_document';
    }

    private function quantity(string $value): float
    {
        return (float) str_replace(',', '.', $value);
    }

    private function nit(string $text): ?string
    {
        if (! preg_match('/\bNIT\s*[:#-]?\s*([0-9][0-9.\s]{5,20}-\s?[0-9])\b/i', $text, $match)) return null;
        return preg_replace('/\s+/', '', trim($match[1]));
    }

    private function itemsMismatch(array $items, ?float $total): bool
    {
        if ($total === null || count($items) === 0) return false;
        $sum = array_sum(array_column($items, 'total'));
        return abs($sum - $total) > 1;
    }

    private function match(string $text, string $pattern): ?string
    {
        return preg_match($pattern, $text, $match) ? trim($match[1]) : null;
    }

    private function money(string $value): ?float
    {
        $clean = strtoupper(trim($value));
        $clean = preg_replace('/[^0-9.,-]/', '', $clean) ?? '';
        if ($clean === '' || ! preg_match('/\d/', $clean)) return null;
        $lastComma = strrpos($clean, ',');
        $lastDot = strrpos($clean, '.');
        if ($lastComma !== false && $lastDot !== false) {
            $decimal = $lastComma > $lastDot ? ',' : '.';
            $thousands = $decimal === ',' ? '.' : ',';
            $clean = str_replace($thousands, '', $clean);
            $clean = str_replace($decimal, '.', $clean);
        } elseif ($lastComma !== false) {
            $clean = substr_count($clean, ',') > 1 || strlen($clean) - $lastComma - 1 === 3 ? str_replace(',', '', $clean) : str_replace(',', '.', $clean);
        } elseif ($lastDot !== false) {
            $clean = substr_count($clean, '.') > 1 || strlen($clean) - $lastDot - 1 === 3 ? str_replace('.', '', $clean) : $clean;
        }
        return is_numeric($clean) ? round((float) $clean, 2) : null;
    }
}
