// Book class
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

// UI class
class UI {
  static displayBooks() {
    const books = Store.getBooks();
    books.forEach((book) => UI.addBookToList(book));
  }
  static addBookToList(book) {
    const list = document.getElementById('book-list');

    const row = document.createElement('tr');
    row.innerHTML = `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><a class="btn btn-danger delete">x</a></td>
    `;

    list.appendChild(row);
  }

  static clearFields() {
    document.querySelector('#title').value = '';
    document.querySelector('#author').value = '';
    document.querySelector('#isbn').value = '';
  }

  static deleteBook(el) {
    if (el.classList.contains('delete')) {
      el.parentElement.parentElement.remove();
    }
  }

  static showAlert(alert, message) {
    const div = document.createElement('div');

    div.className = `alert mt-1 alert-${alert}`;

    div.appendChild(document.createTextNode(message));

    var container = document.querySelector('.container');
    var form = document.querySelector('#book-form');

    container.insertBefore(div, form);

    //vanishing 3 secs

    setTimeout(() => {
      document.querySelector('.alert').remove();
    }, 3000);
  }
}

// Store Class
class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem('books') === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem('books'));
    }
    return books;
  }
  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));
  }
  static removeBook(isbn) {
    const books = Store.getBooks();
    const newBooks = books.filter((book) => book.isbn !== isbn);
    localStorage.setItem('books', JSON.stringify(newBooks));
  }
}

// Event: Display Books
document.addEventListener('DOMContentLoaded', UI.displayBooks);

// Event AddBook
document.querySelector('#book-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const title = document.querySelector('#title').value;
  const author = document.querySelector('#author').value;
  const isbn = document.querySelector('#isbn').value;

  if (title === '' || author === '' || isbn === '') {
    UI.showAlert('danger', 'fill all fields');
  } else {
    const newBook = new Book(title, author, isbn);
    // add book UI
    UI.addBookToList(newBook);

    // add book Store
    Store.addBook(newBook);

    UI.clearFields();
    UI.showAlert('success', 'Book added');
  }
});

//Event deletebook
document.querySelector('#book-list').addEventListener('click', (e) => {
  // delete book UI
  UI.deleteBook(e.target);

  //delet book store
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
});
