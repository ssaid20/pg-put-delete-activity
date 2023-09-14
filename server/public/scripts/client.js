$(document).ready(function(){
  console.log('jQuery sourced.');
  refreshBooks();
  addClickHandlers();
});

function addClickHandlers() {
  $('#submitBtn').on('click', handleSubmit);
   // click handler for delete button
   $('#bookShelf').on('click', '.deleteButton', handleDelete);
   $('#bookShelf').on('click', '.markReadButton', handleMarkAsRead);
}

function handleSubmit() {
  console.log('Submit button clicked.');
  let book = {};
  book.author = $('#author').val();
  book.title = $('#title').val();
  addBook(book);
}

// adds a book to the database
function addBook(bookToAdd) {
  $.ajax({
    type: 'POST',
    url: '/books',
    data: bookToAdd,
    }).then(function(response) {
      console.log('Response from server.', response);
      refreshBooks();
    }).catch(function(error) {
      console.log('Error in POST', error)
      alert('Unable to add book at this time. Please try again later.');
    });
}

// refreshBooks will get all books from the server and render to page
function refreshBooks() {
  $.ajax({
    type: 'GET',
    url: '/books'
  }).then(function(response) {
    console.log(response);
    renderBooks(response);
  }).catch(function(error){
    console.log('error in GET', error);
  });
}


// Displays an array of books to the DOM
function renderBooks(books) {
  $('#bookShelf').empty();

  for(let i = 0; i < books.length; i += 1) {
    let book = books[i];
    let readStatus = book.isRead ? 'Read' : 'Not Read';

    // For each book, append a new row to our table
    $('#bookShelf').append(`
      <tr>
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${readStatus}</td>
        <td>
          <button class="markReadButton" data-id="${book.id}">Mark as Read</button>
        </td>
        <td>
          <button class="deleteButton" data-id="${book.id}">Delete</button>
        </td>
      </tr>
    `);
  }
}
// Send a DELETE request to the server for the selected book.
function handleDelete() {
  const bookId = $(this).data('id');

  $.ajax({
    type: 'DELETE',
    url: `/books/${bookId}`,
  }).then(function(response) {
    console.log('Response from server.', response);
    refreshBooks();
  }).catch(function(error) {
    console.log('Error in DELETE', error);
  });
}
// Send a PUT request to the server to update the read status of the selected book.
function handleMarkAsRead() {
  const bookId = $(this).data('id');

  $.ajax({
    type: 'PUT',
    url: `/books/${bookId}`,
    data: { isRead: true },
  }).then(function(response) {
    console.log('Response from server.', response);
    refreshBooks();
  }).catch(function(error) {
    console.log('Error in PUT', error);
  });
}
