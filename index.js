const express = require("express");
const bodyParser = require("body-parser");
const util = require("util");

const fs = require("fs");
const app = express();
const readFileContents = util.promisify(fs.readFile);

app.use(bodyParser.urlencoded({extended: false}))

errorReadingFile = (err) => {
  console.log("error reading file:", err)        
}

app.get("/blog", (request,response) => {
  readFileContents("./blog-data.json")
    .then(data => {
      response.send(JSON.parse(data))
    })
    .catch(err => errorReadingFile(err))
})

//GET: /blog/{id}
// This should return all blog posts from 'blog-data.json'
// that have an id that matches whatever was passed in from the URL
// i.e. /blog/5 should return all blog posts with the id of 5

app.get("/blog/:id", (request,response) => {
  readFileContents("./blog-data.json") 
    .then(data => {
      const id = request.params.id;
      const result = JSON.parse(data);
      response.send(result[id]);
    })
    .catch(err => errorReadingFile)
})


//POST: /blog/new
// This should accept a POST request with the following fields, and
// add a new blog post to the blog-data.json file.
//
// * first_name
// * last_name
// * date
// * title
// * content 


app.post("/new", (request,response) => {
  readFileContents("./blog-data.json") 
  .then(data => {
    let blogs = JSON.parse(data);
    let maxID = 0;
    for (let blog in blogs) {
      maxID = Math.max(maxID,parseInt(blog))
    }
    let newBlogPost = {
      "id": ++maxID,
      "first_name": request.body.first_name,
      "last_name": request.body.last_name,
      "date": request.body.date,
      "title": request.body.title,
      "content": request.body.content
    }
    blogs[maxID] = newBlogPost;
    fs.writeFile("./blog-data.json",JSON.stringify(blogs,null," "), () => {
      response.send(newBlogPost)  ;    
    })
  })
})

app.listen(3000, () => {
  console.log("Running on port 3000");
})

