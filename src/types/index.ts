export interface User {
  id: string;
  username: string;
  phoneNumber: string;
  createdAt: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  status: 'available' | 'borrowed';
  borrowedBy?: string; // user id
  borrowerName?: string;
  borrowDate?: string;
  addedAt: string;
}

export interface Database {
  users: User[];
  books: Book[];
}
