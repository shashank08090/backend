const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("./db/config");
const homepage = require("./homepage/homepage");
const User = require("./db/User");
const Questions = require("./db/questions");
const app = express();
app.use(cors());
const cloudinary = require("cloudinary");
require("./Cloudinary/cloudinary");
require("./db/photo");
// app.use(express.json());
const upload = require("./handlers/multer");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
const Blog = mongoose.model("Blog");
app.post("/register", async (req, res) => {
  let user = new User(req.body);
  let result = await user.save();
  console.log(user);
  res.send([req.body]);
  res.end();
  console.log("sign up ");
});

app.post("/photo", upload.single("img"), async (req, res) => {
  const result = await cloudinary.v2.uploader.upload(req.file.path);
  const blog = new Blog();
  blog.title = req.body.title;
  blog.imageUrl = result.secure_url;
  await blog.save();
  res.send({
    message: "Blog is Created",
  });
});

app.post("/question", async (req, res) => {
  let question = new Questions(req.body);
  // await question.save();
  let allques = await Questions.find();
  res.send(allques);
  let flag = 0;
  allques.map((element) => {
    if (element.name == question.name) {
      element.question.push(question.question[0]);
      element.save();
      flag = 1;
    }
  });

  if (flag == 0) {
    await question.save();
  }
  // res.send(question.name);
  // if(question.name == )
  res.end();
});

app.post("/login", async (req, res) => {
  let user = await User.findOne(req.body);
  console.log(req.body);

  if (user) {
    res.send({ user });
  } else {
    res.send({ msg: "fail" });
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
app.get("/homepage", async (req, res) => {
  res.send(homepage);
});
app.get("/", (req, res) => res.send("hey ! it is working"));
app.listen(5000, () => console.log("the app is working"));
