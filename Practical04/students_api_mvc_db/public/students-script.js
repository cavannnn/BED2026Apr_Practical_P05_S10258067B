const studentsListDiv = document.getElementById("studentsList");
const fetchStudentsBtn = document.getElementById("fetchStudentsBtn");
const messageDiv = document.getElementById("message");

const apiBaseUrl = "http://localhost:3000";

async function fetchStudents() {
  try {
    studentsListDiv.innerHTML = "Loading students...";
    messageDiv.textContent = "";

    const response = await fetch(`${apiBaseUrl}/students`);

    if (!response.ok) {
      const errorBody = response.headers
        .get("content-type")
        ?.includes("application/json")
        ? await response.json()
        : { message: response.statusText };

      throw new Error(errorBody.error || errorBody.message);
    }

    const students = await response.json();

    studentsListDiv.innerHTML = "";

    if (students.length === 0) {
      studentsListDiv.innerHTML = "<p>No students found.</p>";
      return;
    }

    students.forEach((student) => {
      const studentElement = document.createElement("div");
      studentElement.classList.add("student-item");
      studentElement.setAttribute("data-student-id", student.student_id);

      studentElement.innerHTML = `
        <h3>${student.name}</h3>
        <p>Address: ${student.address}</p>
        <p>ID: ${student.student_id}</p>
        <button onclick="viewStudentDetails(${student.student_id})">View Details</button>
        <button onclick="editStudent(${student.student_id})">Edit</button>
        <button class="delete-btn" data-id="${student.student_id}">Delete</button>
      `;

      studentsListDiv.appendChild(studentElement);
    });

    document.querySelectorAll(".delete-btn").forEach((button) => {
      button.addEventListener("click", handleDeleteClick);
    });
  } catch (error) {
    console.error("Error fetching students:", error);
    studentsListDiv.innerHTML = `<p class="error">Failed to load students: ${error.message}</p>`;
  }
}

async function viewStudentDetails(studentId) {
  try {
    const response = await fetch(`${apiBaseUrl}/students/${studentId}`);

    const responseBody = response.headers
      .get("content-type")
      ?.includes("application/json")
      ? await response.json()
      : { message: response.statusText };

    if (!response.ok) {
      throw new Error(responseBody.error || responseBody.message);
    }

    alert(
      `Student Details:\nID: ${responseBody.student_id}\nName: ${responseBody.name}\nAddress: ${responseBody.address}`
    );
  } catch (error) {
    console.error("Error viewing student:", error);
    messageDiv.textContent = `Failed to view student: ${error.message}`;
    messageDiv.style.color = "red";
  }
}

function editStudent(studentId) {
  window.location.href = `edit-student.html?id=${studentId}`;
}

async function handleDeleteClick(event) {
  const studentId = event.target.getAttribute("data-id");

  const confirmDelete = confirm(
    `Are you sure you want to delete student ID ${studentId}?`
  );

  if (!confirmDelete) return;

  try {
    const response = await fetch(`${apiBaseUrl}/students/${studentId}`, {
      method: "DELETE",
    });

    if (response.status === 204) {
      messageDiv.textContent = `Student ID ${studentId} deleted successfully.`;
      messageDiv.style.color = "green";

      const studentElement = event.target.closest(".student-item");
      studentElement.remove();
    } else {
      const responseBody = response.headers
        .get("content-type")
        ?.includes("application/json")
        ? await response.json()
        : { message: response.statusText };

      throw new Error(responseBody.error || responseBody.message);
    }
  } catch (error) {
    console.error("Error deleting student:", error);
    messageDiv.textContent = `Failed to delete student: ${error.message}`;
    messageDiv.style.color = "red";
  }
}

fetchStudentsBtn.addEventListener("click", fetchStudents);

window.addEventListener("load", fetchStudents);