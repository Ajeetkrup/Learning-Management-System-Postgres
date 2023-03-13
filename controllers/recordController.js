const pool = require('../config/postgres');

module.exports.getRecords = function(req, res){
    pool.query('SELECT * FROM records ORDER BY recordid ASC', 
        (err, results) => {
            if (err) {
            throw err;
            }
            return res.status(200).json(results.rows);
    });
}

module.exports.getRecordById = function(req, res){
    const id = parseInt(req.params.id);

    pool.query('SELECT * FROM records WHERE recordid = $1', [id], 
        (err, results) => {
            if (err) {
            throw err;
            }
            return res.status(200).json(results.rows);
    });
}

module.exports.create = function(req, res){
    const { bookid, userid, date_return, copies, transaction_id } = req.body;

    pool.query('INSERT INTO records (bookid, userid, date_return, copies, transaction_id) VALUES ($1, $2, $3, $4, $5)', [bookid, userid, date_return, copies, transaction_id], 
        (err, results) => {
            if (err){
            throw err;
            }
            return res.status(201).send(`Record added with recordid: ${results.insertId}`);
    });
}

module.exports.update = function(req, res){
    const id = parseInt(req.params.id);
    const { bookid, userid, date_return, copies, transaction_id } = req.body;

    pool.query('UPDATE records SET bookid = $1, userid = $2, date_return = $3, copies = $4, transaction_id = $5 WHERE recordid = $6', [bookid, userid, date_return, copies, transaction_id, id],
        (err, results) => {
            if (err) {
                throw err;
            }
            return res.status(200).send(`Record modified with recordid: ${id}`);
        }
    )
}

module.exports.delete = function(req, res){
    const id = parseInt(req.params.id);

    pool.query('DELETE FROM records WHERE recordid = $1', [id], 
        (err, results) => {
            if (err) {
                throw err;
            }
            return res.status(200).send(`Record deleted with recordid: ${id}`);
    });
}