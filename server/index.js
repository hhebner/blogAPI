const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { corsOptionsRequests, corsSimpleRequests } = require('../middleware/cors')
const removePoweredBy = require('../middleware/removePoweredBy')
const config = require('./config');

const app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//connecting to mongoDB
//I made a a file named config with my link becasue it had my password in it 
mongoose.connect(config.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//schema for what will be stored in MongoDB
const Post = mongoose.model('Post', {
  title: String,
  text: String,
});

app.options('*', corsOptionsRequests)
app.use(corsSimpleRequests)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(removePoweredBy)
app.use(bodyParser.json());

//defining the endpoints 
app.get('/posts', async (req, res) => {
  const posts = await Post.find();
  res.json(posts);
});

app.post('/posts', async (req, res) => {
  const { title, text } = req.body;
  const post = new Post({ title, text });
  await post.save();
  res.json(post);
});

app.put('/posts/:id', async (req, res) => {
  const { title, text } = req.body;
  const post = await Post.findByIdAndUpdate(req.params.id, { title, text }, { new: true });
  res.json(post);
});

app.delete('/posts/:id', async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

//setting up server to listen to port 3001
app.listen(3001, () => {
  console.log('Server listening on port 3001');
});