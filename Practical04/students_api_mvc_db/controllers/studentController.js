const studentModel = require("../models/studentModel");

async function getAllStudents(req, res) {
  try {
    const students = await studentModel.getAllStudents();
    res.json(students);
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: "Error retrieving students" });
  }
}

async function getStudentById(req, res) {
  try {
    const id = Number(req.params.id);
    const student = await studentModel.getStudentById(id);

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving student" });
  }
}

async function createStudent(req, res) {
  try {
    const student = await studentModel.createStudent(req.body);
    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ error: "Error creating student" });
  }
}

async function updateStudent(req, res) {
  try {
    const id = Number(req.params.id);
    const student = await studentModel.updateStudent(id, req.body);

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({ error: "Error updating student" });
  }
}

async function deleteStudent(req, res) {
  try {
    const id = Number(req.params.id);
    const deleted = await studentModel.deleteStudent(id);

    if (!deleted) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Error deleting student" });
  }
}

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
};