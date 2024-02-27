import { promises as fs } from 'fs'

export class CartManager {
    constructor(path) {
        this.path = path
    }

    
    async getCart() {
        const prods = JSON.parse(await fs.readFile(this.path, 'utf-8'))
        return prods
    }

    async addProductByCart(idProducto, quantity) {
        const cart = JSON.parse(await fs.readFile(this.path, 'utf-8'))

        const indice = cart.findIndex(product => product.id == idProducto)

        if(indice != -1) {
            cart[indice].quantity += quantity
        }else {
            const prod = {id: idProducto, quantity: quantity}
            cart.push(prod)
        }
        await fs.writeFile(this.path, JSON.stringify(cart))
        return `Producto cargado correctamente`
    }
}