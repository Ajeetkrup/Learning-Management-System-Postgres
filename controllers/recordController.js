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

module.exports.create = function(req, res){
    if(req.user.role == 'librarian'){
        const { bookid, userid, date_return, copies, transaction_id } = req.body;

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

module.exports.update = function(req, res){
    if(req.user.role == 'librarian'){
        let yourDate = new Date()
        let date = yourDate.toISOString().split('T')[0];
        console.log(date);

        const id = parseInt(req.params.id);
        const { bookid, userid, date_return, copies, transaction_id } = req.body;

        if(bookid || userid || date_return || copies || transaction_id){
            if(bookid){
                pool.query('UPDATE records SET bookid = $1, updated_at = $2 WHERE recordid = $3', [bookid, date, id],
                (err, results) => {
                    if (err) {
                        throw err;
                    }
                    // return res.status(200).send(`Record modified with recordid: ${id}`);
                }
                );
            }
            if(userid){
                pool.query('UPDATE records SET userid = $1, updated_at = $2 WHERE recordid = $3', [userid, date, id],
                (err, results) => {
                    if (err) {
                        throw err;
                    }
                    // return res.status(200).send(`Record modified with recordid: ${id}`);
                }
                );
            }
            if(date_return){
                pool.query('UPDATE records SET date_return = $1, updated_at = $2 WHERE recordid = $3', [date_return, date, id],
                (err, results) => {
                    if (err) {
                        throw err;
                    }
                    // return res.status(200).send(`Record modified with recordid: ${id}`);
                }
                );
            }
            if(copies){
                pool.query('UPDATE records SET copies = $1, updated_at = $2 WHERE recordid = $3', [copies, date, id],
                (err, results) => {
                    if (err) {
                        throw err;
                    }
                    // return res.status(200).send(`Record modified with recordid: ${id}`);
                }
                );
            }
            if(transaction_id){
                pool.query('UPDATE records SET transaction_id = $1, updated_at = $2 WHERE recordid = $3', [transaction_id, date, id],
                (err, results) => {
                    if (err) {
                        throw err;
                    }
                    // return res.status(200).send(`Record modified with recordid: ${id}`);
                }
                );
            }

            return res.status(200).send(`Record modified with recordid: ${id}`);
        }
        else{
            return res.status(404).send('Please provide any input.');
        }
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