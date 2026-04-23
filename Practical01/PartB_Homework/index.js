const express = require("express");
const app = express();
const PORT = 3001;
const data = require("./data.json");

app.get("/", (req, res) => {
  res.send("Welcome to Homework API");
});

// Define route for Intro Page
app.get("/intro", (req, res) => {
  res.json(data.intro);
});

// Define route for Name Page
app.get("/name", (req, res) => {
  res.json(data.name);
});

// Define route for Hobbies Page
app.get("/hobbies", (req, res) => {
  res.json(data.hobbies);
});

// Define route for Food Page
app.get("/food", (req, res) => {
  res.json(data.food);
});

// Listen on the port after defining routes
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});