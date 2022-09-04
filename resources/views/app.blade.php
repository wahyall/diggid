<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700;800&display=swap" rel="stylesheet">

        <!-- Styles -->
        <link href="{{ asset("assets/plugins/global/plugins.bundle.css") }}" rel="stylesheet" type="text/css" />
		<link href="{{ asset("assets/css/style.bundle.css") }}" rel="stylesheet" type="text/css" />

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite('resources/js/app.jsx')
        @inertiaHead
    </head>
    <body id="kt-body">
        @inertia

        <script src="{{ asset("assets/plugins/global/plugins.bundle.js") }}"></script>
		<script src="{{ asset("assets/js/scripts.bundle.js") }}"></script>

        <script id="loader"></script>
    </body>
</html>
