// ============================================================
// Importación de Express y configuración del servidor
// ============================================================
const express = require('express')
const app = express()

// Middleware para interpretar cuerpos JSON.
// El JSON enviado por el cliente queda disponible en req.body.
app.use(express.json())

// ============================================================
// Función auxiliar de validación
// ============================================================
// Devuelve true cuando un campo no fue enviado o llegó vacío.
// Se utiliza en POST para comprobar los campos obligatorios.
const esVacio = valor => valor === undefined || valor === null || valor === ''

// ============================================================
// Arreglo de productos iniciales
// ============================================================
// Almacén en memoria de la API. Al reiniciar el servidor,
// los datos vuelven a estos tres productos iniciales.
const productos = [
    {
        id: 1,
        nombre: 'Teclado inalambrico',
        descripcion: 'Teclado 101 teclas idioma ingles',
        precio: 1500.00
    },
    {
        id: 2,
        nombre: 'Mouse inalambrico',
        descripcion: 'Mouse optico inalambrico.',
        precio: 600.00
    },
    {
        id: 3,
        nombre: 'Monitor 23.5 pulgadas full hd',
        descripcion: 'Monitor Full HD panel IPS',
        precio: 6500.00
    }
]

// ============================================================
// GET /productos - Listar todos los productos
// ============================================================
app.get('/productos', (req, res) => {
    // 200 OK: la consulta se realizó correctamente.
    res.json(productos)
})

// ============================================================
// GET /productos/:id - Buscar un producto por ID
// ============================================================
app.get('/productos/:id', (req, res) => {
    // req.params contiene los parámetros variables de la ruta.
    // El ID llega como string, por eso se convierte a entero.
    const id = parseInt(req.params.id)

    // find() devuelve el primer producto cuyo ID coincide.
    // Si no encuentra ninguno, devuelve undefined.
    const producto = productos.find(p => p.id === id)

    if (!producto) {
        // 404 Not Found: el recurso solicitado no existe.
        return res.status(404).json({ mensaje: 'Producto no encontrado' })
    }

    // 200 OK: el producto existe y se devuelve en la respuesta.
    res.json(producto)
})

// ============================================================
// POST /productos - Crear un producto
// ============================================================
app.post('/productos', (req, res) => {
    // req.body contiene los datos enviados en el cuerpo de la petición.
    // El valor por defecto {} evita errores si el cuerpo no llegó.
    const { nombre, descripcion, precio } = req.body || {}

    // Validación de campos obligatorios antes de crear el producto.
    // 400 Bad Request: la petición no incluye los datos requeridos.
    if (esVacio(nombre) || esVacio(descripcion) || esVacio(precio)) {
        return res.status(400).json({
            mensaje: 'Los campos nombre, descripcion y precio son obligatorios'
        })
    }

    // parseFloat() convierte el precio recibido a número decimal.
    const precioNumerico = parseFloat(precio)

    // Si la conversión falla, el precio no es un número válido.
    if (Number.isNaN(precioNumerico)) {
        return res.status(400).json({ mensaje: 'El precio debe ser un número válido' })
    }

    // Math.max() obtiene el ID más alto del arreglo y se suma 1
    // para generar un ID nuevo que no se repita con los existentes.
    // El 0 inicial cubre el caso de un arreglo vacío.
    const nuevoId = Math.max(0, ...productos.map(p => p.id)) + 1

    const nuevoProducto = {
        id: nuevoId,
        nombre,
        descripcion,
        precio: precioNumerico
    }

    // push() agrega el nuevo producto al final del arreglo en memoria.
    productos.push(nuevoProducto)

    // 201 Created: el recurso se creó correctamente.
    res.status(201).json(nuevoProducto)
})

// ============================================================
// PUT /productos/:id - Actualizar un producto
// ============================================================
app.put('/productos/:id', (req, res) => {
    // El ID de la URL se convierte a entero para compararlo con los datos.
    const id = parseInt(req.params.id)

    // findIndex() devuelve la posición del producto, no el objeto.
    // Esa posición permite reemplazar el elemento dentro del arreglo.
    const indice = productos.findIndex(p => p.id === id)

    // findIndex() devuelve -1 cuando no encuentra ningún producto con ese ID.
    // Primero se comprueba la existencia; solo si existe se validan los datos.
    if (indice === -1) {
        // 404 Not Found: no existe el producto que se quiere actualizar.
        return res.status(404).json({ mensaje: 'Producto no encontrado' })
    }

    // Se leen los nuevos datos desde el cuerpo de la petición.
    const { nombre, descripcion, precio } = req.body || {}

    // Validación de campos obligatorios antes de actualizar.
    // 400 Bad Request: faltan datos en la petición.
    if (!nombre || !descripcion || !precio) {
        return res.status(400).json({
            mensaje: 'Los campos nombre, descripcion y precio son obligatorios'
        })
    }

    // parseFloat() asegura que el precio se guarde como número.
    const precioNumerico = parseFloat(precio)

    // Se reemplaza el objeto completo en la posición encontrada.
    // El ID se toma de la URL para conservar el identificador original.
    productos[indice] = {
        id,
        nombre,
        descripcion,
        precio: precioNumerico
    }

    // 200 OK: la actualización se realizó correctamente.
    res.status(200).json(productos[indice])
})

// ============================================================
// DELETE /productos/:id - Eliminar un producto
// ============================================================
app.delete('/productos/:id', (req, res) => {
    // parseInt() convierte el ID de la URL a número entero.
    const id = parseInt(req.params.id)

    // findIndex() devuelve la posición necesaria para eliminar con splice().
    const indice = productos.findIndex(p => p.id === id)

    // -1 indica que el producto no existe en el arreglo.
    // Se comprueba antes de intentar eliminarlo.
    if (indice === -1) {
        // 404 Not Found: no hay producto con ese ID.
        return res.status(404).json({ mensaje: 'Producto no encontrado' })
    }

    // Se guarda una referencia al producto antes de eliminarlo.
    // splice() lo quita del arreglo, pero el objeto sigue disponible
    // para devolverlo en la respuesta.
    const productoEliminado = productos[indice]
    productos.splice(indice, 1)

    // 200 OK: la eliminación se realizó correctamente.
    res.status(200).json({
        mensaje: 'Producto eliminado',
        producto: productoEliminado
    })
})

// ============================================================
// Inicio del servidor
// ============================================================
app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000')
})
