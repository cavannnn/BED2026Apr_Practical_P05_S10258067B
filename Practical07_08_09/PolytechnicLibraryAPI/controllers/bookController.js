const bookModel = require("../models/bookModel");

async function getAllBooks(req, res) {
  try {
    const books = await bookModel.getAllBooks();
    res.json(books);
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).send("Error retrieving books");
  }
}

async function updateBookAvailability(req, res) {
  try {
    const bookId = parseInt(req.params.bookId);
    const { availability } = req.body;

    const updatedBook = await bookModel.updateBookAvailability(bookId, availability);

    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json(updatedBook);
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).send("Error updating book availability");
  }
}

module.exports = {
  getAllBooks,
  updateBookAvailability,
};
