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

        pool.query('INSERT INTO records (bookid, userid, date_return, copies, transaction_id) VALUES ($1, $2, $3, $4, $5)', [bookid, userid, date_return, copies, transaction_id], 
            (err, results) => {
                if (err){
                throw err;
                }
                return res.status(201).send(`Record added with recordid: ${results.insertId}`);
        });
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

        pool.query('UPDATE records SET bookid = $1, userid = $2, date_return = $3, copies = $4, transaction_id = $5, updated_at = $6 WHERE recordid = $7', [bookid, userid, date_return, copies, transaction_id, date, id],
            (err, results) => {
                if (err) {
                    throw err;
                }
                return res.status(200).send(`Record modified with recordid: ${id}`);
            }
        );
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