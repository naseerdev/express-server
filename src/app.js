const express = require('express')
const app = express()
const port = 3000
const mongoose = require("mongoose");
const Todo = require('../models/Todo')

app.use(express.json())

mongoose.connect('mongodb+srv://kwnaso-naseer:Cinnova123@cluster0.kfywi.mongodb.net/mern-todo?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // useCreateIndex: true,
  // useFindAndModify: false
})
  .then(() => console.log('connected db'))
  .catch((err) => console.log(err));

// const todoList = [
//   {
//     id: 1,
//     title: 'Learn Node.js',
//     description: 'Learn Node.js by building a todo list app',
//   },
//   {
//     id: 2,
//     title: 'Learn React',
//     description: 'Learn React by building a todo list app',
//   },
//   {
//     id: 3,
//     title: 'Learn React Native',
//     description: 'Learn React Native by building a todo list app',
//   },
//   {
//     id: 4,
//     title: 'Learn GraphQL',
//     description: 'Learn GraphQL by building a todo list app',
//   }
// ]

app.get('/', async (req, res) => {
  try {
    res.send(await Todo.find())
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

app.delete('/:id', (req, res) => {
  try {
    const removeIndex = Todo.findIndex(item => item.id === parseInt(req.params.id));
    if (removeIndex === -1) {
      return res.status(404).send({ message: 'No todo found with this id' })
    }
    Todo.splice(removeIndex, 1);
    res.send(Todo)
  }
  catch (error) {
    res.status(500).send({ message: error })
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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})