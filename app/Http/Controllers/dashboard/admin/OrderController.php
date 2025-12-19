<?php

namespace App\Http\Controllers\dashboard\admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $orders = Order::query()
            ->with(['customer', 'store'])
            ->search($request->get('tableSearch'))
            ->when($request->get('status'), function ($query) use ($request) {
                $query->where('status', $request->get('status'));
            })
            ->when($request->get('payment_status'), function ($query) use ($request) {
                $query->where('payment_status', $request->get('payment_status'));
            })
            ->orderBy($request->get('sort', 'id'), $request->get('direction', 'desc'))
            ->paginate($request->get('per_page', 10))
            ->withQueryString();

        return Inertia::render('admin/orders/index', [
            'orders' => OrderResource::collection($orders),
        ]);
    }
}

