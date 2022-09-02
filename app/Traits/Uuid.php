<?php

namespace App\Traits;

use Ramsey\Uuid\Exception\UnableToBuildUuidException;
use Ramsey\Uuid\Uuid as Generator;

trait Uuid {
  protected static function boot() {
    parent::boot();

    static::creating(function ($model) {
      try {
        $model->uuid = Generator::uuid4()->toString();
      } catch (UnableToBuildUuidException $e) {
        abort(500, $e->getMessage());
      }
    });
  }

  public static function findByUuid($uuid) {
    return static::where('uuid', '=', $uuid)->first();
  }
}
