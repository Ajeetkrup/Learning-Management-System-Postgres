const pool = require('../config/postgres');

module.exports.getUsers = function(req, res){
    pool.query('SELECT * FROM users ORDER BY userid ASC', 
        (err, results) => {
            if (err) {
            throw err;
            }
            return res.status(200).json(results.rows);
    });
}

module.exports.getUserById = function(req, res){
    console.log(req.params);
    const id = parseInt(req.params.id);

    pool.query('SELECT * FROM users WHERE userid = $1', [id], 
        (err, results) => {
            if (err) {
            throw err;
            }
            return res.status(200).json(results.rows);
    });
}

module.exports.create = function(req, res){
    const { name, email, password, role } = req.body;
    console.log(req.body);
    pool.query('INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)', [name, email, password, role], 
        (err, results) => {
            if (err){
                throw err;
            }
            return res.status(201).send(`User added with userid: ${results.insertId}`);
    });
}

module.exports.update = function(req, res){
    const id = parseInt(req.params.id);
    const { name, email, password } = req.body;

    pool.query('UPDATE users SET name = $1, email = $2, password = $3 WHERE userid = $4', [name, email, password, id],
        (err, results) => {
            if (err) {
                throw err;
            }
            return res.status(200).send(`User modified with userid: ${id}`);
        }
    )
}

module.exports.delete = function(req, res){
    const id = parseInt(req.params.id);

    pool.query('DELETE FROM users WHERE userid = $1', [id], 
        (err, results) => {
            if (err) {
                throw err;
            }
            return res.status(200).send(`User deleted with userid: ${id}`);
    });
}