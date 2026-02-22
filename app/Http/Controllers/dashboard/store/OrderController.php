<?php

namespace App\Http\Controllers\dashboard\store;

use App\Enums\OrderStatusEnum;
use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $orders = Order::query()
            ->with(['customer', 'store'])
            ->where('store_id', Auth::guard('store')->id())
            ->applyFilters($request)
            ->paginate($request->input('per_page', 10))
            ->withQueryString();

        return Inertia::render('store/orders/index', [
            'orders' => OrderResource::collection($orders),
        ]);
    }

    public function show(Request $request, $id)
    {
        $order = Order::with(['customer', 'store', 'address', 'items.product'])
            ->where('store_id', Auth::guard('store')->id())
            ->findOrFail($id);

        return Inertia::render('store/orders/show', [
            'order' => new OrderResource($order),
        ]);
    }

    public function updateStatus(Request $request, Order $order)
    {
        $validated = $request->validate([
            'status' => ['required', 'string', Rule::in(OrderStatusEnum::values())],
        ]);

        $order->status = $validated['status'];
        $order->save();

        Inertia::flash('success', __('orders.status_updated'));
        return back();
    }
}

