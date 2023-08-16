"use strict";

// Routes for dogs

const jsonschema = require("jsonschema");
const express = require("express");
const { BadRequestError } = require("../expressError");
const { ensureCorrectUserOrAdmin } = require("../middleware/auth");
const Dog = require("../models/dog");
const dogNewSchema = require("../schemas/dogNew.json");
const dogSearchSchema = require("../schemas/dogSearch.json");

const router = new express.Router(); 
 
// Add a new dog for a user
router.post("/:username", ensureCorrectUserOrAdmin, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, dogNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const dog = await Dog.create(req.body, req.params.username);
    return res.status(201).json({ dog });
  } catch (err) {
    return next(err);
  }
});

// Get dogs based on search query
router.get("/", async function (req, res, next) {
  const q = req.query;
  try {
    const validator = jsonschema.validate(q, dogSearchSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }
    const dogs = await Dog.findAll(q);
    return res.json({ dogs });
  } catch (err) {
    return next(err);
  }
});

// Get a specific dog by id
router.get("/:id", async function (req, res, next) {
  try {
    const dog = await Dog.get(req.params.id);
    return res.json({ dog });
  } catch (err) {
    return next(err);
  }
});

// Get all of a users dogs
router.get("/user/:username", async function (req, res, next) {
  try {
    const dogs = await Dog.getUsersDogs(req.params.username);
    return res.json({ dogs });
  } catch (err) {
    return next(err);
  }
});

// Delete a dog based on id
router.delete("/:id", async function (req, res, next) {
  try {
    await Dog.remove(req.params.id, res.locals.user.username);
    return res.json({ deleted: req.params.id });
  } catch (err) {
    return next(err); 
  }
});


module.exports = router;
