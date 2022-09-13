const express = require ('express');
const mongoose = require('mongoose');
require('./db/config')
const User = require('./db/User')
const app = express()
app.use(express.json())

app.post('/register', async(req,res) =>{
    let user = new User (req.body)
    let result = await user.save()
   console.log(user)
   res.send(req.body)
   res.end()
   console.log('sign up ')
})
app.post('/login', async(req, res) => {
let user = await User.findOne(req.body)
if(user) {
   res.send('user found, you are successfully logged in')
}else {
   res.send('login failed, please check your name and password')
}
});
//  const connectdb = async() =>{
//     mongoose.connect('mongodb://localhost:27017/myproject', ()=> console.log('db connected'))
//     const productschema = new mongoose.Schema({})
//     const product = mongoose.model("prods" , productschema)
//     const data = await product.find()
//     console.warn(data)
//     console.warn(product)
//  }
//  connectdb()
app.get('/' , (req,res) => res.send("hey ! it is working"))
app.listen(5000 , ()=> console.log("the app is working"))