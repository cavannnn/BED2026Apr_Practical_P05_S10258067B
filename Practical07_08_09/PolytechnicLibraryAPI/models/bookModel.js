const sql = require("mssql");
const dbConfig = require("../dbConfig");

async function getAllBooks() {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const query = "SELECT book_id, title, author, availability FROM Books";
    const result = await connection.request().query(query);
    return result.recordset;
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

async function getBookById(bookId) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const query =
      "SELECT book_id, title, author, availability FROM Books WHERE book_id = @bookId";
    const request = connection.request();
    request.input("bookId", bookId);
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

async function updateBookAvailability(bookId, availability) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const query = "UPDATE Books SET availability = @availability WHERE book_id = @bookId";
    const request = connection.request();
    request.input("bookId", bookId);
    request.input("availability", availability);
    const result = await request.query(query);

    if (result.rowsAffected[0] === 0) {
      return null;
    }

    return await getBookById(bookId);
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
  getAllBooks,
  getBookById,
  updateBookAvailability,
};
