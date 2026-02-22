<?php

namespace App\Http\Controllers\dashboard\admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Models\Store;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $this->authorizeForUser($request->user('admin'), 'viewAny', Order::class);

        $orders = Order::query()
            ->with(['customer', 'store'])
            ->applyFilters($request)
            ->paginate($request->input('per_page', 10))
            ->withQueryString();

        return Inertia::render('admin/orders/index', [
            'orders' => OrderResource::collection($orders),
        ]);
    }
}

