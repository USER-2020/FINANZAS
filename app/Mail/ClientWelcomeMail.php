<?php

namespace App\Mail;

use App\Models\Client;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ClientWelcomeMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Client $client,
        public User $admin,
        public string $plainPassword,
    ) {
    }

    public function build(): static
    {
        return $this->subject('Bienvenido a Finanzas OS')
            ->view('emails.client-welcome')
            ->with([
                'loginUrl' => route('login'),
            ]);
    }
}
