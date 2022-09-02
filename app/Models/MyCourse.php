<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\Uuid;

class MyCourse extends Model {
    use Uuid;

    protected $fillable = ['course_id', 'user_id', 'transaction_id'];

    public function course() {
        return $this->belongsTo(Course::class);
    }

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function transaction() {
        return $this->belongsTo(Transaction::class);
    }

    public function progresses() {
        return $this->hasMany(MyCourseProgress::class);
    }
}
