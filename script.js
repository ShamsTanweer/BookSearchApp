const searchBox = document.getElementById("search-box");
const searchHistory = document.getElementById("search-history");
const clearButton = document.getElementById("clear-button");
const bookList = document.getElementById("book-list");

function searchBooks() {
  const searchQuery = searchBox.value.trim();
  if (searchQuery.length === 0) {
    return;
  }
  const searchUrl = `https://www.googleapis.com/books/v1/volumes?q=${searchQuery}`;
  fetch(searchUrl)
    .then((response) => response.json())
    .then((data) => {
      displayBooks(data.items);
      saveSearchQuery(searchQuery);
    });
}

function displayBooks(books) {
  bookList.innerHTML = "";
  if (!books || books.length === 0) {
    bookList.innerHTML = "<p>No books found</p>";
    return;
  }
  for (const book of books) {
    const { title, authors, pageCount, publisher, imageLinks } =
      book.volumeInfo;
    const bookElement = document.createElement("div");
    bookElement.classList.add("book");
    bookElement.innerHTML = `
      <img src="${imageLinks ? imageLinks.thumbnail : ""}" alt="${title}">
      <h3>${title}</h3>
      <p>Author: ${authors ? authors.join(", ") : "Unknown"}</p>
      <p>Page Count: ${pageCount}</p>
      <p>Publisher: ${publisher ? publisher : "Unknown"}</p>
    `;
    bookList.appendChild(bookElement);
  }
}

function saveSearchQuery(query) {
  const searches = JSON.parse(localStorage.getItem("searches")) || [];
  if (!searches.includes(query)) {
    searches.push(query);
    localStorage.setItem("searches", JSON.stringify(searches));
    displaySearchHistory();
  }
}

function displaySearchHistory() {
  searchHistory.innerHTML = "";
  const searches = JSON.parse(localStorage.getItem("searches")) || [];
  if (searches.length === 0) {
    return;
  }
  const clearElement = document.createElement("button");
  clearElement.textContent = "Clear Search";
  clearElement.addEventListener("click", () => {
    localStorage.removeItem("searches");
    displaySearchHistory();
  });
  searchHistory.appendChild(clearElement);
  for (const search of searches) {
    const searchElement = document.createElement("li");
    searchElement.textContent = search;
    searchElement.addEventListener("click", () => {
      searchBox.value = search;
      searchBooks();
    });
    searchHistory.appendChild(searchElement);
  }
}

// Load previous search history item
function loadPreviousSearch(index) {
  const searches = JSON.parse(localStorage.getItem("searches")) || [];
  if (index >= 0 && index < searches.length) {
    searchBox.value = searches[index];
    searchBooks();
  }
}

// Add event listener to load previous search history items
searchHistory.addEventListener("click", (event) => {
  const target = event.target;

  if (target.nodeName.toLowerCase() === "li") {
    const index = Array.from(searchHistory.children).indexOf(target);
    loadPreviousSearch(index);
  }
});
function handleHistory() {
  window.location.href = "./history.html";
}

displaySearchHistory();
