<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class DeleteVideoThumbnail implements ShouldQueue {
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $uuid;
    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($uuid) {
        $this->uuid = $uuid;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle() {
        if (file_exists(storage_path('app/public/course/video/thumbnail/' . $this->uuid . '.jpg'))) {
            unlink(storage_path('app/public/course/video/thumbnail/' . $this->uuid . '.jpg'));
        }
    }
}
