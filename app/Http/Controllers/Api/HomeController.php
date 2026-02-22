<?php


namespace App\Http\Controllers\Api;


use App\Http\Controllers\Controller;
use App\Http\Resources\SectionResource;
use App\Models\Section;

class HomeController extends Controller
{
    public function index()
    {
        $sections = Section::active()->ordered()->get();

        return successResponse(
            SectionResource::collection($sections),
            'Sections fetched successfully'
        );
    }
}
