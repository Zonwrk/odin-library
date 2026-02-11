"use strict";

// Create a library array
const myLibrary = [];

// Create a constructor function that will have parameters for a book in a myLibrary array
function Book(title, author, year, genre) {
  this.title = title;
  this.author = author;
  this.year = year;
  this.genre = genre;
  // This is false, because the book is not read yet by default
  this.read = false;
  // this creates a random unique ID for each book
  this.id = crypto.randomUUID();
}

Book.prototype.haveRead = function() {
  this.read = !this.read;
}

function addBookToLibrary(title, author, year, genre) {
  // take params, create a book then store it in the array
  let newBook = new Book(title, author, year, genre);
  myLibrary.push(newBook);
  RefreshScreen();
}

const main = document.querySelector("main");

// This refreshes the screen inside the main, so all the books get listed freshly every time
function RefreshScreen() {
  main.innerHTML = "";

  // This loop looks at the books in the array and creates a HTML card that will contain info about them
  for (let book of myLibrary) {
    let BookSquare = document.createElement('div');
    // Adds a class to the created div
    BookSquare.classList.add("book-card");
    BookSquare.dataset.indexNumber = book.id;
    BookSquare.innerHTML = `
    <h3>${book.title}</h3>
    <p>By: ${book.author}</p>
    <p>Year: ${book.year}</p>
    <p>Genre: ${book.genre}</p>
    <button>Remove</button>
    <button class="read-button">${book.read ? "Read" : "Not read"}</button>
    `

    // Finally adds all this onto the html page
    main.appendChild(BookSquare);
  }

}

// This checks for the click event anywhere inside the main
main.addEventListener('click', (event) => {
  let target = event.target;
  let bookID;
  let bookToDelete;
  let bookToChangeReadState;
  
  // This asks if the button was clicked (inside of the button contains the text 'Remove')
  if (target.textContent === 'Remove') {
    // Adds id taken from the HTML data attribute, closest to the button that was clicked
    // It looks for the closest parent item that has a '.book.card' class
    // and then takes datased.indexNumber and saves it to bookID
    bookID = target.closest('.book-card').dataset.indexNumber;
    // Using findIndex to find the index in the myLibrary array of the book with the id 
    // that is the same as the bookID taken out of the HTML element
    bookToDelete = myLibrary.findIndex(book => book.id == bookID);
    // Use splice to delete item with that index number in the array.
    myLibrary.splice(bookToDelete, 1);

    RefreshScreen();

    // If there is a class named "read-button" on target of the click
  } else if (target.classList.contains("read-button")) {
    bookID = target.closest('.book-card').dataset.indexNumber;
    // Using .find to find the book
    bookToChangeReadState = myLibrary.find(book => book.id === bookID);

    // This if conditional is used to check if any book was returned, before I change the read state
    if (bookToChangeReadState) {
     bookToChangeReadState.haveRead();
     RefreshScreen();
    }
  };

})



// Adding books manually and refresh the page.
addBookToLibrary("The Edge of Tomorrow", "Hiroshi Sakurazaka", 2004, "Sci-Fi");
addBookToLibrary("Đuka Begović", "Ivan Kozarac", 1906, "Realism");
addBookToLibrary("Prosjaci i sinovi", "Ivan Raos", 1971, "Social Novel");
addBookToLibrary("Pod starim krovovima", "Ksaver Šandor Gjalski", 1886, "Short Story Collection");
RefreshScreen();



// MODAL BOX
// Add HTML elements to JS
const addBookDialog = document.getElementById("book-dialog");
const addBookButton = document.getElementById("add-book-button");
const closeBookDialogButton = document.getElementById("close-book-dialog");
const addBookForm = document.getElementById("add-book-form");

// Open the modal
addBookButton.addEventListener("click", () => {
  addBookDialog.showModal();
});

// Close the modal
closeBookDialogButton.addEventListener("click", () => {
  addBookDialog.close();
});



// ADD DATA FROM THE FORM TO THE LIBRARY ARRAY
addBookForm.addEventListener("submit", (event) => {
  // Prevent the page from refreshing
  event.preventDefault();

  // Create form data from the form
  const bookData = new FormData(addBookForm);

  // Extract the values in the form using the 'name' attribute from HTML, and add it to the addBookToLibrary function
  addBookToLibrary(
    bookData.get('book-title'),
    bookData.get('book-author'),
    Number(bookData.get('book-year')),// Converting string to a number
    bookData.get('book-genre'),
  );

  // Now that the book is added, clear the form and close
  // I have to clear it because by preventing the default behaviour, which is sending info to server and refreshing the screen
  // Now the typed inputs will stay like that in the form.
  addBookForm.reset();
  addBookDialog.close();
});

