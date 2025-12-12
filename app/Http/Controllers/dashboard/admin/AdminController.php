<?php

namespace App\Http\Controllers\dashboard\admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\AdminResource;
use App\Models\Admin;
use Illuminate\Http\Request;
use Inertia\Inertia;

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
        return Inertia::render('admin.create');
    }
    public function store(Request $request)
    {
        return Inertia::render('admin.store');
    }
    public function edit($id)
    {
        return Inertia::render('admin.edit');
    }
    public function update(Request $request, $id)
    {
        return Inertia::render('admin.update');
    }
    public function destroy($id)
    {
        return Inertia::render('admin.destroy');
    }
}
