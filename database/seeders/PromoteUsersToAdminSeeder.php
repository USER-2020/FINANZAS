<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class PromoteUsersToAdminSeeder extends Seeder
{
    /**
     * Assign the admin role and full tenant menu access to every user except
     * super admins and accountants.
     */
    public function run(): void
    {
        $adminRole = Role::firstOrCreate([
            'name' => 'admin',
            'guard_name' => 'web',
        ]);

        $users = User::query()
            ->whereDoesntHave('roles', function ($query): void {
                $query->whereIn('name', ['super_admin', 'contador']);
            })
            ->get();

        $users->each(function (User $user) use ($adminRole): void {
            $user->update([
                'menu_access' => null,
            ]);
            $user->syncRoles([$adminRole]);
        });

        $this->command?->info("{$users->count()} usuarios configurados con el rol admin.");
    }
}
