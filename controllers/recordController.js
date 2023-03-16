const pool = require('../config/postgres');

module.exports.getRecords = function(req, res){
    if(req.user.role == 'librarian'){
        pool.query('SELECT * FROM records ORDER BY recordid ASC', 
        (err, results) => {
            if (err) {
            throw err;
            }
            return res.status(200).json(results.rows);
        });
    }
    else{
        res.status(401).send('Unauthorized User');
    }
    
}

module.exports.getRecordById = function(req, res){
    if(req.user.role == 'librarian'){
        const id = parseInt(req.params.id);

        pool.query('SELECT * FROM records WHERE recordid = $1', [id], 
            (err, results) => {
                if (err) {
                throw err;
                }
                return res.status(200).json(results.rows);
        });
    }
    else{
        res.status(401).send('Unauthorized User');
    }
    
}

module.exports.create = async function(req, res){
    if(req.user.role == 'librarian'){
        const { bookid, userid, date_return, copies, transaction_id } = req.body;

        let copiesAvl = 0;
        let results;
        try{
            results = await pool.query('Select * from books where bookid = $1;', [bookid]);
        }
        catch(err){
            return res.status(500).send('1 Internal Server Error.');
        }

    // console.log(bookArr);
        let bookObj = results.rows[0];
        // console.log(bookObj);
        let recordArr;
        let bookid1 = bookObj.bookid;

        try{
            const results = await pool.query('Select * from records where bookid = $1;', [bookid1]);
            recordArr = results.rows;
        }
        catch(err){
            return res.status(500).send('2 Internal server error.');
        }
        // console.log(bookid1, recordArr, recordArr.length);

            if(recordArr){
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
                        copiesAvl += recordObj.copies;
                    }
                }
                // console.log('Before', copies);
                copiesAvl = bookObj.copies - copiesAvl;
                // console.log('After',copies)
                
            }
        
            // console.log(copies, copiesAvl);
        if(copies > copiesAvl){
            return res.status(400).send('Book number > available books. PLz provide correct book number.');
        }

        if(bookid && userid && date_return && copies && transaction_id){
            pool.query('INSERT INTO records (bookid, userid, date_return, copies, transaction_id) VALUES ($1, $2, $3, $4, $5)', [bookid, userid, date_return, copies, transaction_id], 
            (err, results) => {
                if (err){
                throw err;
                }
                return res.status(201).send(`Record added with recordid: ${results.insertId}`);
            });
        }
        else{
            return res.status(404).send('Plz provide all inputs.');
        }
    }
    else{
        res.status(401).send('Unauthorized User');
    }
}

module.exports.update = async function(req, res){
    if(req.user.role == 'librarian'){
        let yourDate = new Date()
        let date = yourDate.toISOString().split('T')[0];
        console.log(date);

        const id = parseInt(req.params.id);
        const { bookid, userid, date_return, copies, transaction_id, actual_date_of_return } = req.body;
        if(!bookid && !userid && !date_return && !copies && !transaction_id && !actual_date_of_return){
            return res.send('Plz provide any input.');
        }

        let query ='Update records set ';
        const recordObj = req.body;
        // console.log(arr);
        let i=1;
        for(let key in recordObj){
            // console.log(`${key}:${arr[key]}`);
            if(i == 1){
                query += key + "='" + recordObj[key] + "'";
            }
            else{
                query += ',' + key + "='" + recordObj[key] + "'";
            }
            i++;
        }
        query += " where recordid='"+ id + "';";
        console.log(query);

        let record;
        try{
            record = await pool.query(query);
            return res.status(200).send(`Record modified with recordid: ${id}`);
        }
        catch(err){
            return res.status(500).send('Internal server error.')
        }

        // if(bookid || userid || date_return || copies || transaction_id){
        //     if(bookid){
        //         pool.query('UPDATE records SET bookid = $1, updated_at = $2 WHERE recordid = $3', [bookid, date, id],
        //         (err, results) => {
        //             if (err) {
        //                 throw err;
        //             }
        //             // return res.status(200).send(`Record modified with recordid: ${id}`);
        //         }
        //         );
        //     }
        //     if(userid){
        //         pool.query('UPDATE records SET userid = $1, updated_at = $2 WHERE recordid = $3', [userid, date, id],
        //         (err, results) => {
        //             if (err) {
        //                 throw err;
        //             }
        //             // return res.status(200).send(`Record modified with recordid: ${id}`);
        //         }
        //         );
        //     }
        //     if(date_return){
        //         pool.query('UPDATE records SET date_return = $1, updated_at = $2 WHERE recordid = $3', [date_return, date, id],
        //         (err, results) => {
        //             if (err) {
        //                 throw err;
        //             }
        //             // return res.status(200).send(`Record modified with recordid: ${id}`);
        //         }
        //         );
        //     }
        //     if(copies){
        //         pool.query('UPDATE records SET copies = $1, updated_at = $2 WHERE recordid = $3', [copies, date, id],
        //         (err, results) => {
        //             if (err) {
        //                 throw err;
        //             }
        //             // return res.status(200).send(`Record modified with recordid: ${id}`);
        //         }
        //         );
        //     }
        //     if(transaction_id){
        //         pool.query('UPDATE records SET transaction_id = $1, updated_at = $2 WHERE recordid = $3', [transaction_id, date, id],
        //         (err, results) => {
        //             if (err) {
        //                 throw err;
        //             }
        //             // return res.status(200).send(`Record modified with recordid: ${id}`);
        //         }
        //         );
        //     }

        //     return res.status(200).send(`Record modified with recordid: ${id}`);
        // }
        // else{
        //     return res.status(404).send('Please provide any input.');
        // }
    }
    else{
        res.status(401).send('Unauthorized User');
    }
    
}

module.exports.delete = function(req, res){
    if(req.user.role == 'librarian'){
        const id = parseInt(req.params.id);

        pool.query('DELETE FROM records WHERE recordid = $1', [id], 
            (err, results) => {
                if (err) {
                    throw err;
                }
                return res.status(200).send(`Record deleted with recordid: ${id}`);
        });
    }
    else{
        res.status(401).send('Unauthorized User');
    }
    
}