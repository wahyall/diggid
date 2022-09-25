<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\Uuid;

class CourseDiscussionComment extends Model {
    use Uuid;

    protected $fillable = ['body', 'user_id', 'course_discussion_id', 'upvote', 'is_verified'];
    protected $casts = ['is_verified' => 'boolean'];
    protected $hidden = ['id'];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function discussion() {
        return $this->belongsTo(CourseDiscussion::class);
    }
}
