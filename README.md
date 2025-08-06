# 🧠 Piensa - Pomodoro Web App con Backend y ESP32

## Descripción

**Piensa** es una aplicación Pomodoro que combina:

- **Frontend**: React + TailwindCSS para interfaz moderna y responsive.
- **Backend**: Express para servir la app y exponer API REST para configuración.
- **Integración ESP32**: Para conectar hardware que controle o modifique el temporizador vía API.

---

## Tabla de Contenidos

- [Instalación](#instalación)
- [Uso](#uso)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Tecnologías](#tecnologías)
- [Componentes](#componentes)
- [API para ESP32](#api-para-esp32)
- [Scripts](#scripts)
- [Recomendaciones](#recomendaciones)
- [Estado del Proyecto](#estado-del-proyecto)
- [Licencia](#licencia)

---

## Instalación

```bash
git clone <tu-repositorio>
cd <tu-repositorio>
npm install
```

## Uso 
### 1. Construye la app React:
```
npm run build
```

### 2. Ejecuta servidor backend + frontend juntos:
```
npm run dev
```
- React estará disponible en http://localhost:3000
- Backend API en http://localhost:3001

## Tecnologias 
| Tipo        | Herramientas y Librerías                      |
| ----------- | --------------------------------------------- |
| Frontend    | React 18, TailwindCSS, postcss, autoprefixer  |
| Backend     | Node.js, Express, CORS, body-parser           |
| Otras       | concurrently (para correr frontend + backend) |
| Integración | API REST para ESP32, localStorage             |

# Componentes

## PomodoroTimer.js
- Temporizador visual con SVG animado.
- Control de inicio/detención, reinicio y configuración.
- Muestra el modo actual (trabajo/descanso) y progreso.
- Alarma con opción para silenciar.
- Cuenta Pomodoros completados (almacenado en `localStorage`).

## ConfigModal.js
- Modal para cambiar el tiempo de trabajo (mínimo 25 minutos).
- Calcula automáticamente el tiempo de descanso (20% del tiempo de trabajo).
- Guarda cambios en backend vía API `POST /api/setWorkTime`.
- Control de estados de guardado y cancelación.

## StatsScreen.js
- Muestra estadísticas:
  - Pomodoros completados.
  - Minutos enfocados.
  - Historial reciente (últimas 5 sesiones).
- Botón opcional para limpiar estadísticas.

# API para ESP32

### `POST /api/setWorkTime`
- Establece el tiempo de trabajo (mínimo 25 min).
- Calcula descanso automáticamente.

**Body JSON:**

```json
{
  "workTime": 25
}
```

- Respuesta 

```json
{
  "success": true,
  "message": "Work time updated to 30 minutes, break time to 6 minutes",
  "workTime": 30,
  "breakTime": 6
}
```

## API Endpoints

### `GET /api/getWorkTime`
Obtiene los tiempos actuales configurados.

**Respuesta:**

```json
{
  "workTime": 25,
  "breakTime": 5
}
```

## GET /api/health
Chequeo rápido del servidor:

**Respuesta**

``` json
{
  "status": "OK",
  "message": "ESP32 Pomodoro Server is running",
  "currentWorkTime": 25,
  "currentBreakTime": 5
}
```
## Scripts npm

| Script           | Acción                                     |
| ---------------- | ----------------------------------------- |
| `npm start`      | Levanta solo frontend React               |
| `npm run server` | Levanta solo backend Express              |
| `npm run dev`    | Levanta frontend y backend simultáneamente|
| `npm run build`  | Compila React para producción (`build/`) |

---

## Recomendaciones

- El ESP32 debe poder acceder al servidor (ajustar IP si es necesario).
- Asegúrate de que el tiempo enviado desde ESP32 sea >= 25 minutos.
- En producción, considera persistir datos con base de datos.
- Puedes extender funcionalidad para autenticar usuarios o agregar notificaciones.

---

## Estado actual

- Temporizador Pomodoro funcional, con configuración y alarma.
- Backend Express con API REST para conexión externa.
- Estadísticas básicas y guardado local.
- Integración básica para ESP32 vía endpoints API.
