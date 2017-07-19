var express = require('express');
var app = express();
var pug = require('pug');
var bodyParser = require('body-parser');
// npm install <> --save
// load the mysql library for #4
var mysql = require('promise-mysql');
// create a connection to our local server
var connection = mysql.createPool({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database: 'reddit',
    connectionLimit: 10
});
// load our API and pass it the connection
var RedditAPI = require('/Users/admin/Desktop/reddit-nodejs-api/reddit');
var myReddit = new RedditAPI(connection);

app.set('view engine', 'pug');


// #1

app.get('/', function (req, res) {
  res.send('Hello World!');
});


// #2

app.get('/hello', function(req, res){
  if (req.query.name === 'John'){
    res.send('<h1>Hello John</h1>');
  } else {
    res.send('<h1>Hello World!</h1>');
  }
})


// #3

app.get('/calculator/:operation', function(req, res){
  var num1 = +req.query.num1;
  var num2 = +req.query.num2;
  var op = req.params.operation;
  if (op !== 'add' && op !== 'multiply') {
    res.status(400).json({error:'operation must be of add or multiply'});
    return;
  }
  var response = {
    operation : op,
    firstOperand : num1,
    secondOperand : num2,
    solution : op === 'add' ? num1 + num2 : num1 * num2
  }
  res.json(response);
  // http://localhost:3333/calculator/add/?num1=2&num2=3
})


// #4

app.get('/posts', function(req, res){
  myReddit.getAllPosts().then(results =>{
    res.render('posts', {posts: results}) // use pug and pass results to it
    // res.render('post-list', {posts : results});
  })
  .catch(err => {
    res.status(500).send(err.stack);
  })
});

app.get('/post-list', function (request, response) {
   myReddit.getAllPosts()
   .then(posts => {
     response.render('post-list', {posts: posts});
   });
 });

// #5

app.get('/new-post', function(req, res){
//   var html_form = `<form action="/createPost" method="POST"><!-- why does it say method="POST" ?? -->
//   <p>
//     <input type="text" name="url" placeholder="Enter a URL to content">
//   </p>
//   <p>
//     <input type="text" name="title" placeholder="Enter the title of your content">
//   </p>
//   <button type="submit">Create!</button>
// </form>`;
// res.render(html_form);
  res.render('create-content');
});


// #6/#7 going back and forth with #5

//catching the submission from the new-post
app.post('/createPost', bodyParser.urlencoded({extended:false}),(req,res) =>{
  console.log(req.body)

  myReddit.createPost({
      userId: 1,
      title:req.body.title,
      subredditId:2,
      url:req.body.url
    })
  res.redirect('/new-post');
});
//because if you refresh the page it will count it as a new createPost with no info. So we want to redirect ppl because if they refresh, they will
//refresh on a page that has a GET method, not a POST method so they wont be adding more blank posts.
//basically always redirect after post request. ///

// #8

app.listen(3333, function() {
  console.log('Server running on port 3333 ...');
});


/* YOU DON'T HAVE TO CHANGE ANYTHING BELOW THIS LINE :) */
// Boilerplate code to start up the web server
// var server = app.listen(process.env.PORT, process.env.IP, function () {
//   console.log('Example app listening at http://%s', process.env.C9_HOSTNAME);
// });
