const pool = require('../config/postgres');
const bcrypt = require('bcrypt');
const jwt =  require('jsonwebtoken');


const secretKey = 'my-secret-means';

module.exports.register = async function(req, res){
    console.log('Req Body:', req.body);

    // our register logic goes here..
    try{
        //get user input
        const { name, email, password, role } = req.body;

        //Validate user input
        if (!(email && password && name && role)) {
            res.status(400).send("Bad Request");
        }

        // console.log(name, email, password);
        // check if user already exist
        // Validate if user exist in our database
        try{
            const results = await pool.query('Select name from users where email = $1', [email]);
        }
        catch(err){
            res.status(500).send('Internal server error.')
        }
        
        console.log(name.rows);

        if(results.rows[0]){
            return res.status(409).send("User Already Exist. Please Login");
        }

        // let encryptedPassword = await bcrypt.hash(password, 10);

        //create user in database
        let user;
        try{
            await pool.query('Insert into users (name, email, password, role) values ($1, $2, $3, $4);',[name, email, password, role]);
            user = await pool.query('Select * from users where email = $1', [email]);
        }
        catch(err){
            res.status(500).send('Internal server error.')
        }
      
        console.log('User created:', user.rows[0]);
        //create token
        // const token = jwt.sign(
        //     {"userid":user.rows[0].userid, "email": email}, secretKey,
        //     {
        //         expiresIn: '1h'
        //     }
        // );
        // console.log('Token created:', token);
        
        // //save user token
        // const result = await pool.query('Select userid from users where email = $1', [email]);
        // await pool.query('Update users set token = $1 where userid = $2', [token, result.rows[0].userid]);

        //return new user
        try{
            user = await pool.query('Select * from users where email = $1', [email]);
        }
        catch(err){
            res.status(500).send('Internal server error.')
        }
        return res.status(201).json(user.rows[0]);
    }
    catch(err){
        console.log(err);
    }
}

module.exports.login = async function(req, res){
    // our login logic goes here
    try{
        const {email, password} = req.body;
        console.log(req.body);
        // Validate user input
        if (!(email && password)) {
            res.status(400).send("All input is required");
        }

        let user;
        try{
            user  = await pool.query('Select * from users where email = $1', [email]);
            console.log(user.rows);
        }
        catch(err){
            res.status(500).send('Internal server error.')
        }

        // console.log(password, user.rows[0].password);
        let token;
        if(user.rows[0].name && password === user.rows[0].password){
            // Create token
            token = jwt.sign(
            {"userid":user.rows[0].userid, "role": user.rows[0].role},
            secretKey,
            {
            expiresIn: "1h",
            }
            );

            req.body.token = token;
            // console.log('Token:',token);
        }
        else{
            res.status(409).send('User not found! Please Register.');
        }

        // save user token
        // const result = await pool.query('Select userid from users where email = $1', [email]);
        // await pool.query('Update users set token = $1 where userid = $2', [token, result.rows[0].userid]);

        // user
        // user = await pool.query('Select * from users where email = $1', [email]);
        return res.status(201).json({
            "token":token
        }
        );
    }
    catch(err){
        console.log(err);
    }
}

module.exports.getUsers = function(req, res){
    console.log(req.user);
    if(req.user.role == 'librarian'){
        pool.query('SELECT * FROM users ORDER BY userid ASC', 
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
    if(req.user.role == 'librarian'){
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
        const { name, email, password } = req.body;

        pool.query('UPDATE users SET name = $1, email = $2, password = $3, updated_at = $4 WHERE userid = $5', [name, email, password, date, id],
            (err, results) => {
                if (err) {
                    throw err;
                }
                return res.status(200).send(`User modified with userid: ${id}`);
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

        pool.query('DELETE FROM users WHERE userid = $1', [id], 
            (err, results) => {
                if (err) {
                    throw err;
                }
                return res.status(200).send(`User deleted with userid: ${id}`);
        });
    }
    else{
        res.status(401).send('Unauthorized User');
    }
}