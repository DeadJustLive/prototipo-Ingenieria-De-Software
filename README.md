# 🛂 Sistema Integrado de Control Fronterizo (Prototipo)

![Banners de Aduanas](https://images.unsplash.com/photo-1578575423851-4e4e9766bb70?q=80&w=2070&auto=format&fit=crop)

Bienvenido al repositorio oficial del **Prototipo de Sistema Integrado de Control Fronterizo**, desarrollado para la asignatura de Ingeniería de Software. Este proyecto busca digitalizar, unificar y agilizar el proceso de paso fronterizo terrestre, integrando los sistemas de PDI, SAG, y Aduanas en una única plataforma de interoperabilidad.

## ✨ Características Principales

Este prototipo demuestra un flujo completo de control fronterizo con los siguientes módulos operativos:

- **📄 Preingreso Online (Pasajeros):** Interfaz para que los turistas llenen su solicitud de viaje desde su hogar, generando un código QR único para su presentación en frontera.
- **🔍 Control Fronterizo Unificado (Funcionarios):** Sistema que consolida la revisión migratoria, sanitaria y aduanera en una sola pantalla, eliminando los silos de información.
- **⚡ Interoperabilidad (PDI, SAG, Aduana Limítrofe):** Un módulo que simula consultas externas a otras bases de datos gubernamentales en tiempo real para verificar antecedentes y restricciones sanitarias.
- **🛡️ Módulo de Administración y Auditoría:** Panel de control de alto nivel que incluye una matriz de roles y permisos interactiva, registro inmutable de auditoría (logs), y configuración global para simular caídas de servidores (Stress Testing/Resiliencia).

## 🚀 Demostración en Vivo

Puedes acceder a la versión desplegada del prototipo en GitHub Pages (Actualizado constantemente):

👉 **[Ver Prototipo en Vivo](https://DeadJustLive.github.io/prototipo-Ingenieria-De-Software/)**

> **Tip de Evaluación:** Inicia sesión con el rol de **Administrador**, navega a **Configuración** y activa la "Caída del Sistema PDI". Luego ve a **Interoperabilidad** e intenta buscar el RUN de prueba (`12.345.678-9`). ¡Verás cómo el sistema maneja la contingencia de forma elegante!

## 🛠️ Stack Tecnológico

- **Frontend:** React 18, Vite, TypeScript
- **Estilos:** Tailwind CSS, shadcn/ui
- **Iconografía:** Lucide React
- **Gráficos y Datos:** Recharts
- **Despliegue:** GitHub Pages (`gh-pages`)

## 💻 Instalación Local

Si deseas correr este proyecto en tu máquina local para desarrollo:

1. Clona este repositorio:
   ```bash
   git clone https://github.com/DeadJustLive/prototipo-Ingenieria-De-Software.git
   ```
2. Instala las dependencias:
   ```bash
   cd "Sistema de Aduanas"
   npm install
   ```
3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
4. Abre `http://localhost:5173` en tu navegador.

## 👥 Roles del Sistema (Simulados)

Para probar la plataforma, el login simula los siguientes roles sin necesidad de contraseña:

- `pasajero`: Vista ciudadana para generar declaraciones.
- `aduanas`: Funcionario principal con acceso a evaluación.
- `pdi` / `sag`: Roles especializados con permisos segmentados.
- `admin`: Superusuario con acceso a auditoría, matriz de permisos y simulador de fallas de servidor.

---
*Desarrollado como proyecto académico de Ingeniería de Software.*
