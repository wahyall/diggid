<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\Uuid;
use Illuminate\Database\Eloquent\Casts\AsCollection;

class Transaction extends Model {
    use Uuid;

    protected $fillable = ['identifier', 'amount', 'payment_method_id', 'status', 'user_id', 'body'];
    protected $hidden = ['id', 'user_id', 'payment_method_id', 'created_at', 'updated_at'];
    protected $appends = ['date'];
    protected $casts = ['body' => AsCollection::class];

    private $months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function courses() {
        return $this->hasMany(MyCourse::class);
    }

    public function payment_method() {
        return $this->belongsTo(PaymentMethod::class);
    }

    public function getDateAttribute() {
        $date = $this->created_at->format('d');
        $month = $this->months[$this->created_at->format('m') - 1];
        $year = $this->created_at->format('Y');
        return "$date $month $year";
    }
}
