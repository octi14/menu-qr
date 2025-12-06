# Solución de problemas de conexión a MongoDB Atlas

## Problemas comunes y soluciones

### 1. Whitelist de IPs (más común)

MongoDB Atlas requiere que agregues tu IP a la lista blanca:

1. Entrá a tu cluster en MongoDB Atlas
2. Andá a **Network Access** (o **IP Access List**)
3. Click en **Add IP Address**
4. Opciones:
   - **Add Current IP Address** (para agregar tu IP actual)
   - **Allow Access from Anywhere** (0.0.0.0/0) - Solo para desarrollo, no recomendado para producción

### 2. Codificación de caracteres especiales en la contraseña

Si tu contraseña tiene caracteres especiales (`@`, `#`, `%`, `&`, etc.), necesitás codificarlos en la URL:

- `@` → `%40`
- `#` → `%23`
- `%` → `%25`
- `&` → `%26`
- `+` → `%2B`
- `/` → `%2F`
- `=` → `%3D`
- `?` → `%3F`

**Ejemplo:**
Si tu contraseña es `mi@pass#123`, la URL debería ser:
```
mongodb+srv://octi14:mi%40pass%23123@qr-menu.pbqkukc.mongodb.net/
```

### 3. Obtener la cadena de conexión correcta desde MongoDB Atlas

1. Entrá a tu cluster en MongoDB Atlas
2. Click en **Connect**
3. Seleccioná **Connect your application**
4. Copiá la cadena de conexión que te da
5. Reemplazá `<password>` con tu contraseña (codificada si tiene caracteres especiales)
6. Agregá el nombre de la base de datos al final si es necesario

### 4. Verificar usuario y contraseña

1. En MongoDB Atlas, andá a **Database Access**
2. Verificá que el usuario `octi14` exista
3. Si no existe, creá uno nuevo
4. Asegurate de que tenga permisos de lectura/escritura

### 5. Cadena de conexión para MongoDB Compass

Para MongoDB Compass, usá esta cadena (reemplazá `<password>` con tu contraseña codificada):

```
mongodb+srv://octi14:<password>@qr-menu.pbqkukc.mongodb.net/qr-menu?retryWrites=true&w=majority
```

### 6. Probar la conexión

Podés probar la conexión desde la terminal con:

```bash
mongosh "mongodb+srv://octi14:<password>@qr-menu.pbqkukc.mongodb.net/qr-menu"
```

O desde Node.js:

```javascript
const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://octi14:<password>@qr-menu.pbqkukc.mongodb.net/qr-menu";
const client = new MongoClient(uri);

async function test() {
  try {
    await client.connect();
    console.log("✅ Conectado a MongoDB!");
    const db = client.db("qr-menu");
    const collections = await db.listCollections().toArray();
    console.log("Colecciones:", collections);
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await client.close();
  }
}

test();
```

## Checklist rápido

- [ ] IP agregada a la whitelist en Network Access
- [ ] Usuario `octi14` existe en Database Access
- [ ] Contraseña correcta (codificada si tiene caracteres especiales)
- [ ] Cluster está activo (no pausado)
- [ ] Nombre de la base de datos es correcto

