<?php

namespace App\Http\Controllers\dashboard\admin;

use App\Enums\PermissionsEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\Dashboard\RoleRequest;
use App\Http\Resources\PermissionResource;
use App\Http\Resources\RoleResource;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    public function index(Request $request)
    {
        if (!Auth::guard('admin')->user()->can(PermissionsEnum::ROLES_INDEX->value)) {
            abort(403, 'You are not authorized to view this page');
        }

        $roles = Role::withCount('permissions')
            ->when($request->get('tableSearch'), function ($query) use ($request) {
                $query->where('name', 'LIKE', "%{$request->get('tableSearch')}%");
            })
            ->orderBy($request->get('sort', 'id'), $request->get('direction', 'desc'))
            ->paginate($request->get('per_page', 10))
            ->withQueryString();
        return Inertia::render('admin/roles/index', [
            'roles' => RoleResource::collection($roles),
        ]);
    }

    public function create()
    {
        if (!Auth::guard('admin')->user()->can(PermissionsEnum::ROLES_CREATE->value)) {
            abort(403, 'You are not authorized to view this page');
        }

        $groupedPermissions = Permission::all()
            ->groupBy(fn($p) => explode('.', $p->name)[0] ?? 'other')
            ->map(fn($group) => PermissionResource::collection($group))
            ->toArray();

        return Inertia::render('admin/roles/create', [
            'role' => new RoleResource(new Role()),
            'permissions' => $groupedPermissions,
        ]);
    }

    public function store(RoleRequest $request)
    {
        if (!Auth::guard('admin')->user()->can(PermissionsEnum::ROLES_CREATE->value)) {
            abort(403, 'You are not authorized to view this page');
        }

        $role = Role::create([
            'name' => $request->name,
            'guard_name' => 'admin',
        ]);

        $role->givePermissionTo($request->get('permissions', []));

        Inertia::flash('success', __('messages.created_successfully'));
        return to_route('admin.roles.index');
    }

    public function edit($id)
    {
        if (!Auth::guard('admin')->user()->can(PermissionsEnum::ROLES_UPDATE->value)) {
            abort(403, 'You are not authorized to view this page');
        }
        $role = Role::with('permissions')->withCount('permissions')->findOrFail($id);
        $groupedPermissions = Permission::all()
            ->groupBy(fn($p) => explode('.', $p->name)[0] ?? 'other')
            ->map(fn($group) => PermissionResource::collection($group))
            ->toArray();

        return Inertia::render('admin/roles/edit', [
            'role' => new RoleResource($role),
            'permissions' => $groupedPermissions,
        ]);
    }

    public function update($id, RoleRequest $request)
    {
        if (!Auth::guard('admin')->user()->can(PermissionsEnum::ROLES_UPDATE->value)) {
            abort(403, 'You are not authorized to view this page');
        }
        $role = Role::where('guard_name', 'admin')->findOrFail($id);
        $role->update([
            'name' => $request->name,
        ]);

        $role->syncPermissions($request->get('permissions', []));

        Inertia::flash('success', __('messages.updated_successfully'));
        return to_route('admin.roles.index');
    }

    public function destroy($id)
    {
        if (!Auth::guard('admin')->user()->can(PermissionsEnum::ROLES_DESTROY->value)) {
            abort(403, 'You are not authorized to view this page');
        }
        $role = Role::where('guard_name', 'admin')->findOrFail($id);
        $role->delete();

        Inertia::flash('success', __('messages.deleted_successfully'));
        return to_route('admin.roles.index');
    }
}
