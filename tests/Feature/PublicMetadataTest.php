<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicMetadataTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_login_shell_exposes_spanish_social_and_structured_metadata(): void
    {
        $response = $this->get('/login');

        $response->assertOk();
        $response->assertSee('Plataforma financiera multi-tenant en español', false);
        $response->assertSee('property="og:locale" content="es_CO"', false);
        $response->assertSee('name="twitter:card" content="summary_large_image"', false);
        $response->assertSee('pwa/og-image.png', false);
        $response->assertSee('"@type":"SoftwareApplication"', false);
        $response->assertSee('"inLanguage":"es-CO"', false);
    }
}
