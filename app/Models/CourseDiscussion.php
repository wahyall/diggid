<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\Uuid;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class CourseDiscussion extends Model {
    use Uuid, HasSlug;

    protected $fillable = ['title', 'body', 'course_id', 'user_id', 'upvote'];
    protected $hidden = ['id'];

    public function getSlugOptions(): SlugOptions {
        return SlugOptions::create()
            ->generateSlugsFrom('title')
            ->saveSlugsTo('slug');
    }

    public function course() {
        return $this->belongsTo(Course::class, 'course_id');
    }

    public function user() {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function comments() {
        return $this->hasMany(CourseDiscussionComment::class);
    }
}
