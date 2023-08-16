"use strict";

const db = require("../db");
const { NotFoundError} = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

class Dog {

// Create a new dog
  static async create({ name, age, breed, gender, image }, user_id) {
    const result = await db.query(
          `INSERT INTO dogs
           (name, age, breed, gender, image, user_id)
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING id, name, age, breed, gender, image, user_id`,
        [
          name,
          age,
          breed,
          gender, 
          image,
          user_id
        ],
    );
    const dog = result.rows[0];

    return dog;
  }

//FIND ALL DOGS BASED ON USER 
static async getUsersDogs(username) {
  const userRes = await db.query(
        `SELECT d.id,
                d.name,
                d.age,
                d.breed,
                d.gender,
                d.image,
                d.user_id
         FROM dogs d
         LEFT JOIN users AS u ON d.user_id = u.username
         WHERE u.username = $1`, [username]);

  const dog = userRes.rows;

  return dog;
}  

// Find all dogs
  static async findAll() {
    const result = await db.query(
          `SELECT id,
                  name,
                  age,
                  breed,
                  gender, 
                  image,
                  user_id
           FROM dogs
           ORDER BY name`,
    );

    return result.rows;
  }

// Get information on dog given ID
  static async get(id) {
    const dogRes = await db.query(
          `SELECT id,
                name,
                age,
                breed,
                gender,
                image,
                user_id
           FROM dogs
           WHERE id = $1`, [id]);

    const dog = dogRes.rows[0];

    if (!dog) throw new NotFoundError(`No dog found: ${id}`);

    // Double check with Julie if this query logic works
    const usersRes = await db.query(
          `SELECT u.username
           FROM users u
           LEFT JOIN dogs AS d ON d.user_id = u.username
           WHERE d.id = $1`, [id]);

    dog.user = usersRes.rows[0];

    return dog;
  }

// Update a dogs information
  static async update(id, data) {
    const { setCols, values } = sqlForPartialUpdate(
        data,
        {});
    const idVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE dogs 
                      SET ${setCols} 
                      WHERE id = ${idVarIdx} 
                      RETURNING id, 
                                name,
                                age,
                                breed,
                                gender,
                                image,
                                user_id`;
    const result = await db.query(querySql, [...values, id]);
    const dog = result.rows[0];

    if (!dog) throw new NotFoundError(`No dog found: ${id}`);

    return dog;
  }

// Delete a given dog
  static async remove(id, username) {
    const result = await db.query(
          `DELETE
           FROM dogs
           WHERE id = $1
           AND user_id = $2
           RETURNING id`, [id, username]);
    const dog = result.rows[0];

    if (!dog) throw new NotFoundError(`No dog found: ${id}`);
  }
}

module.exports = Dog;
