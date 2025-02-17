# NeavyFy
📌 Descripción

Esta es una aplicación web desarrollada con Angular que permite a los usuarios gestionar y reproducir listas de reproducción de música. No requiere backend para la reproducción de audio y obtiene las canciones desde URLs accesibles.

🚀 Características

Inicio y cierre de sesión 📲

Formulario de inicio de sesión con validaciones.

Opción para cerrar sesión.

Gestión de Múltiples Listas de Reproducción 📋

Creación y eliminación de listas de reproducción.

Almacena las listas en el almacenamiento local del navegador.

Visualización de Listas de Reproducción 🔍

Mostrar las listas creadas junto con sus canciones.

Agregar y Eliminar Canciones 🎶

Los usuarios pueden añadir canciones con datos como título, artista y duración.

Se pueden eliminar canciones de una lista.

Reproducción de Canciones ▶️⏸️

Reproducir y pausar canciones.

Uso del componente Audio en Angular.

Manejo de errores en caso de archivos no accesibles.

Uso de API Externas (Opcional) 🔗

Posibilidad de obtener canciones desde APIs gratuitas como Free Music Archive.

Si no se encuentra el archivo de audio, se muestra una animación de reproducción.

🛠️ Tecnologías Utilizadas

Angular (Framework frontend)

TypeScript (Lenguaje de programación)

Bootstrap/Tailwind (Diseño y estilos)

LocalStorage (Almacenamiento de listas de reproducción)

APIs de música (Opcional)

📂 Estructura del Proyecto

project-root/
│── src/
│   ├── app/
│   │   ├── pages/
│   │   │   ├── login/
│   │   │   ├── playlists/
│   │   │   ├── playlist-detail/
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   ├── playlist.service.ts
│   │   │   ├── player.service.ts
│   │   ├── components/
│   │   │   ├── audio-player/
│   ├── assets/
│   ├── environments/
│── angular.json
│── package.json
│── README.md

🎧 Cómo Ejecutar el Proyecto

1️⃣ Clonar el Repositorio

git clone https://github.com/Neavy/NeacvyFy.git
cd music-player-angular

2️⃣ Instalar Dependencias

npm install

3️⃣ Ejecutar la Aplicación

npm start

Nota: Si el comando falla, intenta:

ng serve --open

🌍 Posibles Fuentes de Música (APIs Gratuitas)

Free Music Archive 🎵

Jamendo API 🎼

SoundCloud API 🎶

🔧 Solución de Problemas

1️⃣ Error: "Failed to load resource"

✔️ Verifica que la URL del audio sea accesible en el navegador.
✔️ Intenta cambiar el formato de la canción a MP3, OGG o WAV.
✔️ Si usas una API, revisa que devuelva un enlace válido.

2️⃣ Error: "Property 'value' does not exist on type 'Observable<User | null>'"

✔️ Si estás usando BehaviorSubject, usa .getValue() en lugar de .value.
✔️ Asegúrate de suscribirte al observable antes de acceder al valor.

🏆 Mejoras Futuras

🎨 Interfaz más atractiva con animaciones CSS.

🔊 Ecualizador y efectos de sonido.

📱 Versión móvil optimizada.

🌎 Soporte multilenguaje.

Desarrollado con ❤️ por Neavy. 🚀