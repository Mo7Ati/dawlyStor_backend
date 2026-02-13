<?php

namespace App\Policies;

use App\Enums\PermissionsEnum;
use App\Models\Admin;
use App\Models\Order;
use Illuminate\Auth\Access\HandlesAuthorization;

class OrderPolicy
{
    use HandlesAuthorization;

    public function viewAny(Admin $admin): bool
    {
        return $admin->can(PermissionsEnum::ORDERS_INDEX->value);
    }

    public function view(Admin $admin, Order $order): bool
    {
        return $admin->can(PermissionsEnum::ORDERS_SHOW->value);
    }

    public function create(Admin $admin): bool
    {
        return $admin->can(PermissionsEnum::ORDERS_CREATE->value);
    }

    public function update(Admin $admin, Order $order): bool
    {
        return $admin->can(PermissionsEnum::ORDERS_UPDATE->value);
    }

    public function delete(Admin $admin, Order $order): bool
    {
        return $admin->can(PermissionsEnum::ORDERS_DESTROY->value);
    }
}

