<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>Poultry Nexus</title>
        @viteReactRefresh
        @vite(['resources/js/src/main.jsx', 'resources/js/src/styles/app.css'])
    </head>
    <body class="bg-gray-100">
        <div id="app"></div>
    </body>
</html>
