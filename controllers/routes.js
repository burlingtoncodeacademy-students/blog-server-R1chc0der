const router = require("express").Router();
// linking blog.json to routes.js for internal affairs
const fsPath = "../api/blog.json";
// throwing the blog.json into a variable call db for internal usage
const db = require(fsPath);
// used for writing to json file
const fs = require("fs");
const path = require("path");
// used to write to the database(json object "db") __dirname is keyword
const fullPath = path.join(__dirname, fsPath);

//  Endpoint that will display all comments from the database. In lieu of database, we use our blog.json file.
// localhost:4029/ to get all
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
router.get("/:id", (req, res) => {
  try {
    const id = req.params.id;
    //find method to search for obj or the user input (req)
    let commentId = db.find((obj) => obj.post_id == id);
    res.status(200).json({
      commentId,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// Error Response Function
const errorResponse = (res, error) => {
  return res.status(500).json({
    Error: error.message,
  });
};

//Creating the delete endpoint http://localhost:4029/:id

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    // read from blog.json
    const post = db.find((p) => p.post_id == id);
    // if statement is true(id not found) error! If not run @this^_^
    if (post === undefined) {
      res.status(404).json({});
      return;
    }

    // delete item containing the id ^_^
    const updatedDB = db.filter((p) => p.post_id != id);

    // write to blog.json
    fs.writeFile(fullPath, JSON.stringify(updatedDB), (err) => {
      console.log(err);
    });

    res.status(200).json({});
  } catch (err) {
    errorResponse(res, err);
  }
});

// POST One - Create, http://localhost:4029/newpostId
router.post("/newpostid", (req, res) => {
  try {
    let { title, author, body } = req.body;

    const fullPath = path.join(__dirname, fsPath);

    fs.readFile(fullPath, (err, data) => {
      if (err) throw err;

      const database = JSON.parse(data);
      // Use math to create an id for the new post
      let newId = database.length + 1;

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

//  One by ID - Update
router.put("/:id", (req, res) => {
  try {
    const id = Number(req.params.id);
    const fullPath = path.join(__dirname, fsPath);
    const updatedInfo = req.body;
    fs.readFile(fullPath, (err, data) => {
      if (err) throw err;

      const database = JSON.parse(data);

      let theId;

      database.forEach((obj, i) => {
        if (obj.post_id === id) {
          let buildObj = {};

          for (key in obj) {
            if (updatedInfo[key]) {
              console.log("Checked");
              buildObj[key] = updatedInfo[key];
            } else {
              buildObj[key] = obj[key];
            }
          }

          database[i] = buildObj;
          theId = buildObj;
        }
      });
      // Error message for it that id isn't in the data base (db)
      if (Object.keys(theId).length <= 0)
        res.status(404).json({ message: "No character in roster" });

      fs.writeFile(fullPath, JSON.stringify(database), (err) =>
        console.log(err)
      );

      res.status(200).json({
        status: `Modified character at ID: ${id}.`,
        character: theId,
      });
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

module.exports = router;
