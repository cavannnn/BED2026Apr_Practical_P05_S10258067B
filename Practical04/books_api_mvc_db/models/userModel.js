const sql = require("mssql");
const dbConfig = require("../dbConfig");

class User {
  static async createUser(user) {
    let connection = await sql.connect(dbConfig);
    const result = await connection.request()
      .input("username", sql.VarChar, user.username)
      .input("email", sql.VarChar, user.email)
      .query("INSERT INTO Users (username, email) VALUES (@username, @email); SELECT SCOPE_IDENTITY() AS id;");

    return { id: result.recordset[0].id, ...user };
  }

  static async getAllUsers() {
    let connection = await sql.connect(dbConfig);
    const result = await connection.request().query("SELECT * FROM Users");
    return result.recordset;
  }

  static async getUserById(id) {
    let connection = await sql.connect(dbConfig);
    const result = await connection.request()
      .input("id", sql.Int, id)
      .query("SELECT * FROM Users WHERE id = @id");
    return result.recordset[0];
  }

  static async updateUser(id, updatedUser) {
    let connection = await sql.connect(dbConfig);
    await connection.request()
      .input("id", sql.Int, id)
      .input("username", sql.VarChar, updatedUser.username)
      .input("email", sql.VarChar, updatedUser.email)
      .query("UPDATE Users SET username = @username, email = @email WHERE id = @id");
    return { id, ...updatedUser };
  }

  static async deleteUser(id) {
    let connection = await sql.connect(dbConfig);
    const result = await connection.request()
      .input("id", sql.Int, id)
      .query("DELETE FROM Users WHERE id = @id");
    return result.rowsAffected[0] > 0;
  }

  static async searchUsers(searchTerm) {
    let connection = await sql.connect(dbConfig);
    const query = `SELECT * FROM Users WHERE username LIKE '%' + @searchTerm + '%' OR email LIKE '%' + @searchTerm + '%'`;
    const result = await connection.request()
      .input("searchTerm", sql.NVarChar, searchTerm)
      .query(query);
    return result.recordset;
  }

  static async getUsersWithBooks() {
    let connection = await sql.connect(dbConfig);
    const query = `
      SELECT u.id AS user_id, u.username, u.email, b.id AS book_id, b.title, b.author
      FROM Users u
      LEFT JOIN UserBooks ub ON ub.user_id = u.id
      LEFT JOIN Books b ON ub.book_id = b.id
      ORDER BY u.username;
    `;
    const result = await connection.request().query(query);
    const usersWithBooks = {};
    for (const row of result.recordset) {
      if (!usersWithBooks[row.user_id]) {
        usersWithBooks[row.user_id] = { id: row.user_id, username: row.username, email: row.email, books: [] };
      }
      if (row.book_id !== null) {
        usersWithBooks[row.user_id].books.push({ id: row.book_id, title: row.title, author: row.author });
      }
    }
    return Object.values(usersWithBooks);
  }
}

module.exports = User;
