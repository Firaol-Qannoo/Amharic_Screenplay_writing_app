<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<meta name="csrf-token" content="{{ csrf_token() }}">

<head>
    @viteReactRefresh
    @vite(['resources/js/app.jsx'])
</head>

<body>
    @inertia
</body>

</html>