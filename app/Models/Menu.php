<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\Uuid;

class Menu extends Model {
    use Uuid;
    protected $fillable = ['nama', 'url', 'route', 'component', 'icon', 'parent_id', 'shown', 'middleware'];
    protected $with = ['children'];

    public function children() {
        return $this->hasMany(self::class, 'parent_id');
    }
}
