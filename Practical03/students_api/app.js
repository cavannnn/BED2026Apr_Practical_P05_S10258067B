const express = require("express");
const sql = require("mssql");
const dbConfig = require("./dbConfig");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded());


// Start server + DB
app.listen(port, async () => {
  try {
    await sql.connect(dbConfig);
    console.log("Database connection established successfully");
  } catch (err) {
    console.error("Database connection error:", err);
    process.exit(1);
  }

  console.log(`Server listening on port ${port}`);
});


// Shutdown
process.on("SIGINT", async () => {
  console.log("Server is gracefully shutting down");

  await sql.close();

  console.log("Database connection closed");
  process.exit(0);
});


// GET all students
app.get("/students", async (req, res) => {
  let connection;

  try {
    connection = await sql.connect(dbConfig);

    const sqlQuery = `SELECT student_id, name, address FROM Students`;
    const request = connection.request();

    const result = await request.query(sqlQuery);

    res.json(result.recordset);

  } catch (error) {
    console.error("Error in GET /students:", error);
    res.status(500).send("Error retrieving students");

  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (closeError) {
        console.error("Error closing database connection:", closeError);
      }
    }
  }

});


// GET student by ID
app.get("/students/:id", async (req, res) => {
  const studentId = Number(req.params.id);

  let connection;

  try {
    connection = await sql.connect(dbConfig);

    const sqlQuery = `SELECT student_id, name, address FROM Students WHERE student_id = @id`;
    const request = connection.request();
    request.input("id", studentId);

    const result = await request.query(sqlQuery);

    if (!result.recordset[0]) {
      return res.status(404).json({
        message: `No student found with id ${studentId}.`,
      });
    }

    res.json(result.recordset[0]);

  } catch (error) {
    console.error(`Error in GET /students/${studentId}:`, error);
    res.status(500).send("Error retrieving student");

  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (closeError) {
        console.error("Error closing database connection:", closeError);
      }
    }
  }

});


// POST create student
app.post("/students", async (req, res) => {
  const newStudentData = req.body;

  let connection;

  try {
    connection = await sql.connect(dbConfig);

    const sqlQuery = `
      INSERT INTO Students (name, address)
      VALUES (@name, @address);
      SELECT SCOPE_IDENTITY() AS student_id;
    `;

    const request = connection.request();
    request.input("name", newStudentData.name);
    request.input("address", newStudentData.address);

    const result = await request.query(sqlQuery);

    const newStudentId = result.recordset[0].student_id;

    const getNewStudentQuery = `
      SELECT student_id, name, address
      FROM Students
      WHERE student_id = @id
    `;

    const getNewStudentRequest = connection.request();
    getNewStudentRequest.input("id", newStudentId);

    const newStudentResult = await getNewStudentRequest.query(getNewStudentQuery);

    res.status(201).json(newStudentResult.recordset[0]);

  } catch (error) {
    console.error("Error in POST /students:", error);
    res.status(500).send("Error creating student");

  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (closeError) {
        console.error("Error closing database connection:", closeError);
      }
    }
  }
});


// Update student
app.put("/students/:id", async (req, res) => {
  const studentId = Number(req.params.id);
  const { name, address } = req.body;

  let connection;

  try {
    connection = await sql.connect(dbConfig);

    // Check if student exists
    const checkQuery = `SELECT student_id, name, address FROM Students WHERE student_id = @id`;
    const checkRequest = connection.request();
    checkRequest.input("id", studentId);

    const checkResult = await checkRequest.query(checkQuery);

    if (!checkResult.recordset[0]) {
      return res.status(404).json({
        message: `No student found with id ${studentId}.`,
      });
    }

    // Update student
    const updateQuery = `
      UPDATE Students
      SET name = @name, address = @address
      WHERE student_id = @id
    `;

    const updateRequest = connection.request();
    updateRequest.input("id", studentId);
    updateRequest.input("name", name);
    updateRequest.input("address", address);

    await updateRequest.query(updateQuery);

    // Fetch updated student
    const getUpdatedQuery = `
      SELECT student_id, name, address
      FROM Students
      WHERE student_id = @id
    `;

    const getUpdatedRequest = connection.request();
    getUpdatedRequest.input("id", studentId);

    const updatedResult = await getUpdatedRequest.query(getUpdatedQuery);

    res.json(updatedResult.recordset[0]);

  } catch (error) {
    console.error(`Error in PUT /students/${studentId}:`, error);
    res.status(500).send("Error updating student");

  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (closeError) {
        console.error("Error closing database connection:", closeError);
      }
    }
  }

});


// Delete student
app.delete("/students/:id", async (req, res) => {
  const studentId = Number(req.params.id);

  let connection;

  try {
    connection = await sql.connect(dbConfig);

    // Check if student exists
    const checkQuery = `SELECT student_id FROM Students WHERE student_id = @id`;

    const checkRequest = connection.request();
    checkRequest.input("id", studentId);

    const checkResult = await checkRequest.query(checkQuery);

    if (!checkResult.recordset[0]) {
      return res.status(404).json({
        message: `No student found with id ${studentId}.`,
      });
    }

    // Delete student
    const deleteQuery = `DELETE FROM Students WHERE student_id = @id`;

    const deleteRequest = connection.request();
    deleteRequest.input("id", studentId);

    await deleteRequest.query(deleteQuery);

    res.status(204).send();

  } catch (error) {
    console.error(`Error in DELETE /students/${studentId}:`, error);
    res.status(500).send("Error deleting student");

  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (closeError) {
        console.error("Error closing database connection:", closeError);
      }
    }
  }

});