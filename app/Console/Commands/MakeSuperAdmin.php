<?php

namespace App\Console\Commands;

use App\Enums\PermissionsEnum;
use App\Models\Admin;
use Illuminate\Console\Command;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class MakeSuperAdmin extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'make:super-admin';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Make a super admin';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $role = Role::firstOrCreate([
            'name' => 'Super Admin',
            'guard_name' => 'admin',
        ]);

        $role->givePermissionTo(Permission::all());

        $admin = Admin::firstOrFail();

        $admin->assignRole($role);
    }
}
