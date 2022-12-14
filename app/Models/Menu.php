<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\Uuid;

class Menu extends Model {
    use Uuid;
    protected $fillable = ['nama', 'url', 'route', 'component', 'icon', 'parent_id', 'shown', 'heading', 'middleware'];
    protected $casts = ['shown' => 'boolean', 'heading' => 'boolean'];
    protected $with = ['children'];
    protected $hidden = ['id'];

    public function children() {
        return $this->hasMany(self::class, 'parent_id');
    }
}
