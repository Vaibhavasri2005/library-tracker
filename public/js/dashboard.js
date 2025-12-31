// API Base URL - dynamically detect based on current location
const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000/api'
    : `${window.location.origin}/api`;

// Get current user from localStorage
let currentUser = JSON.parse(localStorage.getItem('currentUser'));

// Check if user is logged in
if (!currentUser) {
    window.location.href = 'index.html';
}

// DOM Elements
const currentUsername = document.getElementById('currentUsername');
const logoutBtn = document.getElementById('logoutBtn');
const addBookBtn = document.getElementById('addBookBtn');
const addBookModal = document.getElementById('addBookModal');
const addBookForm = document.getElementById('addBookForm');
const cancelAddBook = document.getElementById('cancelAddBook');
const closeModal = document.querySelector('.close');
const booksTableBody = document.getElementById('booksTableBody');
const messageBox = document.getElementById('messageBox');
const totalBooksEl = document.getElementById('totalBooks');
const availableBooksEl = document.getElementById('availableBooks');
const borrowedBooksEl = document.getElementById('borrowedBooks');

// Set username
currentUsername.textContent = currentUser.username;

// Logout
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
});

// Modal controls
addBookBtn.addEventListener('click', () => {
    addBookModal.style.display = 'block';
});

cancelAddBook.addEventListener('click', () => {
    addBookModal.style.display = 'none';
    addBookForm.reset();
});

closeModal.addEventListener('click', () => {
    addBookModal.style.display = 'none';
    addBookForm.reset();
});

window.addEventListener('click', (e) => {
    if (e.target === addBookModal) {
        addBookModal.style.display = 'none';
        addBookForm.reset();
    }
});

// Add Book
addBookForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const title = document.getElementById('bookTitle').value.trim();
    const author = document.getElementById('bookAuthor').value.trim();
    const isbn = document.getElementById('bookISBN').value.trim();
    
    if (!title || !author) {
        showMessage('Please fill in required fields', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/books`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, author, isbn })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showMessage('Book added successfully!', 'success');
            addBookModal.style.display = 'none';
            addBookForm.reset();
            loadBooks(); // Reload books
        } else {
            showMessage(data.message || 'Failed to add book', 'error');
        }
    } catch (error) {
        console.error('Add book error:', error);
        showMessage('An error occurred. Please try again.', 'error');
    }
});

// Load all books
async function loadBooks() {
    try {
        const response = await fetch(`${API_URL}/books`);
        const data = await response.json();
        
        if (data.success) {
            displayBooks(data.books);
            updateStats(data.books);
        } else {
            showMessage('Failed to load books', 'error');
        }
    } catch (error) {
        console.error('Load books error:', error);
        showMessage('An error occurred while loading books', 'error');
    }
}

// Display books in table
function displayBooks(books) {
    booksTableBody.innerHTML = '';
    
    if (books.length === 0) {
        booksTableBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 40px; color: #7f8c8d;">
                    <i class="fas fa-book" style="font-size: 3rem; margin-bottom: 10px; display: block;"></i>
                    No books available. Add your first book!
                </td>
            </tr>
        `;
        return;
    }
    
    books.forEach(book => {
        const row = document.createElement('tr');
        
        const statusBadge = book.status === 'available' 
            ? '<span class="status-badge available">Available</span>'
            : '<span class="status-badge borrowed">Borrowed</span>';
        
        const borrowerInfo = book.status === 'borrowed' 
            ? `<td>${book.borrowerName || 'N/A'}</td><td>${book.borrowedBy || 'N/A'}</td>`
            : '<td>-</td><td>-</td>';
        
        let actionButtons = '';
        
        if (book.status === 'available') {
            actionButtons = `
                <button class="btn btn-success" onclick="borrowBook('${book.id}')">
                    <i class="fas fa-hand-holding"></i> Borrow
                </button>
            `;
        } else if (book.borrowedBy === currentUser.id) {
            actionButtons = `
                <button class="btn btn-warning" onclick="returnBook('${book.id}')">
                    <i class="fas fa-undo"></i> Return
                </button>
            `;
        }
        
        actionButtons += `
            <button class="btn btn-danger" onclick="deleteBook('${book.id}', '${book.title}')">
                <i class="fas fa-trash"></i> Delete
            </button>
        `;
        
        row.innerHTML = `
            <td><strong>${book.title}</strong></td>
            <td>${book.author}</td>
            <td>${book.isbn || 'N/A'}</td>
            <td>${statusBadge}</td>
            ${borrowerInfo}
            <td>
                <div class="action-buttons">
                    ${actionButtons}
                </div>
            </td>
        `;
        
        booksTableBody.appendChild(row);
    });
}

// Update statistics
function updateStats(books) {
    const total = books.length;
    const available = books.filter(b => b.status === 'available').length;
    const borrowed = books.filter(b => b.status === 'borrowed').length;
    
    totalBooksEl.textContent = total;
    availableBooksEl.textContent = available;
    borrowedBooksEl.textContent = borrowed;
}

// Borrow book
async function borrowBook(bookId) {
    try {
        const response = await fetch(`${API_URL}/books/${bookId}/borrow`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId: currentUser.id })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showMessage('Book borrowed successfully!', 'success');
            loadBooks();
        } else {
            showMessage(data.message || 'Failed to borrow book', 'error');
        }
    } catch (error) {
        console.error('Borrow book error:', error);
        showMessage('An error occurred. Please try again.', 'error');
    }
}

// Return book
async function returnBook(bookId) {
    try {
        const response = await fetch(`${API_URL}/books/${bookId}/return`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            showMessage('Book returned successfully!', 'success');
            loadBooks();
        } else {
            showMessage(data.message || 'Failed to return book', 'error');
        }
    } catch (error) {
        console.error('Return book error:', error);
        showMessage('An error occurred. Please try again.', 'error');
    }
}

// Delete book
async function deleteBook(bookId, bookTitle) {
    if (!confirm(`Are you sure you want to delete "${bookTitle}"?`)) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/books/${bookId}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (data.success) {
            showMessage('Book deleted successfully!', 'success');
            loadBooks();
        } else {
            showMessage(data.message || 'Failed to delete book', 'error');
        }
    } catch (error) {
        console.error('Delete book error:', error);
        showMessage('An error occurred. Please try again.', 'error');
    }
}

// Show message function
function showMessage(message, type) {
    messageBox.textContent = message;
    messageBox.className = `message-box ${type}`;
    messageBox.style.display = 'block';
    
    setTimeout(() => {
        messageBox.style.display = 'none';
    }, 4000);
}

// Initialize - load books on page load
loadBooks();
