<?php

namespace App\Policies;

use App\Enums\PermissionsEnum;
use App\Models\Admin;
use Illuminate\Auth\Access\HandlesAuthorization;

class AdminPolicy
{
    use HandlesAuthorization;

    public function viewAny(Admin $admin): bool
    {
        return $admin->can(PermissionsEnum::ADMINS_INDEX->value);
    }

    public function view(Admin $admin, Admin $model): bool
    {
        return $admin->can(PermissionsEnum::ADMINS_SHOW->value);
    }

    public function create(Admin $admin): bool
    {
        return $admin->can(PermissionsEnum::ADMINS_CREATE->value);
    }

    public function update(Admin $admin, Admin $model): bool
    {
        return $admin->can(PermissionsEnum::ADMINS_UPDATE->value);
    }

    public function delete(Admin $admin, Admin $model): bool
    {
        return $admin->can(PermissionsEnum::ADMINS_DESTROY->value);
    }
}

