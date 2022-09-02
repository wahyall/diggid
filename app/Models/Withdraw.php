<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\Uuid;

class Withdraw extends Model {
    use Uuid;

    protected $fillable = ['user_id', 'amount', 'status', 'bank_id', 'account_name', 'account_number', 'withdraw'];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function bank() {
        return $this->belongsTo(Bank::class);
    }
}
