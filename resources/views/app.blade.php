<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    @viteReactRefresh
    @vite(['resources/js/app.jsx'])
</head>
<body>
    @inertia
</body>
</html>