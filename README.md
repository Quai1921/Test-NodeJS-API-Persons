# Test Nexo - Persons API

## Descripción
Esta aplicación proporciona una API para gestionar personas y sus direcciones utilizando Node.js, Express y MongoDB. La API incluye operaciones CRUD y la capacidad de exportar datos a CSV. También están documentados los endpoints con Swagger.

## Requisitos
- Node.js (>=14.x)
- MongoDB (debe estar corriendo en `mongodb://localhost:27017/APINEXOPERSON`)

## Instalación

### Clonar el Repositorio:
```bash
git clone https://github.com/Quai1921/Test-NodeJS-API-Persons.git
cd Test-NodeJS-API-Persons
```

### Instalar Dependencias
```bash
npm install
```

## Configuración
### Base de Datos:  
MongoDB debe estar corriendo en:  
```bash
mongodb://localhost:27017/APINEXOPERSON
```


### Ejecución
Iniciar el servidor 
```bash
npm start
```

El servidor va a iniciarse en el puerto 3000 (o el puerto especificado en la variable de entorno PORT).

## Documentación de Swagger
La documentación de la API estará disponible en la ruta:
```bash
http://localhost:3000/api-docs
```

## Test de los endpoints
Para las pruebas, debes tener instalado Mocha y Chai:  
```bash
npm install --save-dev mocha chai chai-http
```

Ejecutarlas mediante:  
```bash
npm test
```

## Rutas de la API
### *Crear una persona*
#### Método: POST
Ruta: /api/persons  
**Cuerpo de la solicitud:**
```json
{
  "identification": "12345678",
  "name": "Juan",
  "lastName": "Perez",
  "age": 30,
  "photo": "http://example.com/photo.jpg",
  "addresses": [
    {
      "street": "San Martin",
      "number": 123,
      "city": "Cordoba"
    }
  ]
}
```


### *Obtener todas las Personas* 
#### Método: GET  
Ruta: /api/persons  

### *Buscar Personas*
#### Método: GET  
Ruta: /api/persons/search
**Parámetros de consulta:**
- identification, name, age

### *Obtener una persona por identificación*
#### Método: GET
Ruta: /api/persons/:identification  

### *Actualizar una persona*
#### Método: PUT
Ruta: /api/persons/:identification
**Cuerpo de la solicitud:**
```json
{
  "name": "Juanito",
  "age": 31
}
```

### *Eliminar una persona*
#### Método: DELETE
Ruta: /api/persons/:identification

### *Exportar personas a CSV*
#### Método: GET
Ruta: /api/export/persons  

## Manejo de errores
Los errores son manejados por el middleware errorHandler en el archivo middlewares/errorHandler.js.
