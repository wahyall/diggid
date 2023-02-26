<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\Uuid;

class MyCourse extends Model {
    use Uuid;

    protected $fillable = ['course_id', 'user_id', 'transaction_id'];
    protected $hidden = ['id', 'course_id', 'user_id', 'transaction_id', 'created_at', 'updated_at'];
    protected $appends = ['progress', 'total_progress'];

    public function getProgressAttribute() {
        $progress = $this->progresses()->where('has_watched', '1')->count();
        return $progress;
    }

    public function getTotalProgressAttribute() {
        $total_progress = $this->course()->first()->videos()->count();
        return $total_progress;
    }

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
