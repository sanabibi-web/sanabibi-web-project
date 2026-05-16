// ========================
// DARK MODE
// ========================
const theme = localStorage.getItem("theme");
if (theme === "dark") {
    document.body.classList.add("dark");
    const btn = document.getElementById("darkModeBtn");
    if (btn) btn.innerHTML = "☀️ Light Mode";
}

// ========================
// ELEMENTS & DATA
// ========================
const bookList = document.getElementById("bookList");
let books = JSON.parse(localStorage.getItem("books")) || [];

// ========================
// ADD BOOK
// ========================
function addBook() {
    const name = document.getElementById("bookName").value.trim();
    const author = document.getElementById("author").value.trim();
    const id = document.getElementById("bookId").value.trim();
    const category = document.getElementById("category").value;

    if (!name || !author || !id) {
        alert("Please fill all fields");
        return;
    }

    if (books.some(b => b.id === id)) {
        alert("Book ID already exists");
        return;
    }

    books.push({
        name,
        author,
        id,
        category,
        status: "Available",
        issuedTo: "",
        issuedDate: "",
        fine: 0
    });

    saveAndDisplay();
    clearInputs();
}

// ========================
// DISPLAY BOOKS
// ========================
function displayBooks(filter = "All") {
    bookList.innerHTML = "";
    let issuedCount = 0;

    books.forEach((b, i) => {
        if (b.status === "Issued") issuedCount++;

        if (filter !== "All" && b.status !== filter) return;

        bookList.innerHTML += `
        <tr>
            <td>${i + 1}</td>
            <td>${b.name}</td>
            <td>${b.author}</td>
            <td>${b.id}</td>
            <td>${b.category || "-"}</td>
            <td class="${b.status === "Available" ? "available" : "issued"}">${b.status}</td>
            <td>${b.issuedTo || "-"}</td>
            <td>${b.issuedDate || "-"}</td>
            <td>${b.fine || 0}</td>
            <td>
                ${
                    b.status === "Available"
                    ? `<button class="issue" onclick="issueBook(${i})">Issue</button>`
                    : `<button class="return" onclick="returnBook(${i})">Return</button>`
                }
                <button class="delete" onclick="deleteBook(${i})">Delete</button>
            </td>
        </tr>`;
    });

    document.getElementById("totalBooks").innerText = books.length;
    document.getElementById("issuedBooks").innerText = issuedCount;
    document.getElementById("availableBooks").innerText = books.length - issuedCount;
}

// ========================
// SORTING
// ========================
function sortByName() {
    books.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    saveAndDisplay();
}

function sortByCategory() {
    books.sort((a, b) => (a.category || "").localeCompare(b.category || ""));
    saveAndDisplay();
}

// ========================
// FILTER BY STATUS
// ========================
function filterBooks(status) {
    displayBooks(status);
}

// ========================
// DARK MODE TOGGLE
// ========================
function toggleDark() {
    document.body.classList.toggle("dark");
    localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");

    const btn = document.getElementById("darkModeBtn");
    if (btn) btn.innerHTML = document.body.classList.contains("dark") ? "☀️ Light Mode" : "🌙 Dark Mode";
}

// ========================
// ISSUE BOOK
// ========================
function issueBook(index) {
    const person = prompt("Issued To:");
    if (!person) return;

    const today = new Date().toISOString().split("T")[0];

    books[index].status = "Issued";
    books[index].issuedTo = person;
    books[index].issuedDate = today;
    books[index].fine = 0;

    saveAndDisplay();
}
// ========================
// RETURN BOOK
// ========================
function returnBook(index) {
    const issueDate = new Date(books[index].issuedDate);
    const today = new Date();
    const diffDays = Math.floor((today - issueDate) / (1000 * 60 * 60 * 24));

    books[index].fine = diffDays > 7 ? (diffDays - 7) * 10 : 0;
    books[index].status = "Available";
    books[index].issuedTo = "";
    books[index].issuedDate = "";

    saveAndDisplay();
}
// ========================
// DELETE BOOK
// ========================
function deleteBook(index) {
    if (confirm("Delete this book?")) {
        books.splice(index, 1);
        saveAndDisplay();
    }
}
// ========================
// SEARCH
// ========================
function searchBook() {
    const value = document.getElementById("search").value.toLowerCase();
    [...bookList.rows].forEach(row => {
        row.style.display = row.innerText.toLowerCase().includes(value) ? "" : "none";
    });
}
// ========================
// EXPORT CSV
// ========================
function exportCSV() {
    if (!books.length) {
        alert("No books to export!");
        return;
    }

    const headers = ["Name","Author","ID","Category","Status","Issued To","Issue Date","Fine"];
    const rows = books.map(b => [
        b.name, b.author, b.id, b.category, b.status, b.issuedTo || "-", b.issuedDate || "-", b.fine || 0
    ]);

    let csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n";
    rows.forEach(r => csvContent += r.join(",") + "\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "library_books.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
// ========================
// SAVE & DISPLAY
// ========================
function saveAndDisplay() {
    localStorage.setItem("books", JSON.stringify(books));
    displayBooks();
}
// ========================
// CLEAR INPUTS
// ========================
function clearInputs() {
    document.getElementById("bookName").value = "";
    document.getElementById("author").value = "";
    document.getElementById("bookId").value = "";
    document.getElementById("category").value = "Programming";
}
// ========================
// INITIAL DISPLAY
// ========================
displayBooks();
