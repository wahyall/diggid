<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\Uuid;

class Transaction extends Model {
    use Uuid;

    protected $fillable = ['identifier', 'amount', 'status', 'user_id'];
    protected $hidden = ['id'];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function courses() {
        return $this->hasMany(MyCourse::class);
    }
}
