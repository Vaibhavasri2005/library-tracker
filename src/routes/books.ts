import { Router, Request, Response } from 'express';
import { DataStore } from '../utils/dataStore';
import { Book } from '../types';

export const booksRouter = Router();

// Get all books
booksRouter.get('/books', (req: Request, res: Response) => {
  const books = DataStore.getBooks();
  res.status(200).json({
    success: true,
    books
  });
});

// Get book by ID
booksRouter.get('/books/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const book = DataStore.getBookById(id);
  
  if (!book) {
    return res.status(404).json({
      success: false,
      message: 'Book not found'
    });
  }
  
  res.status(200).json({
    success: true,
    book
  });
});

// Add new book
booksRouter.post('/books', (req: Request, res: Response) => {
  const { title, author, isbn } = req.body;
  
  if (!title || !author) {
    return res.status(400).json({
      success: false,
      message: 'Title and author are required'
    });
  }
  
  const newBook: Book = {
    id: Date.now().toString(),
    title,
    author,
    isbn: isbn || '',
    status: 'available',
    addedAt: new Date().toISOString()
  };
  
  DataStore.addBook(newBook);
  
  res.status(201).json({
    success: true,
    message: 'Book added successfully',
    book: newBook
  });
});

// Borrow book
booksRouter.post('/books/:id/borrow', (req: Request, res: Response) => {
  const { id } = req.params;
  const { userId } = req.body;
  
  if (!userId) {
    return res.status(400).json({
      success: false,
      message: 'User ID is required'
    });
  }
  
  const book = DataStore.getBookById(id);
  
  if (!book) {
    return res.status(404).json({
      success: false,
      message: 'Book not found'
    });
  }
  
  if (book.status === 'borrowed') {
    return res.status(400).json({
      success: false,
      message: 'Book is already borrowed'
    });
  }
  
  const user = DataStore.getUserById(userId);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }
  
  const updated = DataStore.updateBook(id, {
    status: 'borrowed',
    borrowedBy: userId,
    borrowerName: user.username,
    borrowDate: new Date().toISOString()
  });
  
  if (!updated) {
    return res.status(500).json({
      success: false,
      message: 'Failed to borrow book'
    });
  }
  
  res.status(200).json({
    success: true,
    message: 'Book borrowed successfully',
    book: DataStore.getBookById(id)
  });
});

// Return book
booksRouter.post('/books/:id/return', (req: Request, res: Response) => {
  const { id } = req.params;
  
  const book = DataStore.getBookById(id);
  
  if (!book) {
    return res.status(404).json({
      success: false,
      message: 'Book not found'
    });
  }
  
  if (book.status === 'available') {
    return res.status(400).json({
      success: false,
      message: 'Book is not borrowed'
    });
  }
  
  const updated = DataStore.updateBook(id, {
    status: 'available',
    borrowedBy: undefined,
    borrowerName: undefined,
    borrowDate: undefined
  });
  
  if (!updated) {
    return res.status(500).json({
      success: false,
      message: 'Failed to return book'
    });
  }
  
  res.status(200).json({
    success: true,
    message: 'Book returned successfully',
    book: DataStore.getBookById(id)
  });
});

// Delete book
booksRouter.delete('/books/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  
  const deleted = DataStore.deleteBook(id);
  
  if (!deleted) {
    return res.status(404).json({
      success: false,
      message: 'Book not found'
    });
  }
  
  res.status(200).json({
    success: true,
    message: 'Book deleted successfully'
  });
});
