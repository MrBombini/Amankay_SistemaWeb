# 🏨 Importar Base de Datos - Amankay Hotel

## Opción 1: Usar HeidiSQL (RECOMENDADO - Más fácil)

### Pasos:

1. **Abre HeidiSQL** (ya está instalado en Laragon)
   - Click en el ícono de HeidiSQL en la barra de tareas de Laragon
   - O ve a: `C:\laragon\tools\heidi\`

2. **Conecta a tu servidor MySQL**
   - Generalmente está en: `localhost:3306`
   - Usuario: `root`
   - Contraseña: (vacío por defecto en Laragon)

3. **Abre el archivo SQL**
   - Menú: **File → Open SQL file**
   - Selecciona: `C:\laragon\www\Amankay_SistemaWeb\database-setup.sql`

4. **Ejecuta el script**
   - Presiona: `F9` o click en el botón **Execute** (triángulo verde)
   - Espera a que se complete

5. **Verifica los datos**
   - En el panel izquierdo, expande: `hotel_amankay → habitaciones`
   - Deberías ver **15 habitaciones** listadas

---

## Opción 2: Usar MySQL CLI (Por terminal)

```bash
# Abre CMD o PowerShell y navega a Laragon
cd C:\laragon\bin\mysql\mysql8.0.26\bin

# Ejecuta el script SQL
mysql -u root < C:\laragon\www\Amankay_SistemaWeb\database-setup.sql
```

---

## Opción 3: Importar desde phpMyAdmin

1. Abre el navegador: `http://localhost/phpmyadmin`
2. Haz click en **Import** (arriba)
3. Selecciona el archivo: `database-setup.sql`
4. Click en **Go/Importar**

---

## ✅ Verificar que funcionó

Después de ejecutar el SQL, verifica en HeidiSQL:

```sql
-- Ejecuta esta query para verificar:
SELECT COUNT(*) as total_habitaciones FROM habitaciones;
-- Deberías ver: 15
```

Si ves `15`, ¡todo está bien! El frontend ahora mostrará todas las habitaciones.

---

## 🔧 Si algo no funciona

**Problema**: "Base de datos ya existe"
- El script hace DROP DATABASE, así que eliminará la existente y creará una nueva con los datos correctos
- Si no funciona, ejecuta manualmente:
  ```sql
  DROP DATABASE IF EXISTS hotel_amankay;
  ```

**Problema**: Los datos no aparecen en el frontend
1. Recarga la página (Ctrl+F5)
2. Abre la consola del navegador (F12)
3. Mira los logs: deberías ver "Habitaciones obtenidas: 15 registros"

---

## 📋 Resumen del SQL

Este archivo crea:
- ✅ Base de datos: `hotel_amankay`
- ✅ Tabla: `users` (usuarios/admin)
- ✅ Tabla: `habitaciones` (15 rooms)
- ✅ Tabla: `reservas` (bookings)
- ✅ Tabla: `pagos` (payments)
- ✅ Inserta 15 habitaciones de prueba

Estructura de habitaciones:
- 4x Individual ($100/noche)
- 4x Doble ($150/noche)
- 4x Matrimonial ($180/noche)
- 3x Suite ($300/noche)

---

**¡Una vez hayas ejecutado el SQL, recarga tu navegador y verás todas las 15 habitaciones en el frontend!** 🎉
