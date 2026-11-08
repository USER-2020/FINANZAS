<?php

namespace App\Http\Controllers;

use App\Models\TourCompletion;
use Illuminate\Http\Request;

class DriverTourController extends Controller
{
    public function complete(Request $request, string $tourKey)
    {
        $knownKeys = collect(config('navigation.superadmin'))
            ->merge(config('navigation.tenant'))
            ->pluck('key')
            ->unique()
            ->all();

        abort_unless(in_array($tourKey, $knownKeys, true), 404);

        $data = $request->validate([
            'version' => ['required', 'string', 'max:100'],
        ]);

        TourCompletion::updateOrCreate(
            [
                'user_id' => $request->user()->id,
                'tour_key' => $tourKey,
                'version' => $data['version'],
            ],
            ['completed_at' => now()],
        );

        return back()->with('status', 'Guía completada.');
    }
}
