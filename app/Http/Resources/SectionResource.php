<?php

namespace App\Http\Resources;

use App\Enums\HomePageSectionsType;
use App\Models\Category;
use App\Models\Product;
use App\Models\Store;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SectionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'type' => $this->type->value,
            'is_active' => $this->is_active,
            'order' => $this->order,
            'data' => $this->getSectionData(),
        ];
    }

    private function getSectionData(): array
    {
        return match ($this->type) {
            HomePageSectionsType::PRODUCTS => $this->resolveProducts(),
            HomePageSectionsType::CATEGORIES => $this->resolveCategories(),
            HomePageSectionsType::STORES => $this->resolveStores(),
            default => [],
        };
    }

    /**
     * Resolve products based on section data source
     */
    private function resolveProducts(): array
    {
        $source = $this->data['source'] ?? 'latest';
        $limit = $this->data['limit'] ?? 10;

        $products = match ($source) {
            'latest' => Product::active()
                ->accepted()
                ->latest()
                ->limit($limit)
                ->get(),

            'best_seller' => collect([]), // Placeholder - to be implemented later

            'manual' => Product::active()
                ->accepted()
                ->whereIn('id', $this->data['product_ids'] ?? [])
                ->limit($limit)
                ->get(),

            default => collect([]),
        };

        return [
            'products' => ProductResource::collection($products)
        ];
    }

    /**
     * Resolve categories based on section data source
     */
    private function resolveCategories(): array
    {
        $source = $this->data['source'] ?? null;
        $limit = $this->data['limit'] ?? 10;

        $categories = match ($source) {
            'featured_only' => collect([]), // Placeholder - to be implemented later

            'manual' => Category::active()
                ->whereIn('id', $this->data['category_ids'] ?? [])
                ->limit($limit)
                ->get(),

            default => collect([]),
        };

        return [
            'categories' => CategoryResource::collection($categories)
        ];
    }

    /**
     * Resolve stores based on section data source
     */
    private function resolveStores(): array
    {
        $source = $this->data['source'] ?? null;
        $limit = $this->data['limit'] ?? 10;

        $stores = match ($source) {
            'trendy' => collect([]), // Placeholder - to be implemented later based on rating

            'manual' => Store::where('is_active', true)
                ->whereIn('id', $this->data['store_ids'] ?? [])
                ->limit($limit)
                ->get(),

            default => collect([]),
        };

        return [
            'stores' => StoreResource::collection($stores)
        ];
    }

    /**
     * Serialize the resource for form usage
     */
    public function serializeForForm(): array
    {
        return [
            'id' => $this->id,
            'type' => $this->type?->value,
            'is_active' => $this->is_active,
            'order' => $this->order,
            'data' => $this->data,
        ];
    }
}
