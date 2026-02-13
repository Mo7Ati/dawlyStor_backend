<?php

namespace App\Http\Controllers\dashboard\store;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $store = $request->user('store');

        $orders = Order::query()
            ->where('store_id', $store->id)
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

        return Inertia::render('store/orders/index', [
            'orders' => OrderResource::collection($orders),
        ]);
    }

    public function show(Request $request, $id)
    {
        // abort_unless($order->store_id === $store->id, 403);
        $store = $request->user('store');

        $order = Order::with(['customer', 'store', 'address', 'items.product'])->findOrFail($id);

        return Inertia::render('store/orders/show', [
            'order' => new OrderResource($order),
        ]);
    }

    public function updateStatus(Request $request, Order $order)
    {
        // abort_unless($order->store_id === $store->id, 403);

        $store = $request->user('store');

        $validated = $request->validate([
            'status' => ['required', 'string'],
        ]);

        $order->status = $validated['status'];
        $order->save();

        Inertia::flash('success', __('orders.status_updated'));
        return back();
    }
}

