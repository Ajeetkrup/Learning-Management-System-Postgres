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

        if(userid && mode_of_payment && amount){
            pool.query('INSERT INTO payments (userid, mode_of_payment, amount) VALUES ($1, $2, $3)', [userid, mode_of_payment, amount], 
            (err, results) => {
                if (err){
                throw err;
                }
                return res.status(201).send(`Payment added with ID: ${results.insertId}`);
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
        console.log(req.params);
        console.log(req.body);
        const { userid, mode_of_payment, amount } = req.body;
        if(!userid && !mode_of_payment && !amount){
            return res.send('Plz provide any input.');
        }

        let query ='Update payments set ';
        const paymentObj = req.body;
        // console.log(arr);
        let i=1;
        for(let key in paymentObj){
            // console.log(`${key}:${arr[key]}`);
            if(i == 1){
                query += key + "='" + paymentObj[key] + "'";
            }
            else{
                query += ',' + key + "='" + paymentObj[key] + "'";
            }
            i++;
        }
        query += " where paymentid='"+ id + "';";
        console.log(query);

        let payment;
        try{
            payment = await pool.query(query);
            return res.status(200).send(`User modified with userid: ${id}`);
        }
        catch(err){
            return res.status(500).send('Internal server error.')
        }

        // if(userid || mode_of_payment || amount){
        //     if(userid){
        //         pool.query('UPDATE payments SET userid = $1, updated_at = $2 WHERE paymentid = $3', [userid, date, id],
        //         (err, results) => {
        //             if (err) {
        //                 throw err;
        //             }
        //             // return res.status(200).send(`Payment modified with ID: ${id}`);
        //         }
        //         );
        //     }
        //     if(mode_of_payment){
        //         pool.query('UPDATE payments SET mode_of_payment = $1, updated_at = $2 WHERE paymentid = $3', [mode_of_payment, date, id],
        //         (err, results) => {
        //             if (err) {
        //                 throw err;
        //             }
        //             // return res.status(200).send(`Payment modified with ID: ${id}`);
        //         }
        //         );
        //     }
        //     if(amount){
        //         pool.query('UPDATE payments SET amount = $1, updated_at = $2 WHERE paymentid = $3', [amount, date, id],
        //         (err, results) => {
        //             if (err) {
        //                 throw err;
        //             }
        //             // return res.status(200).send(`Payment modified with ID: ${id}`);
        //         }
        //         );
        //     }

        //     return res.status(200).send(`Payment modified with ID: ${id}`);
        // }
        // else{
        //     return res.status(404).send('Plz provide any input.');
        // }
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