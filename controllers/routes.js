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
router.get("/:id", (req, res) => {
  try {
    const id = req.params.id;

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

// Creating the delete endpoint

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

// Put One by ID - Update
router.put("/:id", (req, res) => {
  try {
    const id = Number(req.params.id);

    const updatedInfo = req.body;
    fs.readFile(fsPath, (err, data) => {
      if (err) throw err;

      const database = JSON.parse(data);

      let theId;

      database.forEach((obj, i) => {
        if (obj.id === id) {
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

      fs.writeFile(fsPath, JSON.stringify(database), (err) => console.log(err));

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
