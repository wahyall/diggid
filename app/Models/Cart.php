<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\Uuid;

class Cart extends Model {
    use Uuid;

    protected $fillable = ['user_id', 'course_id'];
    protected $hidden = ['id'];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function course() {
        return $this->belongsTo(Course::class);
    }
}
