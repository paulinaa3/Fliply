require("dotenv").config();


const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User.js');


const OpenAI = require("openai");
const client = new OpenAI({
   apiKey: process.env.OPENAI_API_KEY,
});


const app = express();
const publicHtml = path.join(__dirname, 'publicHtml');
//severs everything from publicHtml folder
app.use(express.static(publicHtml));



//defaults to login page
app.get('/', function (req, res) {
   res.sendFile(path.join(publicHtml, 'login.html'))
})



//serve html login page
app.get('/login', function (req, res) {
   res.sendFile(path.join(publicHtml, 'login.html'))
})


//handle login logic
app.post('/login', async function (req, res) {
   let body = '';
   req.on('data', function (chunk) {
       body += chunk;
   })
   req.on('end', async function () {
       try {
           const query = JSON.parse(body);
           const email = query.email.toLowerCase();
           const password = query.password;

           //tries to find user in mongo database
           const user = await User.findOne({ email })
           if (!user) {
               return res.status(400).json({ message: "Invalid" });
           }

           //compares password from mongo db
           const samePassword = await bcrypt.compare(password, user.passwordHash);
           if (!samePassword) {
               return res.status(400).json({ message: "Invalid" });
           }
           return res.status(200).json({ message: "Success" });
       } catch (err) {
           console.log(err)
           res.status(500).json({ message: "Server error" });
       }
   })
})


app.post('/register', async function (req, res) {
   let body = '';
   req.on('data', function (chunk) {
       body += chunk;
   })
   req.on('end', async function () {
       try {
           const query = JSON.parse(body);
           const email = query.email.toLowerCase();
           const password = query.password;

           //if user exists, exit
           const user = await User.findOne({ email })
           if (user) {
               return res.status(400).json({ message: "Invalid" });
           }

           //compares password from mongo db
           const passwordHash = await bcrypt.hash(password, 10);
           await User.create({ email, passwordHash });
           return res.status(200).json({ message: "Success" });
       } catch (err) {
           console.log(err)
           res.status(500).json({ message: "Server error" });
       }
   })
})


app.get('/practiceTest', (req, res) => {
   res.sendFile(path.join(publicHtml, 'practiceTest.html'));
});


// placeholder for save card sets to the database
app.post("/saveCards", express.json(), (req, res) => {
   console.log("Received:", req.body);
   res.status(200).json({ message: "Success" });
});


app.post("/api/generateQuiz", express.json(), async (req, res) => {
   try {
       const { userText } = req.body;
       const completion = await client.chat.completions.create({
           model: "gpt-5-nano",
           messages: [
               { role: "user", content: userText }
           ]
       });

       const output = completion.choices[0].message.content;
       res.status(200).json({ output });
   } catch (err) {
       console.error(err);
       res.status(500).json({ message: "OpenAI error" });
   }
});



mongoose.connect(process.env.MONGO_URI, {
   serverSelectionTimeoutMS: 5000,
})
   .then(() => {
       app.listen(8080, () => {
           console.log("Running...");
       });
   })
   .catch((err) => {
       console.error(err);
   });
