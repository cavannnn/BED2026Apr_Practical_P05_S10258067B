const booksController = require("../controllers/bookController");
const Book = require("../models/bookModel");

jest.mock("../models/bookModel");

describe("booksController.getAllBooks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch all books and return a JSON response", async () => {
    const mockBooks = [
      {
        book_id: 1,
        title: "The Lord of the Rings",
        author: "J.R.R. Tolkien",
        availability: "Y",
      },
      {
        book_id: 2,
        title: "The Hitchhiker's Guide to the Galaxy",
        author: "Douglas Adams",
        availability: "N",
      },
    ];

    Book.getAllBooks.mockResolvedValue(mockBooks);

    const req = {};
    const res = {
      json: jest.fn(),
    };

    await booksController.getAllBooks(req, res);

    expect(Book.getAllBooks).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith(mockBooks);
  });

  it("should handle errors and return a 500 status with error message", async () => {
    const errorMessage = "Database error";
    Book.getAllBooks.mockRejectedValue(new Error(errorMessage));

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await booksController.getAllBooks(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith("Error retrieving books");
  });
});

describe("booksController.updateBookAvailability", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should update the availability of a book and return the updated book", async () => {
    const updatedBook = {
      book_id: 1,
      title: "The Lord of the Rings",
      author: "J.R.R. Tolkien",
      availability: "N",
    };

    Book.updateBookAvailability.mockResolvedValue(updatedBook);

    const req = {
      params: { bookId: "1" },
      body: { availability: "N" },
    };
    const res = {
      json: jest.fn(),
    };

    await booksController.updateBookAvailability(req, res);

    expect(Book.updateBookAvailability).toHaveBeenCalledWith(1, "N");
    expect(res.json).toHaveBeenCalledWith(updatedBook);
  });

  it("should return a 404 status when the book does not exist", async () => {
    Book.updateBookAvailability.mockResolvedValue(null);

    const req = {
      params: { bookId: "999" },
      body: { availability: "Y" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await booksController.updateBookAvailability(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Book not found" });
  });

  it("should handle errors and return a 500 status with error message", async () => {
    Book.updateBookAvailability.mockRejectedValue(new Error("Database error"));

    const req = {
      params: { bookId: "1" },
      body: { availability: "Y" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await booksController.updateBookAvailability(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith("Error updating book availability");
  });
});
