import { Request, Response, NextFunction } from "express";
import {
  readDatabase,
  createBook,
  deleteBook,
  getBook,
  updateBook,
} from "../utils";
import GenericError from "../model/GenericError";
import Book from "../model/Book";
import bookSchema, { idSchema } from "../validation/reqValidation";

class BooksController {
  //? What if I used static path?
  private static path = "./books.json";
  //TODO: Make a request that uses query to get every book contains the name
  readBooks(req: Request, res: Response, next: NextFunction) {
    try {
      const books = readDatabase(BooksController.path);
      res.status(200).json(books);
    } catch (error: unknown) {
      console.log((error as Error).message);
      next(new GenericError("Internal Server Error", 500));
    }
  }

  createBook(req: Request, res: Response, next: NextFunction) {
    try {
      const book: Book = req.body;
      const { error } = bookSchema.validate(book);
      if (error)
        throw new GenericError(
          "Wrong credentials: " + error.details[0].message,
          400
        );
      const isBookExists = getBook(BooksController.path, book.name);
      if (isBookExists) throw new GenericError("Book is already exists", 400);
      const isCreated = createBook(BooksController.path, book);
      if (!isCreated) throw new GenericError("Book does not created.", 500);
      res
        .status(201)
        .json({ statusCode: 201, message: "Book is created successfully" });
    } catch (error) {
      next(error);
    }
  }
  getBookById(req: Request, res: Response, next: NextFunction) {
    try {
      const books = readDatabase(BooksController.path);
      const book = books.filter(
        (book: Book) => book.id === Number(req.params.id)
      )[0];
      if (!book) throw new GenericError("Book does not exist!", 404);
      res.status(200).json(book);
    } catch (error) {
      next(error);
    }
  }

  updateBookById(req: Request, res: Response, next: NextFunction) {
    try {
      const book: Book = req.body;
      const id: number = Number(req.params.id);
      book.id = id;
      const { error } = bookSchema.validate(book);
      if (error)
        throw new GenericError(
          "Wrong credentials: " + error.details[0].message,
          400
        );
      updateBook(BooksController.path, id, book);
      res.status(200).json({ message: "Book is Updated" });
    } catch (error) {
      next(error);
    }
  }

  deleteBookById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const { error } = idSchema.validate(id);
      if (error) throw new GenericError(error.message, 400);
      const isDeleted = deleteBook(BooksController.path, id);
      if (!isDeleted) throw new GenericError("Internal server error", 500);
      res
        .status(201)
        .json({ statusCode: 201, message: "Deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
}

export default BooksController;
