<!DOCTYPE html>
<html lang="es">
    <head>
        <meta charset="utf-8">
        <title>Bienvenido a Finanzas OS</title>
    </head>
    <body style="margin:0; padding:24px; background:#07131b; color:#f8fafc; font-family:Figtree, Segoe UI, Arial, sans-serif;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px; margin:0 auto; background:#10212d; border:1px solid rgba(255,255,255,0.08); border-radius:24px; overflow:hidden;">
            <tr>
                <td style="padding:32px;">
                    <div style="display:inline-block; padding:10px 14px; border-radius:14px; background:rgba(34,211,238,0.12); color:#a5f3fc; font-weight:700; letter-spacing:0.08em;">
                        FINANZAS OS
                    </div>

                    <h1 style="margin:24px 0 12px; font-size:30px; line-height:1.2; color:#ffffff;">
                        Bienvenido a tu nuevo espacio financiero
                    </h1>

                    <p style="margin:0 0 20px; font-size:16px; line-height:1.7; color:#cbd5e1;">
                        Hola {{ $admin->name }}, tu acceso inicial para <strong style="color:#ffffff;">{{ $client->name }}</strong> ya fue creado correctamente.
                    </p>

                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:24px 0; background:#0b1d29; border:1px solid rgba(255,255,255,0.08); border-radius:20px;">
                        <tr>
                            <td style="padding:22px 24px;">
                                <p style="margin:0 0 8px; font-size:13px; text-transform:uppercase; letter-spacing:0.08em; color:#67e8f9;">Cliente</p>
                                <p style="margin:0 0 18px; font-size:18px; color:#ffffff;">{{ $client->name }}</p>

                                <p style="margin:0 0 8px; font-size:13px; text-transform:uppercase; letter-spacing:0.08em; color:#67e8f9;">Correo de acceso</p>
                                <p style="margin:0 0 18px; font-size:18px; color:#ffffff;">{{ $admin->email }}</p>

                                <p style="margin:0 0 8px; font-size:13px; text-transform:uppercase; letter-spacing:0.08em; color:#67e8f9;">Contraseña inicial</p>
                                <p style="margin:0; font-size:18px; color:#ffffff;">{{ $plainPassword }}</p>
                            </td>
                        </tr>
                    </table>

                    <p style="margin:0 0 24px; font-size:15px; line-height:1.7; color:#cbd5e1;">
                        Por seguridad, te recomendamos iniciar sesión lo antes posible y cambiar tu contraseña desde el perfil.
                    </p>

                    <a href="{{ $loginUrl }}" style="display:inline-block; padding:14px 22px; border-radius:14px; background:linear-gradient(90deg,#0891b2,#10b981); color:#ffffff; text-decoration:none; font-weight:700;">
                        Ingresar a la plataforma
                    </a>

                    <p style="margin:28px 0 0; font-size:14px; line-height:1.7; color:#94a3b8;">
                        Si no esperabas este correo, por favor contacta al administrador principal de la plataforma.
                    </p>
                </td>
            </tr>
        </table>
    </body>
</html>
