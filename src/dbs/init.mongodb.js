'use strict'

const mongoose = require('mongoose')
const connectString = `mongodb://root:password@localhost:27017`
const {countConnect} = require('../helpers/check.connect')

class Database {
    constructor(){
        this.connect()
    }

    // connect
    connect(type = 'mongodb'){

        if (1===1){
            mongoose.set('debug', true);
            mongoose.set('debug', {color: 'red'});
        }
        mongoose.connect(connectString).then(_ => {
             console.log(`Connected MongoDB Success`, countConnect())
        
            }).catch(err =>console.log(`Error Connect! ${err}`))
    }

    static getInstance(){
        if (!this.instance) {
            this.instance = new Database()
        }

        return Database.instance
    }
}

const instanceMongodb = Database.getInstance()

module.exports = instanceMongodb