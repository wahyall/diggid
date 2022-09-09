<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\Uuid;

class Bank extends Model {
    use Uuid;

    protected $fillable = ['name', 'logo', 'is_active'];
    protected $hidden = ['id'];
}
