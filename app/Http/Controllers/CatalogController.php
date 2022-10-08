<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CategoryGroup;
use MeiliSearch\Endpoints\Indexes;
use App\Models\Course;

class CatalogController extends Controller {
    public function category() {
        if (request()->wantsJson() && request()->ajax()) {
            return response()->json(CategoryGroup::with('categories')->whereHas('categories')->get());
        } else {
            abort(404);
        }
    }

    // NB: sorting still not working
    public function course(Request $request) {
        if (request()->wantsJson() && request()->ajax()) {
            $courses = Course::search($request->search ?? "", function (Indexes $meilisearch, string $query, array $options) use ($request) {
                if (isset($request->category) && gettype($request->category) === 'array') {
                    $options['filter'] = 'categories IN [' . implode(',', $request->category) . ']';
                };
                return $meilisearch->search($query, $options);
            })->orderBy('purchases_count', 'desc')->get();

            return response()->json($courses);
        } else {
            abort(404);
        }
    }
}
