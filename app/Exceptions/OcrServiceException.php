<?php

namespace App\Exceptions;

use RuntimeException;

class OcrServiceException extends RuntimeException
{
    public function __construct(string $message, public readonly int $status = 502, ?\Throwable $previous = null)
    {
        parent::__construct($message, $status, $previous);
    }
}
