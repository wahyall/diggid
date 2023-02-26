<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\Uuid;
use Illuminate\Database\Eloquent\Casts\AsCollection;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class PaymentMethod extends Model {
    use Uuid, HasSlug;

    protected $fillable = ['name', 'slug', 'logo', 'body', 'is_active'];
    protected $casts = ['body' => AsCollection::class, 'is_active' => 'boolean'];
    protected $hidden = ['id', 'created_at', 'updated_at', 'body'];

    public function getSlugOptions(): SlugOptions {
        return SlugOptions::create()
            ->generateSlugsFrom('name')
            ->saveSlugsTo('slug');
    }

    public function group() {
        return $this->belongsTo(PaymentMethodGroup::class);
    }

    public static function booted() {
        parent::boot();

        self::deleted(function ($model) {
            if (file_exists(storage_path('app/public/' . str_replace('storage/', '', $model->logo)))) {
                unlink(storage_path('app/public/' . str_replace('storage/', '', $model->logo)));
            }
        });
    }
}
