const express = require('express')
const bcrypt = require("bcrypt");
const app = express()
const port = 3000
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Todo = require('../models/Todo')
const User = require("../models/User");

const SECRET_JWT_CODE = 'psmR3Hu0ihHkqZymo1m'

app.use(express.json())

mongoose.connect('mongodb+srv://kwnaso-naseer:Cinnova123@cluster0.kfywi.mongodb.net/mern-todo?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('connected db'))
  .catch((err) => console.log(err));

app.get("/user-todo/:id", async (req, res) => {
  const userId = req.params.id;
  res.send(await Todo.find({
    userId
  }).populate('userId'))

})

app.get('/', async (req, res) => {
  try {
    res.send(await Todo.find().populate("userId"))
  } catch (error) {
    console.log(error)
  }
})

app.get('/registered-users', async (req, res) => {
  try {
    res.send(await User.find())
  } catch (error) {
    console.log(error)
  }
})

app.get('/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id)
    res.send(todo)
  } catch (error) {
    console.log(error)
  }
})

app.delete('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    Todo.findByIdAndRemove(id, function (err) {
      if (!err) {
        res.send("Successfully deleted")
      } else
        res.send('no id exist')
    })
  }
  catch (error) {
    res.status(500).send({ message: "Server Error" })
  }
})

app.post('/', async (req, res) => {
  const newTodo = {
    title: req.body.title,
    description: req.body.description,
  }
  try {
    const todo = await Todo.create(newTodo)
    res.send(todo)
  }
  catch (error) {
    res.status(500).send({ message: 'Server error' })
  }
})

app.patch('/:id', async (req, res) => {
  try {
    const updateIndex = await Todo.findById(req.params.id)
    console.log(updateIndex)
    if (updateIndex === -1) {
      return res.status(404).send({ message: 'No todo found with this id' })
    }
    updateIndex.title = req.body.title
    updateIndex.description = req.body.description
    const a1 = await updateIndex.save()
    res.send(a1)
  }

  catch (error) {
    res.status(500).send({ message: 'Server error' })
  }

})

app.post("/signup", async (req, res) => {
  const body = req.body;
  console.log(body.email, body.password)
  const alreadyExist = await User.findOne({ email: body.email })
  if (alreadyExist) {
    return res.send("User already exist")
  }

  const newUser = new User(body)
  const salt = await bcrypt.genSalt(10)

  newUser.password = await bcrypt.hash(newUser.password, salt)
  newUser.save().then((newUser) => res.status(201).send(newUser))
})

app.post("/login", async (req, res) => {
  const body = req.body;
  const user = await User.findOne({ email: body.email })

  if (user) {
    const validatePassword = await bcrypt.compare(body.password, user.password)

    if (validatePassword) {
      const token = jwt.sign({ id: user._id, email: user.email }, SECRET_JWT_CODE)
      res.status(200).send(token)
    } else {
      res.status(200).send({ message: "Invalid password" });
    }
  }
})

app.post('/add-new-todo', async (req, res) => {
  const body = req.body;
  console.log(body.id, body.title, body.description)

  const todo = await Todo.create({
    userId: body.id,
    title: body.title,
    description: body.description
  })
  res.send(todo)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})