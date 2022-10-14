const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const stripe = require("stripe")(
  "sk_test_51LpFxNSIb0nmN1aGrEalTtxttbvNlpllyGQOdtORstO9uzVeKim0q0XF4Zh4Q4Nu9XmukF8kL9DnkTz3Uc8qEDKy000mTcvXOS"
);
// const uuid = require("uuid/v4");
const { v4: uuid } = require("uuid");
// const uuid = require("uuid");
const cors = require("cors");
require("./db/config");
const homepage = require("./homepage/homepage");
const User = require("./db/User");
const Questions = require("./db/questions");
const Answers = require("./db/answers");
const multer = require("multer");
const ImageModel = require("./db/image.model");
const LikedQuestions = require("./db/like");
const Commentonquestion = require("./db/comment.question");
const app = express();
app.use(cors());
// app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

const Storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: Storage,
}).single("testImage");

app.post("/payment", (req, res) => {
  const { product, token } = req.body;
  console.log("PRODUCT", product);
  console.log("PRICE", product.price);
  const idempotencyKey = uuid();
  return stripe.customers
    .create({
      email: token.email,
      source: token.id,
    })
    .then((customer) => {
      stripe.charges.create(
        {
          amount: product.price * 100,
          currency: "usd",
          customer: customer.id,
          receipt_email: token.email,
          description: "service provider",
          shipping: {
            name: token.card.name,
            address: { country: token.card.address_country },
          },
        },
        { idempotencyKey: idempotencyKey }
      );
    })
    .then((result) => res.status(200).json(result))
    .catch((err) => console.log(err));
});

app.get("/commentonquestion", async (req, res) => {
  let comment = await Commentonquestion();
  let findallcomment = await Commentonquestion.find();
  res.send(findallcomment);
});
app.post("/commentonquestion", async (req, res) => {
  let comment = new Commentonquestion(req.body);

  let findthisuser = await Commentonquestion.findOne(req.body);
  if (findthisuser) {
    res.send({ msg: "This user already exists" });
  } else {
    let result = await comment.save();
    res.send({ msg: "comment saved in database" });
  }
  console.log(comment);
  res.end();
  console.log("sign up ");
});
app.post("/upload", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.log(err);
    } else {
      const newImage = new ImageModel({
        name: req.body.name,
        image: {
          // data: req.file.filename,
          contentType: "image/png",
        },
      });
      newImage
        .save()
        .then(() => res.send("successfully uploaded"))
        .catch((err) => res.send(err));
    }
  });
});

app.post("/register", async (req, res) => {
  let user = new User(req.body);

  let findthisuser = await User.findOne(req.body);
  if (findthisuser) {
    res.send({ msg: "This user already exists" });
  } else {
    let result = await user.save();
  }
  console.log(user);
  res.send([req.body]);
  res.end();
  console.log("sign up ");
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

app.post("/answer", async (req, res) => {
  let answer = new Answers(req.body);
  // await answer.save();
  let allques = await Answers.find();
  res.send(allques);
  let flag = 0;
  allques.map((element) => {
    if (element.question == answer.question) {
      element.answer.push(answer.answer[0]);
      element.save();
      flag = 1;
    }
  });

  if (flag == 0) {
    await answer.save();
  }
  // res.send(answer.name);
  // if(answer.name == )
  res.end();
});
app.get("/likedquestions", async (req, res) => {
  let likedquestion = new LikedQuestions(req.body);
  let alllikedquestion = await LikedQuestions.find();

  // res.send([alllikedquestion[0].likedBy.length]);
  // res.send("2nd data");
  var reqdata = [{}];
  alllikedquestion.map((elem, index) => {
    reqdata.push({
      question: elem.question,
      numberOflikes: elem.likedBy.length,
    });
  });
  res.send(reqdata);
  res.end();
});
app.post("/likes", async (req, res) => {
  let likedquestion = new LikedQuestions(req.body);
  let alllikedquestion = await LikedQuestions.find();
  let flag = 0;
  alllikedquestion.map((elem, index) => {
    if (elem.question == req.body.question) {
      elem.likedBy.push(likedquestion.likedBy[0]);
      elem.save();
      flag = 1;
    }
  });
  if (flag == 0) {
    await likedquestion.save();
  }
  res.end();
});

app.post("/dislikes", async (req, res) => {
  let dislikedquestion = new LikedQuestions(req.body);
  let alldislikedquestion = await LikedQuestions.find();
  let flag = 0;
  alldislikedquestion.map((elem, index) => {
    if (elem.question == req.body.question) {
      elem.dislikedBy.push(dislikedquestion.dislikedBy[0]);
      elem.save();
      flag = 1;
    }
  });
  if (flag == 0) {
    await dislikedquestion.save();
  }
  res.end();
});

app.get("/answer", async (req, res) => {
  let allques = await Answers.find();
  res.send(allques);
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
