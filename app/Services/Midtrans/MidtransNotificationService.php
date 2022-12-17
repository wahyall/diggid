<?php

namespace App\Services\Midtrans;

use App\Services\Midtrans\MidtransService;
use Midtrans\Notification;
use App\Models\Transaction;

class MidtransNotificationService extends MidtransService {
    protected Notification $notification;
    protected Transaction $transaction;

    public function __construct() {
        parent::__construct();

        $this->_handleNotification();
    }

    public function isSignatureKeyVerified() {
        return ($this->_createLocalSignatureKey() == $this->notification->signature_key);
    }

    public function isSuccess() {
        $status_code = $this->notification->status_code;
        $transactionStatus = $this->notification->transaction_status;
        $fraudStatus = !empty($this->notification->fraud_status) ? ($this->notification->fraud_status == 'accept') : true;

        return ($status_code == 200 && $fraudStatus && ($transactionStatus == 'capture' || $transactionStatus == 'settlement'));
    }

    public function isExpire() {
        return ($this->notification->transaction_status == 'expire');
    }

    public function isCancelled() {
        return ($this->notification->transaction_status == 'cancel');
    }

    public function getNotification() {
        return $this->notification;
    }

    public function getTransaction() {
        return $this->transaction;
    }

    public function getBody() {
        return $this->notification->raw_response_body;
    }

    protected function _createLocalSignatureKey() {
        $order_id = $this->notification->order_id;
        $status_code = $this->notification->status_code;
        $gross_amount = $this->notification->gross_amount;
        $server_key = $this->serverKey;
        $input = $order_id . $status_code . $gross_amount . $server_key;
        $signature = openssl_digest($input, 'sha512');

        return $signature;
    }

    protected function _handleNotification() {
        $notification = new Notification();

        $order_id = $notification->order_id;
        $transaction = Transaction::where('uuid', $order_id)->first();

        $this->notification = $notification;
        $this->transaction = $transaction;
    }
}
