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

// Task 1/10: Get all books - async with Promise
public_users.get('/', async function (req, res) {
    const getBooks = new Promise((resolve) => { resolve(books); });
    const data = await getBooks;
    return res.status(200).send(JSON.stringify(data, null, 4));
});

// Task 2/11: Get by ISBN - Promise callback
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    new Promise((resolve, reject) => {
        if (books[isbn]) resolve(books[isbn]);
        else reject("Book not found");
    })
    .then(book => res.status(200).json(book))
    .catch(err => res.status(404).json({ message: err }));
});

// Task 3/12: Get by Author - async with Promise
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    const getByAuthor = new Promise((resolve, reject) => {
        const result = {};
        for (let key in books) {
            if (books[key].author.toLowerCase() === author.toLowerCase()) result[key] = books[key];
        }
        if (Object.keys(result).length > 0) resolve(result);
        else reject("Books not found");
    });
    try {
        const data = await getByAuthor;
        res.status(200).json(data);
    } catch (err) {
        res.status(404).json({ message: err });
    }
});

// Task 4/13: Get by Title - async with Promise
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;
    const getByTitle = new Promise((resolve, reject) => {
        const result = {};
        for (let key in books) {
            if (books[key].title.toLowerCase() === title.toLowerCase()) result[key] = books[key];
        }
        if (Object.keys(result).length > 0) resolve(result);
        else reject("Books not found");
    });
    try {
        const data = await getByTitle;
        res.status(200).json(data);
    } catch (err) {
        res.status(404).json({ message: err });
    }
});

// Task 5: Get review by ISBN
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) return res.status(200).json(books[isbn].reviews);
    return res.status(404).json({ message: "Book not found" });
});

// Task 8: Add/update review at /review/:isbn (session auth)
public_users.put('/review/:isbn', (req, res) => {
    if (!req.session.authorization) {
        return res.status(401).json({ message: "User not logged in" });
    }
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session.authorization.username;
    if (books[isbn]) {
        books[isbn].reviews[username] = review;
        return res.status(200).json({
            message: `The review for the book with ISBN ${isbn} has been added/updated`
        });
    }
    return res.status(404).json({ message: "Book not found" });
});

// Task 9: Delete review at /review/:isbn (session auth)
public_users.delete('/review/:isbn', (req, res) => {
    if (!req.session.authorization) {
        return res.status(401).json({ message: "User not logged in" });
    }
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;
    if (books[isbn]) {
        delete books[isbn].reviews[username];
        return res.status(200).json({
            message: `Review for ISBN ${isbn} deleted!`
        });
    }
    return res.status(404).json({ message: "Book not found" });
});

// Task 10: Async get all books with Axios
public_users.get('/async/books', async function (req, res) {
    try {
        const response = await axios.get('http://localhost:5000/');
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Task 11: Get by ISBN with Axios Promise
public_users.get('/async/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    axios.get(`http://localhost:5000/isbn/${isbn}`)
        .then(response => res.status(200).json(response.data))
        .catch(() => res.status(404).json({ message: "Book not found" }));
});

// Task 12: Get by Author with Axios async
public_users.get('/async/author/:author', async function (req, res) {
    const author = req.params.author;
    try {
        const response = await axios.get(`http://localhost:5000/author/${encodeURIComponent(author)}`);
        res.status(200).json(response.data);
    } catch (error) {
        res.status(404).json({ message: "Books not found" });
    }
});

// Task 13: Get by Title with Axios async
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
