# Sistema de Aduanas - Plataforma de Preingreso y Control Fronterizo

## Descripción del Proyecto

Prototipo de alta fidelidad de un Sistema de Control Fronterizo para el Gobierno de Chile, desarrollado como proyecto universitario de Ingeniería de Software. El sistema permite la gestión completa del preingreso de pasajeros y el control en pasos fronterizos.

## Tecnologías Utilizadas

- **React 18** con TypeScript
- **React Router 7** (Data Mode) para navegación
- **Tailwind CSS v4** para estilos
- **Recharts** para visualización de datos
- **Lucide React** para iconografía
- **Sonner** para notificaciones toast

## Actores del Sistema

1. **Pasajero / Turista** - Puede crear y gestionar solicitudes de viaje
2. **Funcionario Aduanas** - Control y validación en pasos fronterizos
3. **Funcionario PDI** - Verificación de antecedentes y control migratorio
4. **Funcionario SAG** - Control de productos agrícolas y ganaderos
5. **Administrador del Sistema** - Gestión de usuarios y configuración

## Módulos Implementados

### MÓDULO 1 - Acceso y Seguridad
- ✅ **Login** con validación de credenciales (CP-01.01 a CP-01.04)
- ✅ **Dashboards diferenciados** por rol

### MÓDULO 2 - Preingreso Online
- ✅ **Crear Solicitud de Viaje** (SCREEN 3) con validaciones (CP-03.01 a CP-03.03)
- ✅ **Registrar Documentación** (SCREEN 4) con carga de archivos y validaciones (CP-04.01 a CP-04.04)
- ✅ **Confirmar y Enviar** (SCREEN 5) con resumen completo (CP-05.01 a CP-05.02)
- ✅ **Mis Solicitudes** (SCREEN 6) con estados: Borrador, Enviado, En Revisión, Observado, Aprobado, Rechazado

### MÓDULO 3 - Control Fronterizo
- ✅ **Buscar Trámite** (SCREEN 7) por QR, RUN, Pasaporte o Patente
- ✅ **Expediente Fronterizo** (SCREEN 8) con tabs completos
- ✅ **Validación Documental** (SCREEN 9) con estados (CP-08.01 a CP-08.03)
- ✅ **Evaluación Paso Fronterizo** (SCREEN 10) - Autorizar, Observar, Rechazar, Derivar (CP-10.01 a CP-10.04)

### MÓDULO 4 - Interoperabilidad
- ✅ **Consulta Sistemas Externos** (SCREEN 12) - PDI, SAG, Aduana Limítrofe (CP-12.01 a CP-12.03)
- ✅ **Historial de Sincronización** (SCREEN 13)

### MÓDULO 5 - Reportes y Soporte
- ✅ **Reportes e Indicadores** (SCREEN 14) con gráficos interactivos (CP-14.01 a CP-14.03)
- ✅ **Centro de Notificaciones** (SCREEN 15) con alertas y cambios de estado

### MÓDULO 6 - Administración
- ✅ **Gestión de Usuarios** (SCREEN 16) - Crear, Editar, Desactivar
- ✅ **Roles y Permisos** (SCREEN 17) - Matriz completa de permisos

## Usuarios de Prueba

| Usuario    | Contraseña | Rol                    |
|------------|------------|------------------------|
| pasajero1  | 123456     | Pasajero / Turista     |
| aduanas1   | 123456     | Funcionario Aduanas    |
| pdi1       | 123456     | Funcionario PDI        |
| sag1       | 123456     | Funcionario SAG        |
| admin1     | 123456     | Administrador          |

## Casos de Prueba Implementados

### Login (CP-01)
- CP-01.01: Login correcto ✅
- CP-01.02: Contraseña incorrecta ✅
- CP-01.03: Usuario inexistente ✅
- CP-01.04: Campos vacíos ✅

### Crear Solicitud (CP-03)
- CP-03.01: Datos válidos ✅
- CP-03.02: Fecha inválida ✅
- CP-03.03: Campos obligatorios vacíos ✅

### Documentación (CP-04)
- CP-04.01: Flujo exitoso ✅
- CP-04.02: Documento faltante ✅
- CP-04.03: Formato inválido ✅
- CP-04.04: Tamaño excedido ✅

### Confirmación (CP-05)
- CP-05.01: Solicitud completa ✅
- CP-05.02: Solicitud incompleta ✅

### Validación Documental (CP-08)
- CP-08.01: Coincidencia correcta ✅
- CP-08.02: Diferencia documental ✅
- CP-08.03: Documento faltante ✅

### Evaluación Fronteriza (CP-10)
- CP-10.01: Autorización ✅
- CP-10.02: Observación ✅
- CP-10.03: Rechazo ✅
- CP-10.04: Derivación secundaria ✅

### Consultas Externas (CP-12)
- CP-12.01: Consulta exitosa ✅
- CP-12.02: Sistema externo caído ✅
- CP-12.03: Sin resultados ✅

### Reportes (CP-14)
- CP-14.01: Generación exitosa ✅
- CP-14.02: Sin datos ✅
- CP-14.03: Filtro inválido ✅

