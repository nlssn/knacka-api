const express = require("express");
const monk = require("monk");
const joi = require("joi");

// Connect to database
const db = monk(process.env.MONGO_URI);
// Access the courses collection
const courses = db.get("courses");

// Define schema with joi
const schema = joi.object({
  name: joi.string().trim().required(),
  courseId: joi.string().trim().required(),
  video_url: joi.string().uri(),
});

let router = express.Router();

// Read
router.get("/", async (req, res, next) => {
  try {
    const items = await courses.find({});
    res.json(items);
  } catch (error) {
    res.json({ message: error });
  }
});

// Read single
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const item = await courses.findOne({
      _id: id,
    });

    if (!item) {
      return res.json({ message: "Hittade inte den angivna kursen" });
    }

    return res.json(item);
  } catch (error) {
    res.json(error);
  }
});

// Create
router.post("/", async (req, res) => {
  try {
    console.log(req.body);
    // validate the incoming data w/ joi
    const data = await schema.validateAsync(req.body);
    // Insert the validated data
    const inserted = await courses.insert(data);
    res.json(inserted);
  } catch (error) {
    res.json({ message: error });
  }
});

// Update
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // validate the incoming data w/ joi
    const data = await schema.validateAsync(req.body);

    // Find the item with the given id
    const item = await courses.findOne({
      _id: id,
    });

    if (!item) {
      return res.json({ message: "Hittade inte den angivna kursen" });
    }

    // Update the item
    await courses.update({ _id: id }, { $set: data });

    // Return the data
    res.json(data);
  } catch (error) {
    res.json({ message: "något gick fel" });
  }
});

// Create
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await courses.remove({ _id: id });
    res.status(200).send("Success");
  } catch (error) {}
});
module.exports = router;
