<?php

namespace App\Policies;

use App\Enums\PermissionsEnum;
use App\Models\Admin;
use App\Models\StoreCategory;
use Illuminate\Auth\Access\HandlesAuthorization;

class StoreCategoryPolicy
{
    use HandlesAuthorization;

    public function viewAny(Admin $admin): bool
    {
        return $admin->can(PermissionsEnum::STORE_CATEGORIES_INDEX->value);
    }

    public function view(Admin $admin, StoreCategory $category): bool
    {
        return $admin->can(PermissionsEnum::STORE_CATEGORIES_SHOW->value);
    }

    public function create(Admin $admin): bool
    {
        return $admin->can(PermissionsEnum::STORE_CATEGORIES_CREATE->value);
    }

    public function update(Admin $admin, StoreCategory $category): bool
    {
        return $admin->can(PermissionsEnum::STORE_CATEGORIES_UPDATE->value);
    }

    public function delete(Admin $admin, StoreCategory $category): bool
    {
        return $admin->can(PermissionsEnum::STORE_CATEGORIES_DESTROY->value);
    }
}

