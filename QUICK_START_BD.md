# 🚀 INICIO RÁPIDO - Mostrar todas las habitaciones

## ✅ Lo que ya está hecho:

1. **Backend** ✅ 
   - Endpoint `/api/rooms` retorna todas las habitaciones
   - Usa raw SQL queries para acceso directo a BD
   - Console logs para debugging

2. **Frontend** ✅
   - Home page muestra todas las habitaciones en "Catálogo Completo"
   - Página `/rooms` permite filtrar y ver detalles
   - Componente RoomCard renderiza correctamente

3. **Sistema de tipos de datos** ✅
   - Frontend usa: `numero`, `tipo`, `precio`, `estado`, `descripcion`
   - Backend usa: campos correctos de tabla `habitaciones`
   - Validadores actualizados

---

## ⚡ PRÓXIMO PASO: Importar Base de Datos

**¡Solo falta un paso para que veas las 15 habitaciones en vivo!**

### Opción Más Fácil (HeidiSQL en Laragon):

1. Abre **Laragon Dashboard**
2. Click en **Database** → **HeidiSQL**
3. Espera que se abra HeidiSQL
4. Menú: **File → Open SQL file**
5. Selecciona: `C:\laragon\www\Amankay_SistemaWeb\database-setup.sql`
6. Presiona **F9** (o click en botón Execute)
7. ¡Espera a que termine!

### Verificar que funcionó:

En HeidiSQL, expande:
- `hotel_amankay` → `habitaciones`
- Deberías ver **15 habitaciones** listadas

---

## 🔍 Verificar en el Frontend

Después de importar el SQL:

1. **Recarga tu navegador** (Ctrl+F5)
2. Abre **DevTools** (F12)
3. Ve a la **Consola**
4. Deberías ver logs como:
   ```
   ✅ Total habitaciones en BD: 15
   📋 Habitaciones a mostrar: 15
   ```

5. En la página, verás:
   - **Sección "Nuestras Habitaciones"** con algunas destacadas
   - **Sección "Catálogo Completo de Habitaciones"** con TODAS las 15

---

## 🏠 URLs para Probar

- **Home (con catálogo)**: http://localhost:5173/
- **Página de Habitaciones**: http://localhost:5173/rooms
- **API Backend**: http://localhost:3000/api/rooms

---

## 📊 Estructura de Datos - Lo que verás:

```
15 Habitaciones totales:
├─ 4x Individual ($100/noche)
├─ 4x Doble ($150/noche) 
├─ 4x Matrimonial ($180/noche)
└─ 3x Suite ($300/noche)

Todas con:
✅ Número único (101, 102, 103, etc.)
✅ Tipo de habitación
✅ Precio por noche
✅ Estado (disponible, ocupada, mantenimiento)
✅ Descripción
✅ Imagen placeholder
```

---

## ❓ Si algo no funciona

**Problema**: Ves 0 habitaciones
- **Solución**: Ejecuta el SQL (database-setup.sql) en HeidiSQL

**Problema**: Error de conexión a BD
- **Solución**: Verifica que MySQL esté corriendo (en Laragon)
  - Abre Laragon → Start All

**Problema**: El frontend dice "Cargando..."
- **Solución**: 
  1. Recarga la página (Ctrl+F5)
  2. Abre DevTools (F12) → Console
  3. Verifica los logs de error

---

## ✨ Lo siguiente que puedes hacer:

1. **Hacer reservas**: Click en "Reservar" en cualquier habitación
2. **Panel Admin**: /admin/rooms (para agregar/editar habitaciones)
3. **Mi Perfil**: /my-bookings (para ver reservas)

---

**¿Listo?** ¡Ejecuta el SQL y recarga la página! 🎉
