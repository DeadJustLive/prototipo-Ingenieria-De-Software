PROJECT NAME:

Sistema de Aduanas – Plataforma de Preingreso y Control Fronterizo

OBJECTIVE:

Generate a complete HIGH-FIDELITY interactive prototype suitable for a Software Engineering university project.

This is NOT only a UI mockup.

The prototype must allow validation of the defined Use Cases and Test Cases.

The design must simulate a real government border control platform.

LANGUAGE:

Spanish (Chile)

DESIGN STYLE:

* Modern government platform
* Professional
* Accessible
* Responsive
* Desktop-first
* Clean layout
* Chilean public service style
* White, dark blue, light gray, teal accents

ACTORS:

1. Pasajero / Turista
2. Funcionario Aduanas
3. Funcionario PDI
4. Funcionario SAG
5. Administrador del Sistema

====================================================
MODULE 1 – ACCESO Y SEGURIDAD
=============================

SCREEN 1 – Login

Fields:

* Usuario
* Contraseña

Buttons:

* Iniciar Sesión
* Recuperar Contraseña

Must support:

TEST CASES:

CP-01.01 Login correcto
CP-01.02 Contraseña incorrecta
CP-01.03 Usuario inexistente
CP-01.04 Campos vacíos

Create validation messages for each scenario.

SCREEN 2 – Dashboard por Rol

Different dashboard according to:

* Pasajero
* Aduanas
* PDI
* SAG
* Administrador

====================================================
MODULE 2 – PREINGRESO ONLINE
============================

SCREEN 3 – Crear Solicitud de Viaje

Fields:

* Fecha de viaje
* Paso fronterizo
* País origen
* País destino
* Tipo de viaje

Support:

CP-03.01 Datos válidos
CP-03.02 Fecha inválida
CP-03.03 Campos obligatorios vacíos

Create all validation states.

---

SCREEN 4 – Registrar Documentación y Declaraciones

Sections:

A. Datos Personales

* RUN/Pasaporte
* Nombre
* Nacionalidad

B. Vehículo

* Patente
* Marca
* Modelo

C. Menores

* Nombre menor
* Documento
* Autorización

D. Declaración SAG

Checkboxes:

* Alimentos
* Productos animales
* Productos vegetales

E. Adjuntar Documentos

* Pasaporte
* Seguro
* Permiso
* Autorización notarial

Support:

CP-04.01 Flujo exitoso
CP-04.02 Documento faltante
CP-04.03 Formato inválido
CP-04.04 Tamaño excedido

Generate all validation messages.

---

SCREEN 5 – Confirmar y Enviar Solicitud

Display:

* Resumen completo
* Estado documentación

Button:

* Enviar Solicitud

Support:

CP-05.01 Solicitud completa
CP-05.02 Solicitud incompleta

Generate success and error states.

---

SCREEN 6 – Estado del Trámite

Statuses:

* Borrador
* Enviado
* En Revisión
* Observado
* Aprobado
* Rechazado

====================================================
MODULE 3 – CONTROL FRONTERIZO
=============================

SCREEN 7 – Buscar Trámite

Methods:

* Escanear QR
* Buscar por RUN
* Buscar por Pasaporte
* Buscar por Patente

---

SCREEN 8 – Expediente Fronterizo

Tabs:

* Datos Personales
* Vehículo
* Declaraciones
* Documentos
* Observaciones
* Historial

---

SCREEN 9 – Validación Documental

Actions:

* Validar
* Observar
* Rechazar

Support:

CP-08.01 Coincidencia correcta
CP-08.02 Diferencia documental
CP-08.03 Documento faltante

Generate all possible outcomes.

---

SCREEN 10 – Evaluación Paso Fronterizo

Actions:

* Autorizar
* Observar
* Rechazar
* Derivar a Revisión Secundaria

Support:

CP-10.01 Autorización
CP-10.02 Observación
CP-10.03 Rechazo
CP-10.04 Derivación secundaria

Generate complete workflow.

---

SCREEN 11 – Registrar Ingreso o Salida

Display:

* Fecha
* Hora
* Paso fronterizo
* Funcionario responsable

====================================================
MODULE 4 – INTEROPERABILIDAD
============================

SCREEN 12 – Consulta Sistemas Externos

Panels:

* PDI
* SAG
* Aduana Limítrofe

Support:

CP-12.01 Consulta exitosa
CP-12.02 Sistema externo caído
CP-12.03 Sin resultados

Generate all states.

---

SCREEN 13 – Historial de Sincronización

Columns:

* Fecha
* Sistema
* Resultado
* Estado

====================================================
MODULE 5 – REPORTES Y SOPORTE
=============================

SCREEN 14 – Reportes e Indicadores

Filters:

* Fecha inicio
* Fecha término
* Paso fronterizo

Charts:

* Ingresos
* Salidas
* Observaciones
* Rechazos

Support:

CP-14.01 Generación exitosa
CP-14.02 Sin datos
CP-14.03 Filtro inválido

Generate all states.

---

SCREEN 15 – Centro de Notificaciones

Display:

* Observaciones
* Alertas
* Cambios de estado

====================================================
MODULE 6 – ADMINISTRACIÓN
=========================

SCREEN 16 – Gestión de Usuarios

Actions:

* Crear
* Editar
* Desactivar

---

SCREEN 17 – Roles y Permisos

Roles:

* Pasajero
* Aduanas
* PDI
* SAG
* Administrador

====================================================
PROTOTYPE REQUIREMENTS
======================

Create:

* Fully navigable prototype
* Interactive buttons
* Validation messages
* Error states
* Success states
* Empty states
* Search states
* Loading states

Every screen must be connected.

Every Use Case from CU-01 to CU-16 must be represented.

Every Test Case from CP-01.01 to CP-14.03 must be testable inside the prototype.

Generate realistic Chilean border control data.

Generate reusable design system and reusable components.

Output a prototype ready for future implementation in React + Spring Boot + MySQL.
