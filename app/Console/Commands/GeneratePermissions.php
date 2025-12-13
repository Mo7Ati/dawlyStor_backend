<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Spatie\Permission\Models\Permission;

class GeneratePermissions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'permissions:generate';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $resources = ['admins', 'stores', 'products', 'storeCategories', 'orders', 'users', 'roles', 'permissions'];
        $actions = ['index', 'show', 'create', 'update', 'destroy'];

        foreach ($resources as $resource) {
            foreach ($actions as $action) {
                Permission::firstOrCreate([
                    'name' => "$resource.$action",
                    'guard_name' => 'admin',
                ]);
            }
        }

        $this->info('Permissions generated successfully.');
    }
}
