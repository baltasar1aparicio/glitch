import express from 'express'
import chatRouter from './routes/chat.routes.js'
import productsRouter from './routes/products.routes.js'
import cartRouter from './routes/cart.routes.js'
import { __dirname } from './path.js'
import { Server } from 'socket.io'
import { engine } from 'express-handlebars'
import upload from './config/multer.js'


//Configuraciones o declaraciones
const app = express()
const PORT = 9000

const server = app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`)
})
const io = new Server(server)

//Middlewares
app.use(express.json())
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', __dirname + '/views')

const mensajes = []
io.on('connection', (socket) => {
    console.log(`Conexion con Socket.io`)

    socket.on('mensaje', info => {
        console.log(info)
        mensajes.push(info)
        io.emit('mensajeLogs', mensajes) 
    })
})


//Routes
/*app.get('/', (req, res) => {
    // Define la variable css con el nombre del archivo CSS que deseas incluir
    const cssFile = 'home.css';
    // Renderiza la vista main.handlebars y pasa la variable css
    res.render('main', { css: cssFile });
});*/

app.use('/public', express.static(__dirname + '/public'))
app.use('/api/products', productsRouter, express.static(__dirname + '/public'))
app.use('/api/cart', cartRouter)
app.get('/api/chat', chatRouter ,express.static(__dirname + '/public'))
app.post('/upload', upload.single('product'), (req, res) => {
    try {
        console.log(req.file)
        console.log(req.body)
        res.status(200).send("Imagen cargada correctamente")
    } catch(e) {
        res.status(500).send("Error al cargar imagen")
    }
})


/*
app.get('/static', (req, res) => {

    const prods = [
        {id: 1, title: `Celular`, price: 1500, img: ""},
        {id: 1, title: `Televisor`, price: 2500, img: ""},
        {id: 1, title: `Notebook`, price: 1700, img: ""},
        {id: 1, title: `Tablet`, price: 6200, img: ""}
    ]
    res.render('templates/products', {
        mostrarProductos: true,
        productos: prods,
        css: 'product.css'
    })
})
*/

