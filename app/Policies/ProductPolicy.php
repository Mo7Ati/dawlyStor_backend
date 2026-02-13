<?php

namespace App\Policies;

use App\Enums\PermissionsEnum;
use App\Models\Admin;
use App\Models\Product;
use Illuminate\Auth\Access\HandlesAuthorization;

class ProductPolicy
{
    use HandlesAuthorization;

    public function viewAny(Admin $admin): bool
    {
        return $admin->can(PermissionsEnum::PRODUCTS_INDEX->value);
    }

    public function view(Admin $admin, Product $product): bool
    {
        return $admin->can(PermissionsEnum::PRODUCTS_SHOW->value);
    }

    public function create(Admin $admin): bool
    {
        return $admin->can(PermissionsEnum::PRODUCTS_CREATE->value);
    }

    public function update(Admin $admin, Product $product): bool
    {
        return $admin->can(PermissionsEnum::PRODUCTS_UPDATE->value);
    }

    public function delete(Admin $admin, Product $product): bool
    {
        return $admin->can(PermissionsEnum::PRODUCTS_DESTROY->value);
    }
}

