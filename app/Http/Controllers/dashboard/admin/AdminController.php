<?php

namespace App\Http\Controllers\dashboard\admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Dashboard\AdminRequest;
use App\Http\Resources\AdminResource;
use App\Http\Resources\RoleResource;
use App\Models\Admin;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class AdminController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('viewAny', Admin::class);

        $admins = Admin::query()
            ->applyFilters($request)
            ->paginate($request->input('per_page', 10))
            ->withQueryString();

        return Inertia::render('admin/admins/index', [
            'admins' => AdminResource::collection($admins),
        ]);
    }
    public function create()
    {
        $this->authorize('create', Admin::class);

        return Inertia::render('admin/admins/create', [
            'admin' => new AdminResource(new Admin()),
            'roles' => RoleResource::collection(Role::all()),
        ]);
    }
    public function store(AdminRequest $request)
    {
        $this->authorizeForUser($request->user('admin'), 'create', Admin::class);

        $admin = Admin::create($request->validated());

        $admin->assignRole($request->get('roles', []));

        Inertia::flash('success', __('messages.created_successfully'));
        return to_route('admin.admins.index');
    }
    public function edit($id)
    {
        $admin = Admin::with('roles')->findOrFail($id);

        $this->authorize('update', $admin);

        return Inertia::render('admin/admins/edit', [
            'admin' => new AdminResource($admin),
            'roles' => RoleResource::collection(Role::all()),
        ]);
    }
    public function update($id, AdminRequest $request)
    {
        $admin = Admin::findOrFail($id);
        $this->authorizeForUser($request->user('admin'), 'update', $admin);
        $admin->update($request->validated());

        $admin->syncRoles($request->get('roles', []));

        Inertia::flash('success', __('messages.updated_successfully'));
        return to_route('admin.admins.index');

    }
    public function destroy($id)
    {
        $admin = Admin::findOrFail($id);
        $this->authorize('delete', $admin);

        $admin->delete();

        return Inertia::flash('success', __('messages.deleted_successfully'))->back();
    }
}
