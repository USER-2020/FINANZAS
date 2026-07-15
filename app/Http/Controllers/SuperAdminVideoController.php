<?php

namespace App\Http\Controllers;

use App\Support\PublicVideoLibrary;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SuperAdminVideoController extends Controller
{
    public function index(Request $request): Response
    {
        abort_unless($request->user()?->isSuperAdmin(), 403);

        return Inertia::render('Crud/SuperAdminVideos', [
            'videos' => PublicVideoLibrary::all()->values()->all(),
        ]);
    }

    public function showPublic(string $video)
    {
        $record = PublicVideoLibrary::all()->firstWhere('slug', $video);

        abort_unless($record, 404);

        return response()->view('videos.share', [
            'video' => $record,
            'otherVideos' => PublicVideoLibrary::all()
                ->reject(fn (array $item) => $item['slug'] === $record['slug'])
                ->take(4)
                ->values()
                ->all(),
        ]);
    }
}
