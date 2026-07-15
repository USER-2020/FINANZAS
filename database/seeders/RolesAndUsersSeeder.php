<?php

namespace Database\Seeders;

use App\Models\Client;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolesAndUsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        User::query()
            ->whereIn('email', ['admin@velvet.test', 'contador@velvet.test'])
            ->get()
            ->each(function (User $user): void {
                $user->departments()->detach();
                $user->syncRoles([]);
                $user->delete();
            });

        $modules = [
            'clients',
            'departments',
            'financial-movements',
            'purchases',
            'inventory-items',
            'reports',
            'users',
        ];

        $actions = ['view', 'create', 'update', 'delete'];
        $permissions = [];

        foreach ($modules as $module) {
            foreach ($actions as $action) {
                $permissions[] = "{$action} {$module}";
            }
        }

        foreach ($permissions as $permission) {
            Permission::firstOrCreate([
                'name' => $permission,
                'guard_name' => 'web',
            ]);
        }

        $superAdmin = Role::firstOrCreate([
            'name' => 'super_admin',
            'guard_name' => 'web',
        ]);

        $admin = Role::firstOrCreate([
            'name' => 'admin',
            'guard_name' => 'web',
        ]);

        $contador = Role::firstOrCreate([
            'name' => 'contador',
            'guard_name' => 'web',
        ]);

        $jefeDepartamento = Role::firstOrCreate([
            'name' => 'jefe_departamento',
            'guard_name' => 'web',
        ]);

        $superAdmin->syncPermissions([
            'view clients',
            'create clients',
            'update clients',
            'delete clients',
            'view users',
            'create users',
            'update users',
            'delete users',
        ]);
        $admin->syncPermissions(array_values(array_filter($permissions, fn ($permission) => ! str_contains($permission, 'clients'))));
        $contador->syncPermissions([
            'view departments',
            'view financial-movements',
            'create financial-movements',
            'update financial-movements',
            'delete financial-movements',
            'view purchases',
            'update purchases',
            'view inventory-items',
            'view reports',
            'create reports',
            'update reports',
        ]);
        $jefeDepartamento->syncPermissions([
            'view departments',
            'view financial-movements',
            'create financial-movements',
            'update financial-movements',
            'view purchases',
            'create purchases',
            'update purchases',
            'view inventory-items',
            'create inventory-items',
            'update inventory-items',
            'view reports',
            'create reports',
            'update reports',
        ]);

        $defaultClient = Client::query()->firstOrCreate(
            ['slug' => 'cliente-principal'],
            ['name' => 'Cliente Principal', 'status' => 'Activo'],
        );

        $superAdminUser = User::updateOrCreate(
            ['email' => 'superadmin@finanzas.test'],
            [
                'name' => 'Super Admin',
                'status' => 'Activo',
                'email_verified_at' => now(),
                'password' => Hash::make('password'),
                'client_id' => null,
                'created_by' => null,
            ],
        );

        $adminUser = User::updateOrCreate(
            ['email' => 'admin@finanzas.test'],
            [
                'name' => 'Admin Cliente',
                'status' => 'Activo',
                'menu_access' => null,
                'email_verified_at' => now(),
                'password' => Hash::make('password'),
                'client_id' => $defaultClient->id,
                'created_by' => $superAdminUser->id,
            ],
        );

        $contadorUser = User::updateOrCreate(
            ['email' => 'contador@finanzas.test'],
            [
                'name' => 'Contador Cliente',
                'status' => 'Activo',
                'menu_access' => null,
                'email_verified_at' => now(),
                'password' => Hash::make('password'),
                'client_id' => $defaultClient->id,
                'created_by' => $adminUser->id,
            ],
        );

        $superAdminUser->syncRoles([$superAdmin]);
        $adminUser->syncRoles([$admin]);
        $contadorUser->syncRoles([$contador]);

        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }
}
