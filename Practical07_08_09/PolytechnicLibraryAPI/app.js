const express = require("express");
const sql = require("mssql");
const dotenv = require("dotenv");
const swaggerUi = require("swagger-ui-express");

dotenv.config();

const swaggerDocument = require("./swagger-output.json");
const bookController = require("./controllers/bookController");
const userController = require("./controllers/userController");
const { verifyJWT } = require("./middlewares/authMiddleware");
const {
  validateRegistration,
  validateLogin,
  validateAvailability,
  validateBookId,
} = require("./middlewares/validation");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.post("/register", validateRegistration, userController.registerUser);
app.post("/login", validateLogin, userController.login);

app.get("/books", verifyJWT, bookController.getAllBooks);
app.put(
  "/books/:bookId/availability",
  verifyJWT,
  validateBookId,
  validateAvailability,
  bookController.updateBookAvailability
);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

process.on("SIGINT", async () => {
  console.log("Server is gracefully shutting down");
  await sql.close();
  console.log("Database connections closed");
  process.exit(0);
});
