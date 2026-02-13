<?php

namespace App\Policies;

use App\Enums\PermissionsEnum;
use App\Models\Admin;
use App\Models\Section;
use Illuminate\Auth\Access\HandlesAuthorization;

class SectionPolicy
{
    use HandlesAuthorization;

    public function viewAny(Admin $admin): bool
    {
        return $admin->can(PermissionsEnum::SECTIONS_INDEX->value);
    }

    public function view(Admin $admin, Section $section): bool
    {
        return $admin->can(PermissionsEnum::SECTIONS_SHOW->value);
    }

    public function create(Admin $admin): bool
    {
        return $admin->can(PermissionsEnum::SECTIONS_CREATE->value);
    }

    public function update(Admin $admin, Section $section): bool
    {
        return $admin->can(PermissionsEnum::SECTIONS_UPDATE->value);
    }

    public function delete(Admin $admin, Section $section): bool
    {
        return $admin->can(PermissionsEnum::SECTIONS_DESTROY->value);
    }

    /**
     * Reorder is treated as a special kind of update.
     */
    public function reorder(Admin $admin): bool
    {
        return $admin->can(PermissionsEnum::SECTIONS_UPDATE->value);
    }
}

