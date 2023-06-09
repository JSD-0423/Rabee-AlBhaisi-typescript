import { readFileSync, writeFileSync } from "fs";
import Book from "./model/Book";
import GenericError from "./model/GenericError";

const readDatabase = (path: string): Book[] => {
  try {
    const data = readFileSync(path);
    return JSON.parse(data.toString());
  } catch (err) {
    const exception = err as Error;
    console.error("readDatabase() Err : " + exception.message);
    throw new GenericError("Internal Server Error", 500);
  }
};

function getBook(path: string, name: string): Book;
function getBook(path: string, id: number): Book;
function getBook(path: any, searchParam: any): Book {
  try {
    const books: Book[] = readDatabase(path);
    return books.filter(
      (book) => book.name === searchParam || book.id === searchParam
    )[0];
  } catch (error) {
    console.error("Error at getBookById()");
    throw new GenericError("Internal Server Error", 500);
  }
}

const deleteBook = (path: string, id: number) => {
  try {
    const books = readDatabase(path);
    const book = books.filter((book: Book) => book.id === Number(id))[0];
    if (!book) throw new GenericError("The book already does not exist!", 404);
    const newBooks = books.filter((book: Book) => book.id !== id);
    const newData = JSON.stringify(newBooks);
    writeFileSync(path, newData);
    return true;
  } catch (err) {
    const exception = err as GenericError;
    console.error("deleteBook() Err : " + exception.message);
    throw new GenericError(
      exception.message || "Failed to delete the book",
      exception.status || 500
    );
  }
};

const createBook = (path: string, newBook: Book): boolean => {
  try {
    const books: Book[] = readDatabase(path);
    const id: number = books[books.length - 1].id + 1;
    const { name, author, isbn } = newBook;
    books.push({ id, name, author, isbn });
    const newData = JSON.stringify(books);
    writeFileSync(path, newData);
    return true;
  } catch (err) {
    const exception = err as Error;
    console.error("createBook() Err : " + exception.message);
    throw new GenericError("Failed to create the new book", 500);
  }
};

const updateBook = (path: string, id: number, newData: Book) => {
  try {
    const books: Book[] = readDatabase(path);
    for (let index = 0; index < books.length; index++) {
      const book = books[index];
      if (book.id === id) {
        books[index] = newData;
        const updatedData = JSON.stringify(books);
        writeFileSync(path, updatedData);
        return true;
      }
    }
    throw new GenericError("The Requested book does not exist", 404);
  } catch (err) {
    const exception = err as GenericError;
    console.error("updateBook() Err : " + exception.message);
    if (exception.name === "GenericError") {
      throw new GenericError(
        exception.message || "Internal server error",
        exception.status || 500
      );
    }
  }
};

export { readDatabase, deleteBook, createBook, getBook, updateBook };
