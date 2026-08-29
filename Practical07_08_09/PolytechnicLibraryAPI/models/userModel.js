const sql = require("mssql");
const dbConfig = require("../dbConfig");

async function getUserById(userId) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const query = "SELECT user_id, username, role FROM Users WHERE user_id = @userId";
    const request = connection.request();
    request.input("userId", userId);
    const result = await request.query(query);

    if (result.recordset.length === 0) {
      return null;
    }

    return result.recordset[0];
  } catch (error) {
    console.error("Database error:", error);
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection:", err);
      }
    }
  }
}

async function getUserByUsername(username) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const query =
      "SELECT user_id, username, passwordHash, role FROM Users WHERE username = @username";
    const request = connection.request();
    request.input("username", username);
    const result = await request.query(query);

    if (result.recordset.length === 0) {
      return null;
    }

    return result.recordset[0];
  } catch (error) {
    console.error("Database error:", error);
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection:", err);
      }
    }
  }
}

async function createUser(userData) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const query =
      "INSERT INTO Users (username, passwordHash, role) VALUES (@username, @passwordHash, @role); SELECT SCOPE_IDENTITY() AS user_id;";
    const request = connection.request();
    request.input("username", userData.username);
    request.input("passwordHash", userData.passwordHash);
    request.input("role", userData.role);
    const result = await request.query(query);

    const newUserId = result.recordset[0].user_id;
    return await getUserById(newUserId);
  } catch (error) {
    console.error("Database error:", error);
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection:", err);
      }
    }
  }
}

module.exports = {
  getUserById,
  getUserByUsername,
  createUser,
};
