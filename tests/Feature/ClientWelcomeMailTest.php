<?php

namespace Tests\Feature;

use App\Mail\ClientWelcomeMail;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class ClientWelcomeMailTest extends TestCase
{
    use RefreshDatabase;

    public function test_creating_a_client_sends_a_welcome_email_to_the_initial_admin(): void
    {
        Mail::fake();

        Role::create(['name' => 'super_admin']);
        Role::create(['name' => 'admin']);

        $superAdmin = User::factory()->create();
        $superAdmin->assignRole('super_admin');

        $response = $this->actingAs($superAdmin)->post(route('clients.store'), [
            'name' => 'Cliente Demo',
            'slug' => 'cliente-demo',
            'contact_phone' => '+57 300 000 0000',
            'contact_email' => 'contacto@cliente-demo.test',
            'status' => 'Activo',
            'notes' => 'Cliente de prueba',
            'admin_name' => 'Admin Demo',
            'admin_email' => 'admin@cliente-demo.test',
            'admin_password' => 'Password123!',
        ]);

        $response->assertSessionHas('success');

        $this->assertDatabaseHas('clients', [
            'name' => 'Cliente Demo',
            'contact_email' => 'contacto@cliente-demo.test',
        ]);

        $this->assertDatabaseHas('users', [
            'name' => 'Admin Demo',
            'email' => 'admin@cliente-demo.test',
            'status' => 'Activo',
        ]);

        Mail::assertSent(ClientWelcomeMail::class, function (ClientWelcomeMail $mail): bool {
            return $mail->hasTo('admin@cliente-demo.test')
                && $mail->client->name === 'Cliente Demo'
                && $mail->admin->name === 'Admin Demo'
                && $mail->plainPassword === 'Password123!';
        });
    }
}
