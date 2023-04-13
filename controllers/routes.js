const router = require("express").Router();
const fsPath = "../api/blog.json";
const db = require(fsPath);
const fs = require("fs");
const path = require("path");

//  Endpoint that will display all comments from the database. In lieu of database, we use our blog.json file.
router.get("/", (req, res) => {
  try {
    res.status(200).json({
      results: db,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

//  Endpoint that will display one comment from the database selected by its post_id
router.get("/helloid/:id", (req, res) => {
  try {
    const id = req.params.id;

    let personId = db.filter((obj) => obj.id == id);
    res.status(200).json({
      status: `Post id: ${id}`,
      personId,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// Create a new entry
/* {
  "post_id": 1,
  "title": "First Blog Post",
  "author": "Paul Niemczyk",
  "body": "These student devs keep getting younger and smarter"
} */
// POST One - Create, http://localhost:4029/newpostId
router.post("/newpostid", (req, res) => {
  try {
    // template from blog.json for object destructure
    /*
let title = req.body.title;
let author = req.body.author;
let body = req.body.body;
*/
    let { title, author, body } = req.body;

    const fullPath = path.join(__dirname, fsPath);

    fs.readFile(fullPath, (err, data) => {
      if (err) throw err;

      const database = JSON.parse(data);
      // Use math to create an id for the new post
      let newId = database.length + 1;

      // create a way to make sure nothing has the same ID
      /* console.log(
        "ID values: ",
        database.filter((d) => {
          if (d) {
            return d.id;
          }
        })
      ); */

      let currentIDs = [];

      database.forEach((obj) => {
        currentIDs.push(obj.id);
      });
      // Declare and assign new post object
      const newPost = {
        post_id: newId,
        title,
        author,
        body,
      };

      if (currentIDs.includes(newId)) {
        let maxValue = Math.max(...currentIDs);
        newId = maxValue + 1;
        newPost.id = newId;
      }
      database.push(newPost);

      fs.writeFile(fullPath, JSON.stringify(database), (err) => {
        console.log(err);
      });

      res.status(200).json({
        status: `Created new Post ${newPost.title}!`,
        newPost,
      });
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

module.exports = router;
