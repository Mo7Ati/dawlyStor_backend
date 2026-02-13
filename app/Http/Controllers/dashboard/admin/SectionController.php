<?php

namespace App\Http\Controllers\dashboard\admin;

use App\Enums\HomePageSectionsType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Dashboard\SectionRequest;
use App\Http\Resources\SectionResource;
use App\Models\Category;
use App\Models\Product;
use App\Models\Section;
use App\Models\Store;
use App\Models\StoreCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class SectionController extends Controller
{
    public function index(Request $request)
    {
        $this->authorizeForUser($request->user('admin'), 'viewAny', Section::class);

        $sections = Section::query()
            ->ordered()
            ->when($request->get('tableSearch'), function ($query) use ($request) {
                $query->where('type', 'like', '%' . $request->get('tableSearch') . '%');
            })
            ->when($request->get('type'), function ($query) use ($request) {
                $query->where('type', $request->get('type'));
            })
            ->when($request->get('is_active') !== null, function ($query) use ($request) {
                $query->where('is_active', $request->get('is_active'));
            })
            ->paginate($request->get('per_page', 10))
            ->withQueryString();

        return Inertia::render('admin/sections/index', [
            'sections' => SectionResource::collection($sections),
            'sectionTypes' => HomePageSectionsType::getOptions(),
        ]);
    }

    public function create()
    {
        $this->authorize('create', Section::class);

        return Inertia::render('admin/sections/create', [
            'section' => SectionResource::make(new Section())->serializeForForm(),
            'sectionTypes' => HomePageSectionsType::getOptions(),
            'products' => Product::active()->accepted()->get()->map(fn($p) => ['id' => $p->id, 'name' => $p->name]),
            'categories' => StoreCategory::get()->map(fn($c) => ['id' => $c->id, 'name' => $c->name]),
            'stores' => Store::where('is_active', true)->get()->map(fn($s) => ['id' => $s->id, 'name' => $s->name]),
        ]);
    }

    public function store(SectionRequest $request)
    {
        $this->authorizeForUser($request->user('admin'), 'create', Section::class);

        Section::create($request->validated());

        Inertia::flash('success', __('messages.created_successfully'));
        return to_route('admin.sections.index');
    }

    public function edit($id)
    {
        $section = Section::findOrFail($id);
        $this->authorize('update', $section);

        return Inertia::render('admin/sections/edit', [
            'section' => SectionResource::make($section)->serializeForForm(),
            'sectionTypes' => HomePageSectionsType::getOptions(),
            'products' => Product::active()->accepted()->get()->map(fn($p) => ['id' => $p->id, 'name' => $p->name]),
            'categories' => Category::active()->get()->map(fn($c) => ['id' => $c->id, 'name' => $c->name]),
            'stores' => Store::where('is_active', true)->get()->map(fn($s) => ['id' => $s->id, 'name' => $s->name]),
        ]);
    }

    public function update($id, SectionRequest $request)
    {
        $section = Section::findOrFail($id);
        $this->authorizeForUser($request->user('admin'), 'update', $section);
        $section->update($request->validated());

        Inertia::flash('success', __('messages.updated_successfully'));
        return to_route('admin.sections.index');
    }

    public function destroy($id)
    {
        $section = Section::findOrFail($id);
        $this->authorize('delete', $section);

        $section->forceDelete();

        Inertia::flash('success', __('messages.deleted_successfully'));
        return to_route('admin.sections.index');
    }

    public function reorder(Request $request)
    {
        $this->authorizeForUser($request->user('admin'), 'reorder', Section::class);

        $request->validate([
            'sections' => ['required', 'array'],
            'sections.*.id' => ['required', 'exists:sections,id'],
        ]);

        DB::transaction(function () use ($request) {
            foreach ($request->sections as $index => $item) {
                Section::where('id', $item['id'])
                    ->update(['order' => $index + 1]);
            }
        });

        Inertia::flash('success', __('messages.updated_successfully'));
        return to_route('admin.sections.index');
    }

}
