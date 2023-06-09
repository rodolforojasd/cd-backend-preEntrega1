
import crypto from 'crypto'
import fs from 'fs/promises'


class Product {
    constructor( id,code, title, description, abv, price, status, stock, category, thumbnail, db, createdAt) {
       
        if (!title) throw new Error('falta un argumento title')
        if (!description) throw new Error('falta un argumento')
        if(Number.isNaN(price)||!price) throw new Error('falta un argumento price o es un tipo invalido')
        if(Number.isNaN(stock)||!stock) throw new Error('falta un argumento stock o es un tipo invalido')
        if (!category) throw new Error('falta el argumento category')
        // if (thumbnail.length === 0) throw new Error('falta un argumento thumbnail')

        this.id = id
        this.code=code
        this.title = title
        this.description = description
        this.abv=abv
        this.price= price
        this.status=status
        this.stock = stock
        this.category=category
        this.thumbnail=thumbnail
        this.db=db
        this.createdAt=createdAt

    }
}


class ProductManager {


    constructor() {
        
        this.products = []
        this.path={products:'./data/products.json', titleSorted:'./data/sortedProducts.json'}
        this.sortedProducts=[]
    }
    async createPath(){
        
        await fs.appendFile(this.path.products,'[]',"utf-8")
        await fs.appendFile(this.path.titleSorted,'{}','utf-8')
    } 

    async loadProducts(){
        let  inJSON = await fs.readFile(this.path.products)
        let data = await JSON.parse(inJSON)
        this.products = data
        }
    
    async loadSortedProducts(){
        let  inJSON = await fs.readFile(this.path[1])
        let data = await JSON.parse(inJSON)
        this.sortedProducts = data
    }

    async saveProducts(){
        let data = this.products
        let inJSON =  JSON.stringify(data, null,'\t')
        fs.writeFile(this.path.products,inJSON)
    }

    async saveSortedProducts(){
        let data = this.sortedProducts
        let inJSON =  JSON.stringify(data, null,'\t')
        fs.writeFile(this.path[1],inJSON)
    }

    
    

    async getProducts() {
        debugger
        await this.loadProducts()
        return this.products    
    }

    async getProductById(id) {
        await this.loadProducts()
        const searched = this.products[id-1]
        if (!searched) {
            throw new Error('product not found')
        }

        return searched
    }

    async addProduct(title,description,abv,price,stock,category,thumbnail,db){
        await this.loadProducts()
        
        let id = null
                                                                                  
        if(this.products.some((product)=> product.title===title||this.products.some((product)=> product.id===id))){
            console.log(title)
            throw new Error (`el producto "${title}" ya existe`)  
        }
        
       

        if(this.products.length > 0){
            id = this.products.length + 1
            let product = new Product (id,crypto.randomUUID(), title, description, abv, price, true, stock, category, thumbnail,db, Date.now())
            this.products.push(product)
        }

        if(this.products.length === 0){
            id = 1
            let  product = new Product ( id,crypto.randomUUID(), title, description,abv, price, true, stock, category, thumbnail,db, Date.now())
            this.products.push(product) 
        }
        
        this.saveProducts()
    }

    async updateProduct(id, newProduct) {
       await  this.loadProducts()

        const indexSearched = this.products.findIndex(product => product.id == id)
        if (indexSearched === -1) {
            throw new Error('product not found')
        }
        this.products[indexSearched] = newProduct
        this.saveProducts()
        return newProduct
    }

    sortProducts(){

        this.products
       
    }
    async deleteProductById(id) {
    debugger  
       await this.loadProducts()
       const indexSearched = this.products.findIndex(p => p.id === id)
       let deleted = this.products[indexSearched]
       
        
        if (indexSearched === -1) {

            throw new Error('product not found')

        }else if(indexSearched === this.products[this.products.length-1]) {
             
             this.products.pop()
             this.saveProducts()
             return deleted

        }else if (indexSearched === 0){

            this.products.shift()
            const updated =[]
            this.products.forEach((p)=>{
                if(p.id > indexSearched){
                    p.id = p.id-1
                    updated.push(p)
                }else{
                    p.id= p.id
                    updated.push(p)
                }
                
            })
            this.products = updated
            this.saveProducts()
            return deleted

        }else{
           
            [deleted] = this.products.splice(indexSearched, 1)
            const updated = []

            this.products.forEach((p)=> {
                if(p.id >= indexSearched + 1){
                   p.id = p.id-1
                }else{
                    p.id = p.id
                }
                updated.push(p)
            })
            this.products = updated
            this.saveProducts()
            return deleted
        }
        
    }
}

export const productManager= new ProductManager




productManager.deleteProductById(1)