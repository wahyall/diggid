<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\Uuid;

class Menu extends Model {
    use Uuid;
    protected $fillable = ['nama', 'path', 'icon', 'breadcrumb', 'parent_id', 'shown', 'middleware'];
    protected $with = ['children'];

    public function children() {
        return $this->hasMany(self::class, 'parent_id');
    }
}
