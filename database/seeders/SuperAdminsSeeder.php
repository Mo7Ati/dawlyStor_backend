<?php

namespace Database\Seeders;

use App\Models\Admin;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class SuperAdminsSeeder extends Seeder
{
    public function run()
    {
        DB::transaction(function () {
            $role = Role::firstOrCreate([
                'name' => 'Super Admin',
                'guard_name' => 'admin',
            ])->givePermissionTo(Permission::all());

            Admin::firstOrCreate([
                'email' => 'admin@ps.com',
            ], [
                'name' => 'Admin',
                'password' => 'password',
                'is_active' => true,
            ])->assignRole($role);
        });
    }
}
