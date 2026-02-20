const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register
public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!isValid(username)) {
            users.push({ username, password });
            return res.status(200).json({
                message: "User successfully registered. Now you can login"
            });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }
    return res.status(404).json({ message: "Unable to register user." });
});

// Task 1: Get all books
public_users.get('/', function (req, res) {
    return res.status(200).json(JSON.stringify(books, null, 4));
});

// Task 2: Get by ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.status(200).json(books[isbn]);
    }
    return res.status(404).json({ message: "Book not found" });
});

// Task 3: Get by Author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const result = {};
    for (let key in books) {
        if (books[key].author.toLowerCase() === author.toLowerCase()) {
            result[key] = books[key];
        }
    }
    if (Object.keys(result).length > 0) {
        return res.status(200).json(result);
    }
    return res.status(404).json({ message: "Books not found" });
});

// Task 4: Get by Title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const result = {};
    for (let key in books) {
        if (books[key].title.toLowerCase() === title.toLowerCase()) {
            result[key] = books[key];
        }
    }
    if (Object.keys(result).length > 0) {
        return res.status(200).json(result);
    }
    return res.status(404).json({ message: "Books not found" });
});

// Task 5: Get review by ISBN
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.status(200).json(books[isbn].reviews);
    }
    return res.status(404).json({ message: "Book not found" });
});

// --- ASYNC / PROMISE VERSIONS (Tasks 10–13) ---

// Task 10: Get all books using async/await
public_users.get('/async/books', async function (req, res) {
    const getAllBooks = () => new Promise((resolve) => resolve(books));
    const allBooks = await getAllBooks();
    return res.status(200).json(allBooks);
});

// Task 11: Get by ISBN using Promise
public_users.get('/async/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    new Promise((resolve, reject) => {
        if (books[isbn]) resolve(books[isbn]);
        else reject("Book not found");
    })
    .then(book => res.status(200).json(book))
    .catch(err => res.status(404).json({ message: err }));
});

// Task 12: Get by Author using Promise
public_users.get('/async/author/:author', function (req, res) {
    const author = req.params.author;
    new Promise((resolve, reject) => {
        const result = {};
        for (let key in books) {
            if (books[key].author.toLowerCase() === author.toLowerCase()) result[key] = books[key];
        }
        if (Object.keys(result).length > 0) resolve(result);
        else reject("Books not found");
    })
    .then(result => res.status(200).json(result))
    .catch(err => res.status(404).json({ message: err }));
});

// Task 13: Get by Title using Promise
public_users.get('/async/title/:title', function (req, res) {
    const title = req.params.title;
    new Promise((resolve, reject) => {
        const result = {};
        for (let key in books) {
            if (books[key].title.toLowerCase() === title.toLowerCase()) result[key] = books[key];
        }
        if (Object.keys(result).length > 0) resolve(result);
        else reject("Books not found");
    })
    .then(result => res.status(200).json(result))
    .catch(err => res.status(404).json({ message: err }));
});

module.exports.general = public_users;
