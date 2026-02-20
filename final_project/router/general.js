const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Register
public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
        if (!isValid(username)) {
            users.push({ username, password });
            return res.status(200).json({ message: "User successfully registered. Now you can login" });
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
    if (books[isbn]) return res.status(200).json(books[isbn]);
    return res.status(404).json({ message: "Book not found" });
});

// Task 3: Get by Author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const result = {};
    for (let key in books) {
        if (books[key].author.toLowerCase() === author.toLowerCase()) result[key] = books[key];
    }
    if (Object.keys(result).length > 0) return res.status(200).json(result);
    return res.status(404).json({ message: "Books not found" });
});

// Task 4: Get by Title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const result = {};
    for (let key in books) {
        if (books[key].title.toLowerCase() === title.toLowerCase()) result[key] = books[key];
    }
    if (Object.keys(result).length > 0) return res.status(200).json(result);
    return res.status(404).json({ message: "Books not found" });
});

// Task 5: Get review by ISBN
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) return res.status(200).json(books[isbn].reviews);
    return res.status(404).json({ message: "Book not found" });
});

// Task 10: Get all books using async/await with Axios
public_users.get('/async/books', async function (req, res) {
    try {
        const response = await axios.get('http://localhost:5000/');
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Task 11: Get by ISBN using Promise with Axios
public_users.get('/async/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    axios.get(`http://localhost:5000/isbn/${isbn}`)
        .then(response => res.status(200).json(response.data))
        .catch(() => res.status(404).json({ message: "Book not found" }));
});

// Task 12: Get by Author using async/await with Axios
public_users.get('/async/author/:author', async function (req, res) {
    const author = req.params.author;
    try {
        const response = await axios.get(`http://localhost:5000/author/${encodeURIComponent(author)}`);
        res.status(200).json(response.data);
    } catch (error) {
        res.status(404).json({ message: "Books not found" });
    }
});

// Task 13: Get by Title using async/await with Axios
public_users.get('/async/title/:title', async function (req, res) {
    const title = req.params.title;
    try {
        const response = await axios.get(`http://localhost:5000/title/${encodeURIComponent(title)}`);
        res.status(200).json(response.data);
    } catch (error) {
        res.status(404).json({ message: "Books not found" });
    }
});

module.exports.general = public_users;
