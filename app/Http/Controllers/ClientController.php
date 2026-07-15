<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\InteractsWithTenant;
use App\Models\Client;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class ClientController extends Controller
{
    use InteractsWithTenant;

    public function index(Request $request): Response
    {
        abort_unless($this->isSuperAdmin($request), 403);

        return Inertia::render('Crud/Clients', [
            'clients' => Client::query()->withCount('users')->latest()->get(),
        ]);
    }

    public function store(Request $request)
    {
        abort_unless($this->isSuperAdmin($request), 403);

        $data = $this->validated($request);

        DB::transaction(function () use ($data, $request): void {
            $client = Client::create($this->clientData($data));

            $admin = User::create([
                'name' => $data['admin_name'],
                'email' => $data['admin_email'],
                'status' => 'Activo',
                'menu_access' => null,
                'password' => Hash::make($data['admin_password']),
                'email_verified_at' => now(),
                'client_id' => $client->id,
                'created_by' => $request->user()->id,
            ]);

            $admin->syncRoles(['admin']);
        });

        return back()->with('success', 'Cliente y usuario administrador creados.');
    }

    public function update(Request $request, Client $client)
    {
        abort_unless($this->isSuperAdmin($request), 403);

        $client->update($this->validated($request, $client));

        return back()->with('success', 'Cliente actualizado.');
    }

    public function destroy(Request $request, Client $client)
    {
        abort_unless($this->isSuperAdmin($request), 403);

        if ($client->users()->exists()) {
            return back()->with('error', 'No puedes eliminar un cliente con usuarios asociados.');
        }

        $client->delete();

        return back()->with('success', 'Cliente eliminado.');
    }

    private function validated(Request $request, ?Client $client = null): array
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:100', Rule::unique('clients', 'slug')->ignore($client)],
            'contact_phone' => ['nullable', 'string', 'max:30'],
            'contact_email' => ['nullable', 'email', 'max:255'],
            'status' => ['required', 'string', 'max:50'],
            'notes' => ['nullable', 'string'],
            'admin_name' => [$client ? 'nullable' : 'required', 'string', 'max:255'],
            'admin_email' => [$client ? 'nullable' : 'required', 'email', 'max:255', Rule::unique('users', 'email')],
            'admin_password' => [$client ? 'nullable' : 'required', 'string', Password::defaults()],
        ]);

        $validated['slug'] = $this->buildNickname(
            $validated['name'],
            $validated['slug'] ?: $client?->slug,
        );

        return $validated;
    }

    private function clientData(array $data): array
    {
        return collect($data)
            ->except(['admin_name', 'admin_email', 'admin_password'])
            ->all();
    }

    private function buildNickname(string $name, ?string $currentNickname = null): string
    {
        $initials = collect(preg_split('/\s+/', trim($name)) ?: [])
            ->filter()
            ->map(fn (string $part) => Str::lower(Str::substr(Str::ascii($part), 0, 1)))
            ->implode('');

        $initials = Str::limit(preg_replace('/[^a-z0-9]/', '', $initials) ?: 'cli', 6, '');

        $suffix = null;

        if ($currentNickname) {
            $candidate = Str::lower((string) str($currentNickname)->afterLast('-'));

            if (preg_match('/^[a-f0-9]{8}$/', $candidate) === 1) {
                $suffix = $candidate;
            }
        }

        if (! $suffix) {
            $suffix = Str::lower(Str::substr((string) Str::uuid(), 0, 8));
        }

        return "{$initials}-{$suffix}";
    }
}
