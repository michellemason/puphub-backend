const bcrypt = require("bcrypt");

const db = require("../db.js");
const { BCRYPT_WORK_FACTOR } = require("../config");


async function commonBeforeAll() {
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM users");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM dogs");

  await db.query("DELETE FROM bookings");

  await db.query(`
    INSERT INTO dogs(name, age, breed, gender, image, user_id)
    VALUES ('d1', '1', 'dog', 'male', 'https://www.dogbible.com/_ipx/f_webp,q_80,fit_cover,s_250x250/dogbible/i/en/collie-breed.png', 'user1'),
    ('d2', '2', 'dog', 'male', 'https://www.dogbible.com/_ipx/f_webp,q_80,fit_cover,s_250x250/dogbible/i/en/collie-breed.png', 'user2'),
    ('d3', '3', 'dog', 'male', 'https://www.dogbible.com/_ipx/f_webp,q_80,fit_cover,s_250x250/dogbible/i/en/collie-breed.png', 'user3')`);

 await db.query(`
    INSERT INTO bookings (start_date, username, end_date)
    VALUES ('2025-01-01', 'user1', '2025-01-05'),
           ('2025-01-01', 'user1', '2025-01-05'),
           ('2025-01-01', 'user1', '2025-01-05')
    RETURNING id`);

  await db.query(`
        INSERT INTO users(username,
                          password,
                          first_name,
                          last_name,
                          email)
        VALUES ('u1', $1, 'U1F', 'U1L', 'u1@email.com'),
               ('u2', $2, 'U2F', 'U2L', 'u2@email.com')
        RETURNING username`,
      [
        await bcrypt.hash("password1", BCRYPT_WORK_FACTOR),
        await bcrypt.hash("password2", BCRYPT_WORK_FACTOR),
      ]);
}

async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  await db.end();
}


module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
};