<?php

namespace App\Http\Controllers;

use App\Support\PublicVideoLibrary;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function index(Request $request): Response
    {
        $pages = collect([
            [
                'loc' => url('/'),
                'lastmod' => now()->toDateString(),
                'changefreq' => 'weekly',
                'priority' => '1.0',
            ],
        ]);

        $videoPages = PublicVideoLibrary::all()
            ->map(fn (array $video) => [
                'loc' => $video['shareUrl'],
                'lastmod' => now()->setTimestamp($video['lastModified'])->toDateString(),
                'changefreq' => 'monthly',
                'priority' => '0.8',
            ]);

        $xml = view('seo.sitemap', [
            'pages' => $pages->merge($videoPages)->values(),
        ])->render();

        return response($xml, 200, [
            'Content-Type' => 'application/xml; charset=UTF-8',
        ]);
    }
}
