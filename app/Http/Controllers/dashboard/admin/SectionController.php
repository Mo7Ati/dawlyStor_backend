<?php

namespace App\Http\Controllers\dashboard\admin;

use App\Enums\HomePageSectionsType;
use App\Enums\PermissionsEnum;
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
        // abort_unless($request->user('admin')->can(PermissionsEnum::SECTIONS_INDEX->value), 403);

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
        // abort_unless(request()->user('admin')->can(PermissionsEnum::SECTIONS_CREATE->value), 403);

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

        // abort_unless($request->user('admin')->can(PermissionsEnum::SECTIONS_CREATE->value), 403);

        Section::create($request->validated());

        return to_route('admin.sections.index')->with('success', __('messages.created_successfully'));
    }

    public function edit($id)
    {
        // abort_unless(request()->user('admin')->can(PermissionsEnum::SECTIONS_UPDATE->value), 403);

        $section = Section::findOrFail($id);

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
        // abort_unless($request->user('admin')->can(PermissionsEnum::SECTIONS_UPDATE->value), 403);

        $section = Section::findOrFail($id);
        $section->update($request->validated());

        return redirect()
            ->route('admin.sections.index')
            ->with('success', __('messages.updated_successfully'));
    }

    public function destroy($id)
    {
        // abort_unless(request()->user('admin')->can(PermissionsEnum::SECTIONS_DESTROY->value), 403);

        Section::forceDestroy($id);

        return redirect()
            ->route('admin.sections.index')
            ->with('success', __('messages.deleted_successfully'));
    }

    public function reorder(Request $request)
    {
        // abort_unless($request->user('admin')->can(PermissionsEnum::SECTIONS_UPDATE->value), 403);

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

        return to_route('admin.sections.index')
            ->with('success', __('messages.updated_successfully'));
    }

}
