const sql = require("mssql");
const dbConfig = require("../dbConfig");

async function getAllStudents() {
  const connection = await sql.connect(dbConfig);
  const result = await connection
    .request()
    .query("SELECT student_id, name, address FROM Students");
  await connection.close();
  return result.recordset;
}

async function getStudentById(id) {
  const connection = await sql.connect(dbConfig);
  const request = connection.request();
  request.input("id", id);

  const result = await request.query(
    "SELECT student_id, name, address FROM Students WHERE student_id = @id"
  );

  await connection.close();
  return result.recordset[0] || null;
}

async function createStudent(studentData) {
  const connection = await sql.connect(dbConfig);

  const request = connection.request();
  request.input("name", studentData.name);
  request.input("address", studentData.address);

  const result = await request.query(`
    INSERT INTO Students (name, address)
    VALUES (@name, @address);
    SELECT SCOPE_IDENTITY() AS student_id;
  `);

  await connection.close();
  return await getStudentById(result.recordset[0].student_id);
}

async function updateStudent(id, studentData) {
  const connection = await sql.connect(dbConfig);

  const request = connection.request();
  request.input("id", id);
  request.input("name", studentData.name);
  request.input("address", studentData.address);

  const result = await request.query(`
    UPDATE Students
    SET name = @name, address = @address
    WHERE student_id = @id
  `);

  await connection.close();

  if (result.rowsAffected[0] === 0) return null;
  return await getStudentById(id);
}

async function deleteStudent(id) {
  const connection = await sql.connect(dbConfig);

  const request = connection.request();
  request.input("id", id);

  const result = await request.query(
    "DELETE FROM Students WHERE student_id = @id"
  );

  await connection.close();
  return result.rowsAffected[0] > 0;
}

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
};