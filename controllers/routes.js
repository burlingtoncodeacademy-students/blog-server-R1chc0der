const router = require("express").Router();
const db = require("../api/blog.json");
const fs = require("fs");
const fsPath = "./api/blog.json";

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
    let { title, author, body } = req.body;

    // Use math to create an id for the new character
    let newId = db.length + 1;

    // Declare and assign newChar object
    const newPersonId = {
      post_id: title,
      author,
      body,
    };

    fs.readFile(fsPath, (err, data) => {
      if (err) throw err;

      const database = JSON.parse(data);

      // create a way to make sure nothing has the same ID
      console.log(
        "ID values: ",
        database.filter((d) => {
          if (d) {
            return d.id;
          }
        })
      );

      let currentIDs = [];

      database.forEach((obj) => {
        currentIDs.push(obj.id);
      });
      if (currentIDs.includes(newId)) {
        let maxValue = Math.max(...currentIDs);
        newId = maxValue + 1;
        newCharacter.id = newId;
      }
      database.push(newCharacter);

      fs.writeFile(fsPath, JSON.stringify(database), (err) => {
        console.log(err);
      });

      res.status(200).json({
        status: `Created new character ${newCharacter.name}!`,
        newCharacter,
      });
    });

    console.log(req.body);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

module.exports = router;
