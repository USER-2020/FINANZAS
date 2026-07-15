<?php

namespace Database\Seeders;

use App\Models\Department;
use Illuminate\Database\Seeder;

class DepartmentsSeeder extends Seeder
{
    public static function definitions(): array
    {
        return [
            [
                'name' => 'Casa',
                'code' => 'CASA',
                'manager' => 'Por asignar',
                'monthly_budget' => 0,
                'status' => 'Activo',
                'notes' => "Diseno de red internet / modems\nLobby: monitoreo de camaras\nLlaves generales y acceso\nAcceso: chapa digital para puerta de vidrio\nModems\nDispensador de alcohol\nCortineria\nAmbientaciones",
            ],
            [
                'name' => 'Implementaciones de marca - Fase 1',
                'code' => 'MARCA-F1',
                'manager' => 'Por asignar',
                'monthly_budget' => 0,
                'status' => 'Activo',
                'notes' => "Impresos de marca\nLobby tapete\nAplicaciones de marca",
            ],
            [
                'name' => 'Implementaciones de marca - Fase 2',
                'code' => 'MARCA-F2',
                'manager' => 'Por asignar',
                'monthly_budget' => 0,
                'status' => 'Activo',
                'notes' => null,
            ],
            [
                'name' => 'Implementaciones de marca - Fase 3',
                'code' => 'MARCA-F3',
                'manager' => 'Por asignar',
                'monthly_budget' => 0,
                'status' => 'Activo',
                'notes' => null,
            ],
            [
                'name' => 'Lobby',
                'code' => 'LOBBY',
                'manager' => 'Por asignar',
                'monthly_budget' => 0,
                'status' => 'Activo',
                'notes' => "Dispensador comida\nDispensador cafe",
            ],
            [
                'name' => 'Journey admision',
                'code' => 'ADMISION',
                'manager' => 'Por asignar',
                'monthly_budget' => 0,
                'status' => 'Activo',
                'notes' => "Website ingreso\nFormulario datos personales\nOnboarding autogestion de datos\nVerificacion de datos\nSeleccion y entrevista\nIngreso del sistema dactilar y al sistema",
            ],
            [
                'name' => 'Kit de inicio',
                'code' => 'KIT-INICIO',
                'manager' => 'Por asignar',
                'monthly_budget' => 0,
                'status' => 'Activo',
                'notes' => "Bata\nToalla\nJuego lenceria\nKit de aseo\nJuguete obligatorio\nReglamento interno\nLubricante",
            ],
            [
                'name' => 'Recomendaciones personales',
                'code' => 'REC-PER',
                'manager' => 'Por asignar',
                'monthly_budget' => 0,
                'status' => 'Activo',
                'notes' => null,
            ],
            [
                'name' => 'Monitoreo y oficinas',
                'code' => 'MON-OFI',
                'manager' => 'Por asignar',
                'monthly_budget' => 0,
                'status' => 'Activo',
                'notes' => "Rack internet y espacio de trabajo\nSala de descanso\nServidor general\nPC monitoreo: x1 computador monitor",
            ],
            [
                'name' => 'Recursos humanos',
                'code' => 'RRHH',
                'manager' => 'Por asignar',
                'monthly_budget' => 0,
                'status' => 'Activo',
                'notes' => 'PC de RR.HH admin proyecto seguimiento',
            ],
            [
                'name' => 'Banos',
                'code' => 'BANOS',
                'manager' => 'Por asignar',
                'monthly_budget' => 0,
                'status' => 'Activo',
                'notes' => "Mantenimiento\nHorno microondas",
            ],
            [
                'name' => 'Cocina',
                'code' => 'COCINA',
                'manager' => 'Por asignar',
                'monthly_budget' => 0,
                'status' => 'Activo',
                'notes' => "Nevera y accesorios\nUtileria de cocina - vajilla\nInventario",
            ],
            [
                'name' => 'Zona de lavado',
                'code' => 'LAVADO',
                'manager' => 'Por asignar',
                'monthly_budget' => 0,
                'status' => 'Activo',
                'notes' => "Lavadora secadora\nAlmacenamiento",
            ],
            [
                'name' => 'Zona de almacenamiento',
                'code' => 'ALMACEN',
                'manager' => 'Por asignar',
                'monthly_budget' => 0,
                'status' => 'Activo',
                'notes' => "Estanteria\nAlmacenamientos",
            ],
            [
                'name' => 'Zonas comunes',
                'code' => 'ZONAS-COM',
                'manager' => 'Por asignar',
                'monthly_budget' => 0,
                'status' => 'Activo',
                'notes' => null,
            ],
            [
                'name' => 'Cuartos - Tech',
                'code' => 'CTOS-TECH',
                'manager' => 'Por asignar',
                'monthly_budget' => 0,
                'status' => 'Activo',
                'notes' => "x3 computador - webcam - teclado - mouse\nMesa - silla\nCamara habitacion\nIluminacion\nVentilador",
            ],
            [
                'name' => 'Cuartos - Arte',
                'code' => 'CTOS-ARTE',
                'manager' => 'Por asignar',
                'monthly_budget' => 0,
                'status' => 'Activo',
                'notes' => null,
            ],
        ];
    }

    public function run(): void
    {
        foreach (self::definitions() as $department) {
            Department::updateOrCreate(
                ['client_id' => null, 'code' => $department['code']],
                $department,
            );
        }
    }
}
