const fs = require('fs');

class ProductManager {
    constructor(path) {
        this.path = path;
        this.productIdCounter = 1;
    }

    addProduct(title, description, price, thumbnail, code, stock) {
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.log("Todos los datos son obligatorios.");
            return;
        }

        let products = this.loadProducts();

        const existingProduct = products.find((product) => product.code === code);
        if (existingProduct) {
            console.log("El codigo del producto ya existe.")
            return;
        }

        const newProduct = {
            id: this.productIdCounter++,
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
        };

        products.push(newProduct);

        this.saveProducts(products);
        console.log("Producto agregado exitosamente")
    }

    getProducts() {
        return this.loadProducts();
    }

    getProductById(id) {
        const products = this.loadProducts();
        const product = products.find((product) => product.id === id);
        if (product) {
            return product;
        } else {
            console.log("Producto no encontrado.");
        }
    }

    updateProduct(id, updatedField, newValue) {
        let products = this.loadProducts();
        const productIndex = products.findIndex((product) => product.id === id);

        if (productIndex === -1) {
            console.log("Producto no encontrado.");
            return;
        } else {
            products[productIndex][updatedField] = newValue;
            console.log(`Producto con ID: ${id} actualizado.`)
        }

        this.saveProducts(products);
    }

    deleteProduct(id) {
        let products = this.loadProducts();
        const productIndex = products.findIndex((product) => product.id === id);

        if (productIndex === -1) {
            console.log("Producto no encontrado.");
            return;
        } else {
            const newProducts = products.filter((product) => product.id !== id)
            this.saveProducts(newProducts);
            console.log(`Producto con ID: ${id} eliminado.`)
        }
    }

    loadProducts() {
        try {
            const data = fs.readFileSync(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }

    saveProducts(products) {
        try {
            const data = JSON.stringify(products);
            fs.writeFileSync(this.path, data, 'utf-8');
        } catch (error) {
            console.log("Error al guardar los productos:", error);
        }
    }
}

//Inicio
const manager = new ProductManager('products.json');

//addProduct
manager.addProduct("Producto 1", "Descripción del producto 1", 150, "imagen1.jpg", "P1", 20);
manager.addProduct("Producto 2", "Descripción del producto 2", 400, "imagen2.jpg", "P2", 15);

//getProducts y getProductById
console.log("Lista de productos:", manager.getProducts());
console.log("Producto por ID:", manager.getProductById(2));

//updateProduct
manager.updateProduct(2, "price", 4000);
console.log("Producto por ID:", manager.getProductById(2));

//deleteProduct
manager.deleteProduct(1)
console.log("Lista de productos:", manager.getProducts());

//Validaciones:
manager.addProduct("Producto 3", "Descripción del producto 3", 350, "imagen3.jpg", "P1", 25); // Validación de code repetido
manager.addProduct("Producto 4", "Descripción del producto 4", "imagen4.jpg", 25); // Validacion de campos faltantes
const nonExistentProduct = manager.getProductById(3); // Busqueda de producto no existente 
