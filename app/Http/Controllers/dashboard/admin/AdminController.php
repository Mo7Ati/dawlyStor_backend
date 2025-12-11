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
        $perPage = $request->get('per_page', 10);
        $search = $request->get('search');
        $is_active = $request->get('is_active');
        $sort = $request->get('sort', 'id');
        $direction = $request->get('direction', 'desc');



        $query = Admin::query()
            // ->search($search)
            ->when(!empty($is_active), function ($query) use ($is_active) {
                $query->where('is_active', $is_active);
            });

        // Search functionality
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                    ->orWhere('email', 'LIKE', "%{$search}%");
            });
        }

        // Sorting
        $allowedSorts = ['id', 'name', 'email', 'is_active', 'created_at'];
        $sort = in_array($sort, $allowedSorts) ? $sort : 'id';
        $direction = in_array($direction, ['asc', 'desc']) ? $direction : 'desc';

        $query->orderBy($sort, $direction);

        $admins = $query->paginate($perPage)->withQueryString();

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
