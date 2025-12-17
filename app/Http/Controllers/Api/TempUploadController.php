<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TempMedia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class TempUploadController extends Controller
{
    /**
     * Store a temporary uploaded file using Spatie Media Library
     */
    public function store(Request $request)
    {
        // FilePond sends files with the name matching the 'name' prop or 'filepond' by default
        $file = $request->file('filepond') ?? $request->file($request->input('name', 'file'));

        if (!$file) {
            // Try to get any uploaded file
            $allFiles = $request->allFiles();
            $file = !empty($allFiles) ? reset($allFiles) : null;
        }

        if (!$file) {
            return response()->json(['error' => 'No file uploaded'], 400);
        }

        $request->validate([
            'filepond' => 'sometimes|file|max:10240', // 10MB max
        ]);

        // Create a temporary media record
        $tempMedia = TempMedia::create([
            'session_id' => $request->session()->getId(),
            'expires_at' => now()->addHours(24), // Expire after 24 hours
        ]);

        // Add media using Spatie Media Library
        // addMedia() can accept an UploadedFile instance directly
        $media = $tempMedia->addMedia($file)
            ->usingName(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME))
            ->usingFileName(Str::uuid()->toString() . '.' . $file->getClientOriginalExtension())
            ->toMediaCollection('temp');

        // FilePond expects the response to be the file ID (or a string that onload can process)
        return response()->json([
            'temp_id' => (string) $tempMedia->id,
            'media_id' => (string) $media->id,
            'id' => (string) $tempMedia->id,
            'url' => $media->getUrl(),
        ]);
    }

    /**
     * Delete a temporary uploaded file using Spatie Media Library
     */
    public function revert()
    {
        $tempId = request()->getContent();
        $tempMedia = TempMedia::findOrFail($tempId);

        if (!$tempMedia) {
            return response()->json(['success' => false, 'message' => 'File not found'], 404);
        }

        // Delete all media associated with this temp media record
        $tempMedia->clearMediaCollection('temp');

        // Delete the temp media record
        $tempMedia->delete();

        return response()->json(['success' => true]);
    }

    /**
     * Get a temporary file URL
     */
    public function load()
    {

    }
}

