const pool = require('../config/postgres');

module.exports.getPayments = function(req, res){
    if(req.user.role == 'librarian'){
        pool.query('SELECT * FROM payments ORDER BY paymentid ASC', 
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

module.exports.getPaymentById = function(req, res){
    if(req.user.role == 'librarian'){
        const id = parseInt(req.params.id);

        pool.query('SELECT * FROM payments WHERE paymentid = $1', [id], 
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
        const { userid, mode_of_payment, amount } = req.body;

        pool.query('INSERT INTO payments (userid, mode_of_payment, amount) VALUES ($1, $2, $3)', [userid, mode_of_payment, amount], 
            (err, results) => {
                if (err){
                throw err;
                }
                return res.status(201).send(`Payment added with ID: ${results.insertId}`);
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
        console.log(req.params);
        console.log(req.body);
        const { userid, mode_of_payment, amount } = req.body;

        pool.query('UPDATE payments SET userid = $1, mode_of_payment = $2, amount = $3, updated_at = $4 WHERE paymentid = $5', [userid, mode_of_payment, amount, date, id],
            (err, results) => {
                if (err) {
                    throw err;
                }
                return res.status(200).send(`Payment modified with ID: ${id}`);
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

        pool.query('DELETE FROM payments WHERE paymentid = $1', [id], 
            (err, results) => {
                if (err) {
                    throw err;
                }
                return res.status(200).send(`Payment deleted with ID: ${id}`);
        });
    }
    else{
        res.status(401).send('Unauthorized User');
    }
    
}