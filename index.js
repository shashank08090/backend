const express = require ('express');
const mongoose = require('mongoose')
const app = express()

 const connectdb = async() =>{
    mongoose.connect('mongodb://localhost:27017/myproject', ()=> console.log('db connected'))
    const productschema = new mongoose.Schema({})
    const product = mongoose.model("prods" , productschema)
    const data = await product.find()
    console.warn(data)
    console.warn(product)
 }
 connectdb()
app.get('/' , (req,res) => res.send("hey ! it is working"))
app.listen(5000 , ()=> console.log("the app is working"))