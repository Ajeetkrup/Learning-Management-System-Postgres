const pool = require('../config/postgres');

module.exports.getBooks = function(req, res){
    pool.query('SELECT * FROM books ORDER BY bookid ASC', 
        (err, results) => {
            if (err) {
            throw err;
            }
            return res.status(200).json(results.rows);
    });
}

module.exports.getBookById = function(req, res){
    const id = parseInt(req.params.id);

    pool.query('SELECT * FROM books WHERE bookid = $1', [id], 
        (err, results) => {
            if (err) {
            throw err;
            }
            return res.status(200).json(results.rows);
    });
}

module.exports.create = function(req, res){
    console.log(req.body);
    const { name, isbn, pages, price, author, copies, available, charges } = req.body;

    pool.query('INSERT INTO books (name, isbn, pages, price, author, copies, available, charges ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', [ name, isbn, pages, price, author, copies, available, charges], 
        (err, results) => {
            if (err){
            throw err;
            }
            return res.status(201).send(`Book added with bookid: ${results.insertId}`);
    });
}

module.exports.update = function(req, res){
    const id = parseInt(req.params.id);
    console.log(req.body);
    const { name, isbn, pages, price, author, copies, available, charges } = req.body;

    pool.query('UPDATE books SET name=$1, isbn=$2, pages=$3, price=$4, author=$5, copies=$6, available=$7, charges = $8 WHERE bookid = $9', [ name, isbn, pages, price, author, copies, available, charges, id ],
        (err, results) => {
            if (err) {
                throw err;
            }
            return res.status(200).send(`Book modified with bookID: ${id}`);
        }
    )
}

module.exports.delete = function(req, res){
    const id = parseInt(req.params.id);

    pool.query('DELETE FROM books WHERE bookid = $1', [id], 
        (err, results) => {
            if (err) {
                throw err;
            }
            return res.status(200).send(`Book deleted with bookid: ${id}`);
    });
}