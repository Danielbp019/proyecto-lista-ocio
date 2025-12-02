# Proyecto lista de ocio

Proyecto lista anime que posteriormente se llamo lista de ocio cuenta con arquitectura de rest API, es un programa para almacenar una lista ordenada de animes con indicador de visto, comentarios, número de capítulos, nombre y capacidad para generar archivos descargables, así como alimentarse desde un archivo CSV. 

Este proyecto está pensado para el uso de un solo usuario; es como una lista personal.

![Portada](./img-portada/portada.jpg)

## Descripción del Proyecto

Este proyecto no solo permite almacenar una lista de obras, sino que ofrece una interfaz de usuario intuitiva y atractiva donde los usuarios pueden gestionar fácilmente su contenido. Con un diseño responsive, el sitio se adapta a cualquier dispositivo, garantizando una experiencia de usuario óptima tanto en móviles como en computadoras de escritorio.

## Tecnologías Utilizadas

- **Front-end:** Next.js 15 para la interfaz de usuario, garantizando renderizado eficiente y manejo de rutas dinámico.
- **Back-end:** Laravel 11 para la creación de la REST API, asegurando un rendimiento robusto.
- **Base de Datos:** MariaDB para el almacenamiento, configurable para otros motores gracias a Laravel 11.
- **Autenticación (tymon/jwt-auth):** Implementación de JWT (JSON Web Tokens) para rutas protegidas y autenticación segura.

## Funcionalidades Clave

- **Gestión de Animes:** Los usuarios pueden agregar, editar y eliminar obras de su lista personalizada.
- **Estado del Anime:** Posibilidad de marcar obras como vistos o no vistos, y agregar comentarios personales.
- **Interacción con CSV:** Importación y exportación de listas de obras en formato CSV para una fácil gestión y migración de datos.
- **Interface Amigable:** Uso de componentes visuales y diseño atractivo para mejorar la experiencia del usuario.
- **Búsqueda y Filtros:** Funcionalidad para buscar y filtrar obras basados en nombre.
- **Tipos:** Funcionalidad para organizar las obras en tipos, como por ejemplo animes, doramas o series.

## Vistazo al proyecto:

- **Login:** Tema por defecto dark
  ![login](./img-portada/login.jpg)

- **Registro:** Tema por defecto dark
  ![registro](./img-portada/registro.jpg)

- **Escritorio:**
  ![escritorio](./img-portada/escritorio.jpg)

- **Lista de obras:**
  ![lista-obras](./img-portada/lista-obras.jpg)

- **Operaciones con CSV:**
  ![operaciones-csv](./img-portada/operaciones-csv.jpg)

- **Tipos:**
  ![tipos-obra](./img-portada/tipo-obra.jpg)

- **Configuracion:**
  ![configuracion](./img-portada/configuracion.jpg)
