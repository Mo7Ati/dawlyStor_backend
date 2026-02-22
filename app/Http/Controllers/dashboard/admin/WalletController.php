<?php

namespace App\Http\Controllers\dashboard\admin;

use App\Enums\PermissionsEnum;
use App\Http\Controllers\Controller;
use App\Http\Resources\WalletResource;
use Bavix\Wallet\Models\Wallet;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WalletController extends Controller
{
    public function index(Request $request)
    {
        $this->authorizeForUser($request->user('admin'), PermissionsEnum::WALLETS_INDEX->value);

        $wallets = Wallet::query()
            ->with(['holder'])
            ->paginate($request->get('per_page', 10))
            ->withQueryString();

        return Inertia::render('admin/wallets/index', [
            'wallets' => WalletResource::collection($wallets),
        ]);
    }
}
