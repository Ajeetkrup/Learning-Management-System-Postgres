const pool = require('../config/postgres');

module.exports.userGetBooks = async function(req, res){
    let bookArr, books = [];
    
    try{
        const results = await pool.query('Select * from books;');
        bookArr = results.rows;
    }
    catch(err){
        return res.status(500).send('Internal server error.');
    }

    // console.log(bookArr);
    for(let i=0;i<bookArr.length;i++){
        let bookObj = bookArr[i];
        // console.log(bookObj);
        let recordArr;
        let bookid = bookObj.bookid;

        try{
            const results = await pool.query('Select * from records where bookid = $1;', [bookid]);
            recordArr = results.rows;
        }
        catch(err){
            return res.status(500).send('Internal server error.');
        }
        console.log(bookid, recordArr, recordArr.length);

            if(recordArr){
                let copies = 0;
                for(let j=0;j<recordArr.length;j++){
                    let recordObj = recordArr[j];
                    // console.log(recordObj.date_return);
                    let recordid = recordArr.recordid;

                    let d1 = new Date();
                    d1 = d1.toISOString().split('T')[0];
                    d1 = new Date(d1).getTime();

                    let d2 = new Date(recordObj.date_return).getTime();

                    // console.log(d1, d2);
                    if(d1 < d2){
                        copies += recordObj.copies;
                    }
                }
                // console.log('Before', copies);
                copies = bookObj.copies - copies;
                // console.log('After',copies)
                if(copies <= 0){
                    // bookObj.available = false;
                    // bookObj.copies = 0;
                    continue;
                }
                else{
                    bookObj.copies = copies;
                    books.push(bookObj);
                }
            }else{
                books.push(bookObj);
            }
        }
    return res.status(200).json(books);
}

module.exports.getBooks = function(req, res){
    if(req.user.role == 'librarian'){
        pool.query('SELECT * FROM books ORDER BY bookid ASC', 
        (err, results) => {
            if (err) {
            throw err;
            }
            return res.status(200).json(results.rows);
        });
    }
    else{
        return res.status(401).send('Unauthorized user.');
    }
}

module.exports.getBookById = function(req, res){
    if(req.user.role == 'librarian'){
        const id = parseInt(req.params.id);

        pool.query('SELECT * FROM books WHERE bookid = $1', [id], 
            (err, results) => {
                if (err) {
                throw err;
                }
                return res.status(200).json(results.rows);
        });
    }
    else{
        return res.status(401).send('Unauthorized user.');
    }
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

module.exports.update = async function(req, res){
    if(req.user.role == 'librarian'){
        let yourDate = new Date()
        let date = yourDate.toISOString().split('T')[0];
        console.log(date);

        const id = parseInt(req.params.id);
        console.log(req.body);
        const { name, isbn, pages, price, author, copies, available, charges } = req.body;
        if(!name && !isbn && !pages && !price && !author && !copies && !available && !charges){
            return res.send('Plz provide any valid input.');
        }

        let query ='Update books set ';
        const bookObj = req.body;
        // console.log(arr);
        let i=1;
        for(let key in bookObj){
            // console.log(`${key}:${arr[key]}`);
            if(i == 1){
                query += key + "='" + bookObj[key] + "'";
            }
            else{
                query += ',' + key + "='" + bookObj[key] + "'";
            }
            i++;
        }
        query += " where bookid='"+ id + "';";
        console.log(query);

        let book;
        try{
            book = await pool.query(query);
            return res.status(200).send(`Book modified with bookid: ${id}`);
        }
        catch(err){
            return res.status(500).send('Internal server error.')
        }

        // if(name || isbn || pages || price || author || copies || available || charges){
        //     if(name){
        //         pool.query('UPDATE books SET name=$1, updated_at = $2 WHERE bookid = $3', [ name, date, id ],
        //         (err, results) => {
        //             if (err) {
        //                 throw err;
        //             }
        //             // return res.status(200).send(`Book modified with bookID: ${id}`);
        //         }
        //         );
        //     }
        //     if(isbn){
        //         pool.query('UPDATE books SET isbn=$1, updated_at = $2 WHERE bookid = $3', [ isbn, date, id ],
        //         (err, results) => {
        //             if (err) {
        //                 throw err;
        //             }
        //             // return res.status(200).send(`Book modified with bookID: ${id}`);
        //         }
        //         );
        //     }
        //     if(pages){
        //         pool.query('UPDATE books SET pages=$1, updated_at = $2 WHERE bookid = $3', [ pages, date, id ],
        //         (err, results) => {
        //             if (err) {
        //                 throw err;
        //             }
        //             // return res.status(200).send(`Book modified with bookID: ${id}`);
        //         }
        //         );
        //     }
        //     if(price){
        //         pool.query('UPDATE books SET price=$1, updated_at = $2 WHERE bookid = $3', [ price, date, id ],
        //         (err, results) => {
        //             if (err) {
        //                 throw err;
        //             }
        //             // return res.status(200).send(`Book modified with bookID: ${id}`);
        //         }
        //         );
        //     }
        //     if(author){
        //         pool.query('UPDATE books SET author=$1, updated_at = $2 WHERE bookid = $3', [ author, date, id ],
        //         (err, results) => {
        //             if (err) {
        //                 throw err;
        //             }
        //             // return res.status(200).send(`Book modified with bookID: ${id}`);
        //         }
        //         );
        //     }
        //     if(copies){
        //         pool.query('UPDATE books SET copies=$1, updated_at = $2 WHERE bookid = $3', [ copies, date, id ],
        //         (err, results) => {
        //             if (err) {
        //                 throw err;
        //             }
        //             // return res.status(200).send(`Book modified with bookID: ${id}`);
        //         }
        //         );
        //     }
        //     if(available){
        //         pool.query('UPDATE books SET available=$1, updated_at = $2 WHERE bookid = $3', [ available, date, id ],
        //         (err, results) => {
        //             if (err) {
        //                 throw err;
        //             }
        //             // return res.status(200).send(`Book modified with bookID: ${id}`);
        //         }
        //         );
        //     }
        //     if(charges){
        //         pool.query('UPDATE books SET charges=$1, updated_at = $2 WHERE bookid = $3', [ charges, date, id ],
        //         (err, results) => {
        //             if (err) {
        //                 throw err;
        //             }
        //             // return res.status(200).send(`Book modified with bookID: ${id}`);
        //         }
        //         );
        //     }

        //     return res.status(200).send(`Book modified with bookID: ${id}`);
        // }
        // else{
        //     return res.status(404).send('Plz provide any inputs.');
        // }
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