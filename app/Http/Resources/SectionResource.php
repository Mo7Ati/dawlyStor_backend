<?php

namespace App\Http\Resources;

use App\Enums\HomePageSectionsType;
use App\Models\Product;
use App\Models\Store;
use App\Models\StoreCategory;
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

    private function getSectionData()
    {
        return match ($this->type) {
            HomePageSectionsType::HERO => $this->resolveHero(),
            HomePageSectionsType::FEATURES => $this->resolveFeatures(),
            HomePageSectionsType::PRODUCTS => $this->resolveProducts(),
            HomePageSectionsType::CATEGORIES => $this->resolveCategories(),
            HomePageSectionsType::STORES => $this->resolveStores(),
            HomePageSectionsType::VENDOR_CTA => $this->resolveVendorCta(),
            default => [],
        };
    }
    private function resolveHero(): array
    {
        return [
            'title' => getByLocale($this->data['title']),
            'description' => getByLocale($this->data['description']),
        ];
    }

    private function resolveFeatures()
    {
        $features = collect($this->data['features'] ?? [])->map(function ($item) {
            return [
                'title' => getByLocale($item['title']),
                'description' => getByLocale($item['description']),
            ];
        });

        return $features;
    }

    private function resolveVendorCta()
    {
        return [
            'title' => getByLocale($this->data['title']),
            'description' => getByLocale($this->data['description']),
        ];
    }


    /**
     * Resolve products based on section data source
     */
    private function resolveProducts()
    {
        $source = $this->data['source'] ?? 'latest';
        $limit = 8;

        $products_query = Product::query()
            ->with(['store:id,name,slug'])
            ->active()
            ->accepted();

        $products = match ($source) {
            'latest' => $products_query
                ->latest()
                ->limit($limit)
                ->get(),

            'best_seller' => collect([]), // Placeholder - to be implemented later

            'manual' => $products_query
                ->whereIn('id', $this->data['product_ids'] ?? [])
                ->limit($limit)
                ->get(),

            default => collect([]),
        };

        return [
            'title' => getByLocale($this->data['title']),
            'description' => getByLocale($this->data['description']),
            'products' => ProductResource::collection($products),
        ];
    }

    /**
     * Resolve categories based on section data source
     */
    private function resolveCategories(): array
    {
        $source = $this->data['source'] ?? null;
        $limit = 7;

        $categories = match ($source) {
            'featured_only' => collect([]), // Placeholder - to be implemented later

            'manual' => StoreCategory::query()
                ->whereIn('id', $this->data['category_ids'] ?? [])
                ->limit($limit)
                ->get(),

            default => collect([]),
        };

        return [
            'title' => getByLocale($this->data['title']),
            'description' => getByLocale($this->data['description']),
            'categories' => StoreCategoryResource::collection($categories),
        ];
    }

    /**
     * Resolve stores based on section data source
     */
    private function resolveStores()
    {
        $source = $this->data['source'] ?? null;
        $limit = 10;

        $stores = match ($source) {
            'trendy' => collect([]), // Placeholder - to be implemented later based on rating

            'manual' => Store::where('is_active', true)
                ->with(['category'])
                ->whereIn('id', $this->data['store_ids'] ?? [])
                ->limit($limit)
                ->get(),

            default => collect([]),
        };

        return [
            'title' => getByLocale($this->data['title']),
            'description' => getByLocale($this->data['description']),
            'stores' => StoreResource::collection($stores),
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
