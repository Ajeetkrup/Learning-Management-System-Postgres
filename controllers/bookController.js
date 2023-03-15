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
    if(req.user.role == 'librarian'){
        console.log(req.body);
        const { name, isbn, pages, price, author, copies, available, charges } = req.body;

        if(name && isbn && pages && price && author && copies && available && charges){
            pool.query('INSERT INTO books (name, isbn, pages, price, author, copies, available, charges ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', [ name, isbn, pages, price, author, copies, available, charges], 
            (err, results) => {
                if (err){
                throw err;
                }

                console.log(results.rows);
                return res.status(201).send(`Book added with bookid: ${results.insertId}`);
            });
        }
        else{
            return res.status(404).send('Plz provide all inputs.');
        }
    }
    else{
        res.status(401).send('Unauthorized User')
    }
}

module.exports.update = function(req, res){
    if(req.user.role == 'librarian'){
        let yourDate = new Date()
        let date = yourDate.toISOString().split('T')[0];
        console.log(date);

        const id = parseInt(req.params.id);
        console.log(req.body);
        const { name, isbn, pages, price, author, copies, available, charges } = req.body;

        if(name || isbn || pages || price || author || copies || available || charges){
            if(name){
                pool.query('UPDATE books SET name=$1, updated_at = $2 WHERE bookid = $3', [ name, date, id ],
                (err, results) => {
                    if (err) {
                        throw err;
                    }
                    // return res.status(200).send(`Book modified with bookID: ${id}`);
                }
                );
            }
            if(isbn){
                pool.query('UPDATE books SET isbn=$1, updated_at = $2 WHERE bookid = $3', [ isbn, date, id ],
                (err, results) => {
                    if (err) {
                        throw err;
                    }
                    // return res.status(200).send(`Book modified with bookID: ${id}`);
                }
                );
            }
            if(pages){
                pool.query('UPDATE books SET pages=$1, updated_at = $2 WHERE bookid = $3', [ pages, date, id ],
                (err, results) => {
                    if (err) {
                        throw err;
                    }
                    // return res.status(200).send(`Book modified with bookID: ${id}`);
                }
                );
            }
            if(price){
                pool.query('UPDATE books SET price=$1, updated_at = $2 WHERE bookid = $3', [ price, date, id ],
                (err, results) => {
                    if (err) {
                        throw err;
                    }
                    // return res.status(200).send(`Book modified with bookID: ${id}`);
                }
                );
            }
            if(author){
                pool.query('UPDATE books SET author=$1, updated_at = $2 WHERE bookid = $3', [ author, date, id ],
                (err, results) => {
                    if (err) {
                        throw err;
                    }
                    // return res.status(200).send(`Book modified with bookID: ${id}`);
                }
                );
            }
            if(copies){
                pool.query('UPDATE books SET copies=$1, updated_at = $2 WHERE bookid = $3', [ copies, date, id ],
                (err, results) => {
                    if (err) {
                        throw err;
                    }
                    // return res.status(200).send(`Book modified with bookID: ${id}`);
                }
                );
            }
            if(available){
                pool.query('UPDATE books SET available=$1, updated_at = $2 WHERE bookid = $3', [ available, date, id ],
                (err, results) => {
                    if (err) {
                        throw err;
                    }
                    // return res.status(200).send(`Book modified with bookID: ${id}`);
                }
                );
            }
            if(charges){
                pool.query('UPDATE books SET charges=$1, updated_at = $2 WHERE bookid = $3', [ charges, date, id ],
                (err, results) => {
                    if (err) {
                        throw err;
                    }
                    // return res.status(200).send(`Book modified with bookID: ${id}`);
                }
                );
            }

            return res.status(200).send(`Book modified with bookID: ${id}`);
        }
        else{
            return res.status(404).send('Plz provide any inputs.');
        }
    }
    else{
        res.status(401).send('Unauthorized User');
    }
}

module.exports.delete = function(req, res){
    if(req.user.role == 'librarian'){
        const id = parseInt(req.params.id);

        pool.query('DELETE FROM books WHERE bookid = $1', [id], 
            (err, results) => {
                if (err) {
                    throw err;
                }
                return res.status(200).send(`Book deleted with bookid: ${id}`);
        });
    }
    else{
        res.status(401).send('Unauthorized User');
    }
}