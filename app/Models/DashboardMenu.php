<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\Uuid;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class DashboardMenu extends Model {
    use Uuid, HasSlug;
    protected $fillable = ['nama', 'slug', 'component', 'icon', 'breadcrumb', 'parent_id', 'shown', 'role_accesses'];
    protected $with = ['children'];

    public function getSlugOptions(): SlugOptions {
        return SlugOptions::create()
            ->generateSlugsFrom('name')
            ->saveSlugsTo('slug');
    }

    public function children() {
        return $this->hasMany(self::class, 'parent_id');
    }
}
