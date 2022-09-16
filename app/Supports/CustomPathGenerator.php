<?php

namespace App\Supports;

use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Spatie\MediaLibrary\Support\PathGenerator\PathGenerator;

class CustomPathGenerator implements PathGenerator {
  public function getPath(Media $media): string {
    return $media->uuid . '/';
  }

  public function getPathForConversions(Media $media): string {
    return $this->getPath($media) . 'conversions/';
  }

  public function getPathForResponsiveImages(Media $media): string {
    return $this->getPath($media) . 'responsive-images/';
  }
}
