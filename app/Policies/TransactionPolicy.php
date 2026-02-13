<?php

namespace App\Policies;

use App\Enums\PermissionsEnum;
use App\Models\Admin;
use App\Models\Transaction;
use Illuminate\Auth\Access\HandlesAuthorization;

class TransactionPolicy
{
    use HandlesAuthorization;

    public function viewAny(Admin $admin): bool
    {
        return $admin->can(PermissionsEnum::TRANSACTIONS_INDEX->value);
    }

    public function view(Admin $admin, Transaction $transaction): bool
    {
        return $admin->can(PermissionsEnum::TRANSACTIONS_INDEX->value);
    }
}