## Datos Mock Incluidos

- 5 trámites de ejemplo con diferentes estados
- 10 pasos fronterizos chilenos reales
- 3 notificaciones del sistema
- Datos para gráficos y reportes
- Usuarios de prueba para cada rol

## Características Destacadas

✅ **Sistema de Autenticación** completo con roles y permisos
✅ **Validaciones exhaustivas** en todos los formularios
✅ **Estados de error y éxito** para todos los casos de uso
✅ **Interfaz responsive** adaptada a desktop y móvil
✅ **Diseño gubernamental chileno** con colores institucionales
✅ **Navegación completa** entre todos los módulos
✅ **Datos realistas** de pasos fronterizos chilenos
✅ **Interactividad completa** - todos los botones funcionan
✅ **Gráficos y reportes** con visualización de datos
✅ **Sistema de notificaciones** en tiempo real

## Pasos Fronterizos Incluidos

1. Chacalluta - Arica
2. Colchane - Iquique
3. Jama - Antofagasta
4. Paso Sico - Antofagasta
5. Los Libertadores - Los Andes
6. Pehuenche - Talca
7. Pichachén - Temuco
8. Cardenal Samoré - Osorno
9. Futaleufú - Palena
10. Río Don Guillermo - Cochrane

## Flujo de Uso Principal

### Para Pasajeros:
1. Login con usuario `pasajero1`
2. Dashboard con resumen de solicitudes
3. Crear nueva solicitud → Datos de viaje
4. Completar documentación y adjuntar archivos
5. Revisar y confirmar solicitud
6. Ver estado en "Mis Solicitudes"
7. Recibir notificaciones de cambios

### Para Funcionarios de Aduanas:
1. Login con usuario `aduanas1`
2. Dashboard con pendientes de revisión
3. Buscar trámite (QR, RUN, Pasaporte, Patente)
4. Revisar expediente completo (tabs)
5. Validar documentos
6. Evaluar y decidir: Autorizar / Observar / Rechazar / Derivar
7. Ver reportes y estadísticas

### Para Administradores:
1. Login con usuario `admin1`
2. Dashboard con métricas del sistema
3. Gestionar usuarios (crear, editar, desactivar)
4. Configurar roles y permisos
5. Ver reportes consolidados
6. Consultar interoperabilidad con sistemas externos

## Estructura del Proyecto

```
/src/app/
├── components/
│   ├── Layout.tsx           # Layout principal con navegación
│   └── ui/                  # Componentes UI reutilizables
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Input.tsx
│       └── Label.tsx
├── context/
│   └── AuthContext.tsx      # Contexto de autenticación
├── data/
│   └── mockData.ts          # Datos mock del sistema
├── lib/
│   └── utils.ts             # Utilidades
├── pages/                   # Todas las pantallas
│   ├── Login.tsx            # SCREEN 1
│   ├── Dashboard.tsx        # SCREEN 2
│   ├── NuevaSolicitud.tsx   # SCREEN 3
│   ├── Documentacion.tsx    # SCREEN 4
│   ├── Confirmacion.tsx     # SCREEN 5
│   ├── MisSolicitudes.tsx   # SCREEN 6
│   ├── DetalleSolicitud.tsx
│   ├── BuscarTramite.tsx    # SCREEN 7
│   ├── ControlFronterizo.tsx # SCREEN 8-11
│   ├── ConsultasExternas.tsx # SCREEN 12-13
│   ├── Reportes.tsx         # SCREEN 14
│   ├── Notificaciones.tsx   # SCREEN 15
│   ├── GestionUsuarios.tsx  # SCREEN 16
│   └── RolesPermisos.tsx    # SCREEN 17
├── routes.tsx               # Configuración de rutas
└── App.tsx                  # Componente principal
```

## Próximos Pasos para Implementación Real

1. Integrar con backend (Spring Boot + MySQL según especificaciones)
2. Implementar autenticación JWT real
3. Conectar con APIs externas de PDI, SAG y aduanas
4. Implementar carga real de archivos
5. Agregar generación de códigos QR
6. Implementar exportación de reportes a Excel/PDF
7. Agregar firma electrónica para autorizaciones
8. Implementar notificaciones push
9. Agregar logs de auditoría
10. Implementar recuperación de contraseña real

## Validaciones y Seguridad

- ✅ Validación de campos obligatorios
- ✅ Validación de formatos (RUN, fechas, archivos)
- ✅ Validación de tamaño de archivos (máx 5MB)
- ✅ Validación de tipos de archivo (PDF, JPG, PNG)
- ✅ Control de acceso por roles
- ✅ Mensajes de error descriptivos
- ✅ Estados de carga y feedback visual

## Compatibilidad

- ✅ Chrome, Firefox, Safari, Edge (últimas versiones)
- ✅ Responsive design (Desktop, Tablet, Mobile)
- ✅ Accesibilidad básica (labels, contraste, navegación por teclado)

---

**Desarrollado como prototipo de alta fidelidad para proyecto universitario de Ingeniería de Software**

**Fecha:** Junio 2026  
**Idioma:** Español (Chile)  
**Framework:** React + TypeScript + Tailwind CSS
