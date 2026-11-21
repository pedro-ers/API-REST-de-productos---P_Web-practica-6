const express = require('express')
const app = express()

app.use(express.json())

// Función auxiliar para comprobar campos vacíos
const esVacio = valor => valor === undefined || valor === null || valor === ''

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

// GET - Listar todos los productos
app.get('/productos', (req, res) => {
    res.json(productos)
})

// GET - Obtener un producto por id
app.get('/productos/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const producto = productos.find(p => p.id === id)

    if (!producto) {
        return res.status(404).json({ mensaje: 'Producto no encontrado' })
    }

    res.json(producto)
})

// POST - Crear un nuevo producto
app.post('/productos', (req, res) => {
    const { nombre, descripcion, precio } = req.body || {}

    if (esVacio(nombre) || esVacio(descripcion) || esVacio(precio)) {
        return res.status(400).json({
            mensaje: 'Los campos nombre, descripcion y precio son obligatorios'
        })
    }

    const precioNumerico = parseFloat(precio)

    if (Number.isNaN(precioNumerico)) {
        return res.status(400).json({ mensaje: 'El precio debe ser un número válido' })
    }

    const nuevoId = Math.max(0, ...productos.map(p => p.id)) + 1

    const nuevoProducto = {
        id: nuevoId,
        nombre,
        descripcion,
        precio: precioNumerico
    }

    productos.push(nuevoProducto)

    res.status(201).json(nuevoProducto)
})


// PUT - Actualizar un producto
app.put('/productos/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const indice = productos.findIndex(p => p.id === id)

    if (indice === -1) {
        return res.status(404).json({ mensaje: 'Producto no encontrado' })
    }

    const { nombre, descripcion, precio } = req.body || {}

    if (!nombre || !descripcion || !precio) {
        return res.status(400).json({
            mensaje: 'Los campos nombre, descripcion y precio son obligatorios'
        })
    }

    const precioNumerico = parseFloat(precio)

    productos[indice] = {
        id,
        nombre,
        descripcion,
        precio: precioNumerico
    }

    res.status(200).json(productos[indice])
})


// DELETE - Eliminar un producto
app.delete('/productos/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const indice = productos.findIndex(p => p.id === id)

    if (indice === -1) {
        return res.status(404).json({ mensaje: 'Producto no encontrado' })
    }

    const productoEliminado = productos[indice]
    productos.splice(indice, 1)

    res.status(200).json({
        mensaje: 'Producto eliminado',
        producto: productoEliminado
    })
})


app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000')
})
