<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\Uuid;
use Illuminate\Database\Eloquent\Casts\AsCollection;

class PaymentMethod extends Model {
    use Uuid;

    protected $fillable = ['name', 'slug', 'logo', 'body', 'is_active'];
    protected $casts = ['body' => AsCollection::class, 'is_active' => 'boolean'];
}
