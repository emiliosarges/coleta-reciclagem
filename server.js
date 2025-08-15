<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mapa de Pontos de Coleta</title>

    <!-- Leaflet CSS -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-sA+4z1QFIRihLt8QY9KnMwE7wRz6+8YNRt+Pj0b0A0M="
        crossorigin=""/>

    <!-- CSS local -->
    <link rel="stylesheet" href="/styles.css">

</head>
<body>
    <header>
        <h1>Mapa de Pontos de Coleta e Reciclagem</h1>
    </header>

    <main>
        <div id="map" style="height: 500px;"></div>

        <section>
            <h2>Filtrar por material:</h2>
            <select id="materialFilter">
                <option value="">Todos</option>
            </select>

            <ul id="pointsList"></ul>
        </section>
    </main>

    <!-- Leaflet JS -->
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
        integrity="sha256-o9N1jz8uJk7XGILGvRyrvQ4wMK9z0iNMG+3ZkRQ0Pnk="
        crossorigin=""></script>

    <!-- JS local -->
    <script src="/app.js"></script>
</body>
</html>
