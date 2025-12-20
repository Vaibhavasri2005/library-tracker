# Library Tracker - Full-Stack Web Application

A modern, full-stack library management system built with Node.js, Express, TypeScript, and vanilla JavaScript.

## 🚀 Features

- **User Authentication**: Register and login with username, user ID, and phone number
- **Book Management**: Add, view, borrow, return, and delete books
- **Real-time Statistics**: Track total books, available books, and borrowed books
- **Modern UI**: Clean, responsive design with library-themed aesthetics
- **RESTful API**: Well-structured backend APIs for all operations
- **JSON Storage**: Lightweight data persistence using JSON files

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## 🛠️ Installation

1. Install dependencies:
```bash
npm install
```

2. Build the TypeScript code:
```bash
npm run build
```

3. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## 🌐 Usage

1. Open your browser and navigate to: `http://localhost:3000`

2. **Register a new account:**
   - Enter username, user ID, and phone number
   - Click "Register"

3. **Login:**
   - Enter your user ID and phone number
   - Click "Login"

4. **Manage Books:**
   - View all books in the dashboard
   - Add new books using the "Add New Book" button
   - Borrow available books
   - Return borrowed books
   - Delete books from the library

## 📁 Project Structure

```
Backend project/
├── src/
│   ├── routes/
│   │   ├── auth.ts          # Authentication routes
│   │   └── books.ts         # Book management routes
│   ├── types/
│   │   └── index.ts         # TypeScript type definitions
│   ├── utils/
│   │   └── dataStore.ts     # JSON data storage utilities
│   └── server.ts            # Main server file
├── public/
│   ├── css/
│   │   └── styles.css       # Application styles
│   ├── js/
│   │   ├── auth.js          # Authentication logic
│   │   └── dashboard.js     # Dashboard functionality
│   ├── index.html           # Login/Register page
│   └── dashboard.html       # Main dashboard
├── data/
│   └── database.json        # JSON data storage (auto-generated)
├── dist/                    # Compiled JavaScript (auto-generated)
├── package.json
└── tsconfig.json
```

## 🔌 API Endpoints

### Authentication
- `POST /api/register` - Register a new user
- `POST /api/login` - Login with credentials

### Books
- `GET /api/books` - Get all books
- `GET /api/books/:id` - Get book by ID
- `POST /api/books` - Add a new book
- `POST /api/books/:id/borrow` - Borrow a book
- `POST /api/books/:id/return` - Return a book
- `DELETE /api/books/:id` - Delete a book

## 🎨 UI Features

- **Gradient backgrounds** with modern color schemes
- **Responsive design** for mobile and desktop
- **Interactive cards** with hover effects
- **Status badges** for book availability
- **Modal dialogs** for adding books
- **Toast notifications** for user feedback
- **Font Awesome icons** throughout the interface

## 🔧 Technologies Used

### Backend
- Node.js
- Express.js
- TypeScript
- CORS
- Body-parser

### Frontend
- HTML5
- CSS3 (with modern features like Grid, Flexbox, animations)
- Vanilla JavaScript (ES6+)
- Font Awesome icons

### Data Storage
- JSON file-based storage

## 📝 Notes

- The database file (`data/database.json`) is automatically created on first run
- Initial sample books are added automatically
- User data persists between sessions
- The application uses localStorage to maintain user sessions on the frontend

## 🤝 Contributing

Feel free to fork this project and submit pull requests for any improvements.

## 📄 License

ISC

---

**Enjoy managing your library! 📚**
