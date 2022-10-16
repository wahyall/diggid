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

    public function course(Request $request) {
        if (request()->wantsJson() && request()->ajax()) {
            $courses = Course::search($request->search ?? "", function (Indexes $meilisearch, string $query, array $options) use ($request) {
                $filters = [];
                if (isset($request->category) && gettype($request->category) === 'array' && count($request->category) > 0) {
                    $filters[] = 'categories IN [' . implode(',', $request->category) . ']';
                };
                $options['filter'] = implode(' AND ', $filters);
                return $meilisearch->search($query, $options);
            })->query(function ($q) use ($request) {
                $q->with(['categories']);
                $q->withCount(['purchases']);
                $q->when(isset($request->level) && gettype($request->level) === 'array' && count($request->level) > 0, function ($q) use ($request) {
                    $q->whereIn('level', $request->level);
                });
            })->get();

            if (isset($request->sort) && $request->sort === 'popular') {
                $courses = $courses->sortByDesc('purchases_count')->values();
                return response()->json($courses);
            }

            return response()->json($courses);
        } else {
            abort(404);
        }
    }

    public function detail($slug) {
        if (request()->wantsJson() && request()->ajax()) {
            $course = Course::where('slug', $slug)->with(['categories', 'lessons', 'lessons.videos', 'project'])->withCount(['purchases AS members', 'videos'])->firstOrFail();
            return response()->json($course);
        } else {
            abort(404);
        }
    }
}
