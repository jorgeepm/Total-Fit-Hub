# Total Fit Hub

![Total Fit Hub](https://img.shields.io/badge/Versi%C3%B3n-1.0%20(MVP)-success)
![Laravel](https://img.shields.io/badge/Laravel-11.x-FF2D20?logo=laravel)
![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react)
![Inertia.js](https://img.shields.io/badge/Inertia.js-React-9553E9?logo=inertia)
![SQLite](https://img.shields.io/badge/Base%20de%20Datos-SQLite-003B57?logo=sqlite)

**Total Fit Hub** es un ecosistema web integral (Single Page Application) que unifica el seguimiento del entrenamiento de fuerza y la planificación nutricional, eliminando la necesidad de usar múltiples aplicaciones fragmentadas.

Este proyecto ha sido desarrollado por **Jorge de Pablos** y **Vicente Romero** como Proyecto de Fin de Grado (DAW).

---

## 🛠 Requisitos Previos

Antes de instalar el proyecto en tu ordenador, asegúrate de tener instalado el siguiente software:

* **PHP** (v8.2 o superior)
* **Composer** (Gestor de dependencias de PHP)
* **Node.js** y **NPM** (Para compilar los recursos del Frontend)

---

## 🚀 Guía de Instalación y Despliegue Local

Sigue estos pasos en tu terminal de comandos para arrancar la aplicación en tu entorno local. Todo el proceso está estandarizado mediante comandos nativos de Laravel y Node.

### 1. Descomprimir el archivo
Extrae el contenido del archivo `.zip` en la carpeta que prefieras de tu ordenador.
Abre tu terminal de comandos y navega hasta la carpeta raíz del proyecto extraído:
```bash
cd ruta/hasta/Total-Fit-Hub
```

### 2. Instalar dependencias del Backend (PHP)
Instala todos los paquetes necesarios de Laravel utilizando Composer:
```bash
composer install
```

### 3. Instalar dependencias del Frontend (React/NPM)
Instala los paquetes de Node y Tailwind CSS:
```bash
npm install
```

### 4. Configurar el archivo de Entorno (.env)
Duplica el archivo de configuración de ejemplo para crear tu propio archivo de variables de entorno:
```bash
# En Windows (CMD o PowerShell):
copy .env.example .env

# En Mac/Linux:
cp .env.example .env
```

### 5. Generar la Clave de Aplicación (App Key)
Genera la clave criptográfica única que Laravel utiliza para encriptar las sesiones de los usuarios:
```bash
php artisan key:generate
```

### 6. Configurar la Base de Datos (SQLite) y Migraciones
Al tratarse de un MVP optimizado, el proyecto utiliza SQLite. Laravel 11 lo configura por defecto en tu archivo `.env`.
Solo tienes que ejecutar las migraciones para construir las tablas. Laravel detectará que el archivo SQLite no existe y te preguntará si deseas crearlo. **Responde que sí (yes)**.

```bash
php artisan migrate
```
*(Nota: Si dispones de Seeders para cargar datos de prueba, puedes usar `php artisan migrate --seed`)*.

### 7. Compilar los archivos estáticos del Frontend
Para que React, Tailwind e Inertia funcionen, debes compilar el código JavaScript y CSS.

Para **entorno de desarrollo** (se queda escuchando los cambios en vivo):
```bash
npm run dev
```

*(Si quisieras compilarlo para producción definitiva, usarías `npm run build`)*.

### 8. Arrancar el Servidor de Laravel
Abre una **nueva pestaña/ventana en tu terminal** (dejando `npm run dev` ejecutándose en la anterior), asegúrate de estar en la carpeta del proyecto y arranca el servidor nativo de Laravel:
```bash
php artisan serve
```

---

## 🎉 ¡Listo!
La aplicación ya está funcionando en tu ordenador. 
Abre tu navegador web y visita: **http://localhost:8000**

Ya puedes registrar un nuevo usuario y comenzar a utilizar Total Fit Hub.

---

## 🏗 Arquitectura del Proyecto

* **Backend:** Arquitectura MVC utilizando Laravel 11. Base de datos SQLite gestionada a través del ORM Eloquent. Autenticación manejada con Laravel Sanctum.
* **Frontend:** Interfaces construidas con React.js y maquetadas con Tailwind CSS (diseño Mobile First y Glassmorphism).
* **Capa de Enlace:** Inertia.js actúa como puente, permitiendo enviar datos del controlador de Laravel directamente a las vistas de React sin necesidad de construir una API REST externa.
