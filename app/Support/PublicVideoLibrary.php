<?php

namespace App\Support;

use Illuminate\Support\Collection;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class PublicVideoLibrary
{
    public static function all(): Collection
    {
        $directory = public_path('videos');

        if (! File::isDirectory($directory)) {
            return collect();
        }

        return collect(File::files($directory))
            ->filter(fn ($file) => in_array(strtolower($file->getExtension()), ['mp4', 'webm', 'mov'], true))
            ->sortByDesc(fn ($file) => $file->getMTime())
            ->values()
            ->values()
            ->map(function ($file, int $index) {
                $filename = $file->getFilename();
                $basename = pathinfo($filename, PATHINFO_FILENAME);
                $normalized = self::normalizeName($basename);
                $label = $normalized['title'];
                $slug = $normalized['slug'];

                if ($index > 0) {
                    $label .= ' #'.($index + 1);
                    $slug .= '-'.($index + 1);
                }

                return [
                    'slug' => $slug,
                    'title' => $label,
                    'filename' => $filename,
                    'extension' => strtolower($file->getExtension()),
                    'size' => $file->getSize(),
                    'lastModified' => $file->getMTime(),
                    'publicUrl' => asset('videos/'.$filename),
                    'shareUrl' => route('videos.share.show', $slug),
                ];
            });
    }

    private static function normalizeName(string $basename): array
    {
        $clean = Str::of($basename)
            ->replaceMatches('/_\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}$/', '')
            ->replaceMatches('/-\d{4}-\d{2}-\d{2}-\d{2}-\d{2}-\d{2}$/', '')
            ->replace(['_', '-'], ' ')
            ->squish()
            ->lower()
            ->toString();

        return match (true) {
            str_contains($clean, 'hyperframes workspace') => [
                'title' => 'Video comercial Finanzas OS',
                'slug' => 'video-comercial-finanzas-os',
            ],
            str_contains($clean, 'admin onboarding') => [
                'title' => 'Onboarding de administrador',
                'slug' => 'onboarding-administrador',
            ],
            default => [
                'title' => Str::of($clean)->title()->toString(),
                'slug' => Str::slug($clean),
            ],
        };
    }
}
