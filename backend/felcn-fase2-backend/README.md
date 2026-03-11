## BASE APP

- Base App as a Service, con token externo: logger, swagger, validacion, paginacion y manejo de errores globales, user headers, formato estandar de respuestas

### instalar

```bash
npm install
```

### Ejecutar migración

```bash
npm run typeorm:migration:run
```

### Ejecutar seeders

```bash
npm run seed
```

### Comandos útiles

```bash
# Ver migraciones pendientes
npm run typeorm:migration:show

# Revertir última migración
npm run typeorm:migration:revert
```

### Crear resources

```bash
#ejemplo para products
nest g resource modules/products
```
