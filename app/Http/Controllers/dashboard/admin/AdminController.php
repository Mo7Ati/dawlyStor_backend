<?php

namespace App\Http\Controllers\dashboard\admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Dashboard\AdminRequest;
use App\Http\Resources\AdminResource;
use App\Http\Resources\RoleResource;
use App\Models\Admin;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class AdminController extends Controller
{
    public function index(Request $request)
    {
        $admins = Admin::query()
            ->search($request->get('tableSearch'))
            ->when($request->get('is_active') !== null, function ($query) use ($request) {
                $query->where('is_active', $request->get('is_active'));
            })
            ->orderBy($request->get('sort', 'id'), $request->get('direction', 'desc'))
            ->paginate($request->get('per_page', 10))
            ->withQueryString();

        return Inertia::render('admin/admins/index', [
            'admins' => AdminResource::collection($admins),
        ]);
    }
    public function create()
    {
        return Inertia::render('admin/admins/create', [
            'admin' => new AdminResource(new Admin()),
            'roles' => RoleResource::collection(Role::all()),
        ]);
    }
    public function store(AdminRequest $request)
    {
        $admin = Admin::create($request->validated());
        $admin->assignRole($request->get('roles', []));

        return to_route('admin.admins.index')
            ->with('success', __('messages.created_successfully'));
    }
    public function edit($id)
    {
        $admin = Admin::with('roles')->findOrFail($id);
        return Inertia::render('admin/admins/edit', [
            'admin' => new AdminResource($admin),
            'roles' => RoleResource::collection(Role::all()),
        ]);
    }
    public function update($id, AdminRequest $request)
    {
        $admin = Admin::findOrFail($id);
        $admin->update($request->validated());

        $admin->syncRoles($request->get('roles', []));

        return redirect()
            ->route('admin.admins.index')
            ->with('success', __('messages.updated_successfully'));
    }
    public function destroy($id)
    {
        Admin::destroy($id);
        return redirect()
            ->route('admin.admins.index')
            ->with('success', __('messages.deleted_successfully'));
    }
}
