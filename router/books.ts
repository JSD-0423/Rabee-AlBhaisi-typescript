import { Router } from "express";
import BooksController from "../controller/BooksController";

const booksController = new BooksController();
const router = Router();

router
  .route("/")
  .get(booksController.readBooks)
  .post(booksController.createBook);

router
  .route("/:id")
  .get(booksController.getBookById)
  //? There is no PATCH in the router object !!!
  .put(booksController.updateBookById)
  .delete(booksController.deleteBookById);

export default router;
