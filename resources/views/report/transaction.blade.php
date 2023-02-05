<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>

    <style>
        *,
        *::before,
        *::after {
            padding: 0;
            margin: 0;
            box-sizing: border-box;
            font-family: "Poppins", sans-serif;
        }
    </style>
<body style="padding: 1rem 1.5rem; color: #333">

<div style="text-align: center; margin-bottom: 4rem">
    <img src="{{ public_path('assets/media/logos/logo-diggid.svg') }}" width="150">
    <h4>DIGGID</h4>
</div>

<div style="margin-bottom: 2rem; font-size: 12px">Pembelian pada tanggal: {{ $transaction->date }}</div>

<table border="0" cellpadding="0" cellspacing="0" style="width: 100%; margin-bottom: 2rem">
    <tr>
        <td style="width: 50%; vertical-align: top">
            <h6>User</h6>
            <h1 style="margin: 0">{{ $transaction->user->name }}</h1>
            <h4 style="margin: 0; font-weight: 400">{{ $transaction->user->email }}</h4>
        </td>
        <td style="width: 50%; vertical-align: top">
            <div style="margin-bottom: 1.5rem">
                <h6>Pembayaran ({{ $transaction->status }})</h6>
                <h1>{{ currency($transaction->amount, true) }}</h1>
            </div>

            <div style="margin-bottom: 1.5rem">
                <h6>Metode Pembayaran</h6>
                <h1>{{ $transaction->payment_method->name }}</h1>
                <img src="{{ public_path($transaction->payment_method->logo) }}" alt="{{ $transaction->payment_method->name }}" width="150">
            </div>
        </td>
    </tr>
</table>

<div style="margin-bottom: 2rem;">Kelas yang dibeli:</div>

<table border="1" cellspacing="0" cellpadding="2" style="width: 100%">
    <thead>
        <tr style="background: #f9f9f9">
            <th style="color: #4a4a4a; padding: 0.5rem; width: 25px; text-align: center">#</th>
            <th style="color: #4a4a4a; padding: 0.5rem; text-align: left">Kelas</th>
            <th style="color: #4a4a4a; padding: 0.5rem; text-align: right; width: 150px">Harga</th>
        </tr>
    </thead>
    <tbody>
        @foreach ($transaction->courses as $index => $course)
            <tr>
                <td style="padding: 0.5rem; text-align: center">{{ $index + 1 }}</td>
                <td style="padding: 0.5rem">
                    <h4 style="font-weight: 400; margin: 0">{{ $course->course->name }}</h4>
                </td>
                <td style="padding: 0.5rem; text-align: right">{{ currency($course->course->price, true) }}</td>
            </tr>
        @endforeach
    </tbody>
    <tfoot>
        <tr>
            <td colspan="2" style="text-align: right; padding: 0.5rem">
                <h4>Total</h4>
            </td>
            <td style="text-align: right; padding: 0.5rem">
                <h3>{{ currency($transaction->amount, true) }}</h3>
            </td>
        </tr>
    </tfoot>
</table>

</body>
</html>
