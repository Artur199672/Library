// -------------------МАСИВИ ДАНИХ------------------------------
let books = [];
let visitors = [];
let cards = [];

// ----------------------------ФУНКЦІЇ ДЛЯ РОБОТИ З КНИГАМИ----------------------------

document.getElementById('bookForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const publisher = document.getElementById('publisher').value;
    const count = parseInt(document.getElementById('count').value);

    if (count < 0) {
        alert('Кількість примірників не може бути від’ємною!');
        return;
    }

    books.push({ title, author, publisher, count, taken: 0 });
    renderBooks();
    event.target.reset();
});

// відобразити список книг
function renderBooks() {
    const tbody = document.querySelector('#bookTable tbody');
    tbody.innerHTML = '';

    books.forEach((book, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.publisher}</td>
            <td>${book.count}</td>
            <td><button onclick="deleteBook(${index})">Видалити</button></td>
        `;
        tbody.appendChild(row);
    });

    updateBookSelect();
}

// видалити книгу
function deleteBook(index) {
    books.splice(index, 1);
    renderBooks();
}

// пошук книг
document.getElementById('searchBook').addEventListener('input', (event) => {
    const query = event.target.value.toLowerCase();
    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.publisher.toLowerCase().includes(query)
    );
    renderFilteredBooks(filteredBooks);
});

// відобразити відфільтровані книги
function renderFilteredBooks(filteredBooks) {
    const tbody = document.querySelector('#bookTable tbody');
    tbody.innerHTML = '';

    filteredBooks.forEach((book, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.publisher}</td>
            <td>${book.count}</td>
            <td><button onclick="deleteBook(${index})">Видалити</button></td>
        `;
        tbody.appendChild(row);
    });
}

// -----------------ФУНКЦІЇ ДЛЯ РОБОТИ З ВІДВІДУВАЧАМИ---------------------

// додати нового відвідувача
document.getElementById('visitorForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const name = document.getElementById('visitorName').value;
    const phone = document.getElementById('visitorPhone').value;

    visitors.push({ id: visitors.length + 1, name, phone, booksTaken: 0 });
    renderVisitors();
    event.target.reset();
});

// показати список відвідувачів
function renderVisitors() {
    const tbody = document.querySelector('#visitorTable tbody');
    tbody.innerHTML = '';

    visitors.forEach((visitor, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${visitor.id}</td>
            <td>${visitor.name}</td>
            <td>${visitor.phone}</td>
            <td><button onclick="deleteVisitor(${index})">Видалити</button></td>
        `;
        tbody.appendChild(row);
    });

    updateVisitorSelect();
}

// видалити відвідувача
function deleteVisitor(index) {
    visitors.splice(index, 1);
    renderVisitors();
}

// ------------------------------------ФУНКЦІЇ ДЛЯ КАРТОК----------------------------------

// оновити списки книг і відвідувачів
function updateBookSelect() {
    const bookSelect = document.getElementById('bookSelect');
    bookSelect.innerHTML = '';

    books.forEach((book, index) => {
        if (book.count > 0) {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = book.title;
            bookSelect.appendChild(option);
        }
    });
}

function updateVisitorSelect() {
    const visitorSelect = document.getElementById('visitorSelect');
    visitorSelect.innerHTML = '';

    visitors.forEach(visitor => {
        const option = document.createElement('option');
        option.value = visitor.id;
        option.textContent = visitor.name;
        visitorSelect.appendChild(option);
    });
}

// видати книгу
document.getElementById('cardForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const visitorId = parseInt(document.getElementById('visitorSelect').value);
    const bookIndex = parseInt(document.getElementById('bookSelect').value);
    const issueDate = document.getElementById('issueDate').value;

    const book = books[bookIndex];
    if (book.count > 0) {
        book.count--;
        books[bookIndex].taken++;
        cards.push({ book: book.title, visitorId, issueDate, returnDate: null });
        renderBooks();
        renderCards();
    }
});

// повернути книгу
function returnBook(index) {
    const card = cards[index];
    const bookIndex = books.findIndex(book => book.title === card.book);

    books[bookIndex].count++;
    cards[index].returnDate = new Date().toISOString().split('T')[0];
    renderBooks();
    renderCards();
}

// показати картки
function renderCards() {
    const tbody = document.querySelector('#cardTable tbody');
    tbody.innerHTML = '';

    cards.forEach((card, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${card.book}</td>
            <td>${visitors.find(v => v.id === card.visitorId).name}</td>
            <td>${card.issueDate}</td>
            <td>${card.returnDate || ''}</td>
            <td><button onclick="returnBook(${index})">Повернути</button></td>
        `;
        tbody.appendChild(row);
    });
}
