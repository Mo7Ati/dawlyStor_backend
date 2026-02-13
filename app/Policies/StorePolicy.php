<?php

namespace App\Policies;

use App\Enums\PermissionsEnum;
use App\Models\Admin;
use App\Models\Store;
use Illuminate\Auth\Access\HandlesAuthorization;

class StorePolicy
{
    use HandlesAuthorization;

    public function viewAny(Admin $admin): bool
    {
        return $admin->can(PermissionsEnum::STORES_INDEX->value);
    }

    public function view(Admin $admin, Store $store): bool
    {
        return $admin->can(PermissionsEnum::STORES_SHOW->value);
    }

    public function create(Admin $admin): bool
    {
        return $admin->can(PermissionsEnum::STORES_CREATE->value);
    }

    public function update(Admin $admin, Store $store): bool
    {
        return $admin->can(PermissionsEnum::STORES_UPDATE->value);
    }

    public function delete(Admin $admin, Store $store): bool
    {
        return $admin->can(PermissionsEnum::STORES_DESTROY->value);
    }
}

