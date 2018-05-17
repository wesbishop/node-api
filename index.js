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

function addNewPost(data,request) {
  let blogs =  JSON.parse(data);
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

  fs.writeFile("./blog-data.json",JSON.stringify(blogs,null," "), (err) => {
   if (err) {console.log("error writing file");}
  })

  return new Promise( resolve => {
    resolve(newBlogPost)
  });
}

app.get("/blog", (request,response) => {
  readFileContents("./blog-data.json")
    .then(data => {
      response.send(JSON.parse(data))
    })
    .catch(err => errorReadingFile(err))
})

app.get("/blog/:id", (request,response) => {
  readFileContents("./blog-data.json") 
    .then(data => {
      const id = request.params.id;
      const result = JSON.parse(data);
      response.send(result[id]);
    })
    .catch(err => errorReadingFile)
})

app.post("/new", (request,response) => {
  readFileContents("./blog-data.json","utf8") 
  .then( data => {
    return addNewPost(data,request)
  })
  .then(data =>  {
    response.send(data);
   })
   .catch(err => {
     console.log("err",err);
   })
})

app.listen(3000, () => {
  console.log("Running on port 3000");
})



