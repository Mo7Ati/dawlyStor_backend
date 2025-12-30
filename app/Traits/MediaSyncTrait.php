<?php

namespace App\Traits;

use Illuminate\Http\Request;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

trait MediaSyncTrait
{
    public function syncMedia(Request $request, $model, $collection)
    {
        $temp_ids = $request->input('temp_ids', null);

        if ($temp_ids) {
            $media_ids = is_array($temp_ids) ? $temp_ids : explode(',', $temp_ids);

            Media::query()
                ->whereIn('id', $media_ids)
                ->get()
                ->each(function ($media) use ($model, $collection) {
                    $media->move($model, $collection);
                    $media->delete();
                });
        }
    }
}
