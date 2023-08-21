# Documentación de la API

Esta documentación proporciona una descripción general de los puntos finales y las respuestas para la API de Juegos HTML.

## URL Base

[https://games-html-api.fly.dev/](https://games-html-api.fly.dev/)

 ## Puntos finales

### 1. ad-free

Obtener una lista de juegos sin anuncios.

- **URL:** `/api/ad-free`
- **Método:** GET
- **Parámetros:** `page` (entero, opcional) - Número de página para la paginación.

#### Ejemplo de solicitud

`GET https://games-html-api.fly.dev/api/ad-free?page=1`

 #### Respuesta

```json
{
    "pagination": [{
        "currentPage": "1",
        "totalPages": "20"
    }],
    "results": [
        // Lista de objetos de juegos con detalles
    ]
}
```

### 2\. details

Obtener detalles de un juego específico por su ID.

- **URL:** `/api/details`
- **Método:** GET
- **Parámetros:** `id` (cadena, requerida) - ID del juego.

#### Ejemplo de solicitud

`GET https://games-html-api.fly.dev/api/details?id=zombies-in-city-lights`

#### Respuesta

```json
{
    "pagination": [{
        "currentPage": "1",
        "totalPages": "20"
    }],
    "results": [
        // Lista de objetos de juegos con detalles
    ]
}
```

### 3\. most-played

Obtener una lista de los juegos más jugados.

- **URL:** `/api/most-played`
- **Método:** GET
- **Parámetros:** `page` (entero, opcional) - Número de página para la paginación.

#### Ejemplo de solicitud

`GET https://games-html-api.fly.dev/api/most-played?page=1` 

#### Respuesta

```json
{
    "pagination": [{
        "currentPage": "1",
        "totalPages": "20"
    }],
    "results": [
        // Lista de objetos de juegos con detalles
    ]
}
```

### 4\. newest

Obtener una lista de los juegos más nuevos.

- **URL:** `/api/newest`
- **Método:** GET
- **Parámetros:** `page` (entero, opcional) - Número de página para la paginación.

#### Ejemplo de solicitud

`GET https://games-html-api.fly.dev/api/newest?page=1` 

#### Respuesta

```json
{
    "pagination": [{
        "currentPage": "1",
        "totalPages": "20"
    }],
    "results": [
        // Lista de objetos de juegos con detalles
    ]
}
```

### 5\. recent-updated

Obtener una lista de los juegos actualizados recientemente.

- **URL:** `/api/recent-updated`
- **Método:** GET
- **Parámetros:** `page` (entero, opcional) - Número de página para la paginación.

#### Ejemplo de solicitud

`GET https://games-html-api.fly.dev/api/recent-updated?page=1` 

#### Respuesta

```json
{
    "pagination": [{
        "currentPage": "1",
        "totalPages": "20"
    }],
    "results": [
        // Lista de objetos de juegos con detalles
    ]
}
```