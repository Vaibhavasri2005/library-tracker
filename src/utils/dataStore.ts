import fs from 'fs';
import path from 'path';
import { Database, User, Book } from '../types';

export class DataStore {
  private static dataPath = path.join(__dirname, '../../data/database.json');
  
  static initialize(): void {
    const dataDir = path.dirname(this.dataPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    if (!fs.existsSync(this.dataPath)) {
      const initialData: Database = {
        users: [],
        books: [
          {
            id: '1',
            title: 'To Kill a Mockingbird',
            author: 'Harper Lee',
            isbn: '978-0-06-112008-4',
            status: 'available',
            addedAt: new Date().toISOString()
          },
          {
            id: '2',
            title: '1984',
            author: 'George Orwell',
            isbn: '978-0-452-28423-4',
            status: 'available',
            addedAt: new Date().toISOString()
          },
          {
            id: '3',
            title: 'The Great Gatsby',
            author: 'F. Scott Fitzgerald',
            isbn: '978-0-7432-7356-5',
            status: 'available',
            addedAt: new Date().toISOString()
          }
        ]
      };
      this.writeData(initialData);
    }
  }
  
  static readData(): Database {
    try {
      const data = fs.readFileSync(this.dataPath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading data:', error);
      return { users: [], books: [] };
    }
  }
  
  static writeData(data: Database): void {
    try {
      fs.writeFileSync(this.dataPath, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Error writing data:', error);
    }
  }
  
  // User operations
  static getUsers(): User[] {
    return this.readData().users;
  }
  
  static getUserById(id: string): User | undefined {
    return this.getUsers().find(user => user.id === id);
  }
  
  static getUserByUsername(username: string): User | undefined {
    return this.getUsers().find(user => user.username === username);
  }
  
  static addUser(user: User): void {
    const data = this.readData();
    data.users.push(user);
    this.writeData(data);
  }
  
  // Book operations
  static getBooks(): Book[] {
    return this.readData().books;
  }
  
  static getBookById(id: string): Book | undefined {
    return this.getBooks().find(book => book.id === id);
  }
  
  static addBook(book: Book): void {
    const data = this.readData();
    data.books.push(book);
    this.writeData(data);
  }
  
  static updateBook(id: string, updates: Partial<Book>): boolean {
    const data = this.readData();
    const index = data.books.findIndex(book => book.id === id);
    
    if (index === -1) return false;
    
    data.books[index] = { ...data.books[index], ...updates };
    this.writeData(data);
    return true;
  }
  
  static deleteBook(id: string): boolean {
    const data = this.readData();
    const initialLength = data.books.length;
    data.books = data.books.filter(book => book.id !== id);
    
    if (data.books.length === initialLength) return false;
    
    this.writeData(data);
    return true;
  }
}
