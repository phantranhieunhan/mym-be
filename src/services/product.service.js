'use strict'

const{product, clothing, electronic} = require('../models/product.model')

class ProductFactory {
    static async createProduct({type, payload}){
        switch(type){
            case 'Electronics':
                // return new 
        }
    }
}

class Product {
    constructor({
        product_name, product_thumb, product_description, product_price, product_type, product_shop, product_attributes, product_quantity
    }){
        this.product_name = product_name;
        this.product_thumb = product_thumb;
        this.product_description = product_description;
        this.product_price = product_price;
        this.product_type = product_type;
        this.product_shop = product_shop;
        this.product_attributes = product_attributes;
        this.product_quantity = product_quantity;
    }

    async createProduct(){
        return await product.create(this)
    }

}

