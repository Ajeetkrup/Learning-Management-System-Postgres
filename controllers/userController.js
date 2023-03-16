const pool = require('../config/postgres');
const bcrypt = require('bcrypt');
const jwt =  require('jsonwebtoken');


const secretKey = 'my-secret-means';

module.exports.register = async function(req, res){
    console.log('Req Body:', req.body);

    // our register logic goes here..
    try{
        //get user input
        var { name, email, password, role } = req.body;
        role = role.toLowerCase();

        //Validate user input
        if (!(email && password && name && role)) {
            res.status(400).send("Bad Request");
        }

        // console.log(name, email, password);
        // check if user already exist
        // Validate if user exist in our database
        try{
            const results = await pool.query('Select name from users where email = $1', [email]);

            if(results.rows[0]){
                return res.status(409).send("User Already Exist. Please Login");
            }
        }
        catch(err){
            res.status(500).send('Internal server error.')
        }
        
        console.log(name.rows);

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
            res.status(404).send('User not found. Plz provide correct email or kindly register.')
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
            res.status(400).send('Wrong Password.');
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

module.exports.accessToken = async function(req, res){
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

        return res.status(201).json({
            "token":token
        }
        );
    }
    catch(err){
        console.log(err);
    }
}

module.exports.refreshToken = async function(req, res){
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
            expiresIn: "30d",
            }
            );

            req.body.token = token;
            // console.log('Token:',token);
        }
        else{
            res.status(409).send('User not found! Please Register.');
        }

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
        var { name, email, password, role } = req.body;
        role = role.toLowerCase();

        if(name && email && password && role){
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
            return res.status(404).send('Please provide all inputs.');
        }
    }
    else{
        res.status(401).send('Unauthorized User');
    }
}

module.exports.update = async function(req, res){
    // if(req.user.role == 'librarian'){
        let yourDate = new Date()
        let date = yourDate.toISOString().split('T')[0];
        // console.log(date);

        const id = parseInt(req.params.id);
        
        const { name, email, password } = req.body;
        if(!name && !email && !password){
            return res.send('Please provide any inputs.')
        }

        let query ='Update users set ';
        const userObj = req.body;
        // console.log(arr);
        let i=1;
        for(let key in userObj){
            // console.log(`${key}:${arr[key]}`);
            if(i == 1){
                query += key + "='" + userObj[key] + "'";
            }
            else{
                query += ',' + key + "='" + userObj[key] + "'";
            }
            i++;
        }
        query += " where userid='"+ id + "';";
        console.log(query);


        let user;
        try{
            user = await pool.query(query);
            return res.status(200).send(`User modified with userid: ${id}`);
        }
        catch(err){
            return res.status(500).send('Internal server error.')
        }
        
        // var name1, email1, password1;
        
        // if(name){
        //     name1 = name;
        // }
        // else{
        //     name1 = user.rows[0].name;
        // }
        // if(email){
        //     email1 = email;
        // }
        // else{
        //     email1 = user.rows[0].email;
        // }
        // if(password){
        //     password1 = password;
        // }
        // else{
        //     password1 = user.rows[0].password;
        // }
        // if(name || email || password){
            // if(name){
            //     pool.query('UPDATE users SET name = $1, email = $2, password = $3, updated_at = $4 WHERE userid = $5', [name1, email1, password1, date, id],
            //     (err, results) => {
            //         if (err) {
            //             throw err;
            //         }
            //         return res.status(200).send(`User modified with userid: ${id}`);
            //     }
            //     );
            // }
            // if(email){
            //     pool.query('UPDATE users SET email = $1, updated_at = $2 WHERE userid = $3', [email, date, id],
            //     (err, results) => {
            //         if (err) {
            //             throw err;
            //         }
            //         // return res.status(200).send(`User modified with userid: ${id}`);
            //     }
            //     );
            // }
            // if(password){
            //     pool.query('UPDATE users SET password = $1, updated_at = $2 WHERE userid = $3', [password, date, id],
            //     (err, results) => {
            //         if (err) {
            //             throw err;
            //         }
            //         // return res.status(200).send(`User modified with userid: ${id}`);
            //     }
            //     );
            // }

        //     return res.status(200).send(`User modified with userid: ${id}`);
        // }
        // else{
        //     return res.status(404).send('Please provide any inputs.')
        // }
    // }
    // else{
    //     res.status(401).send('Unauthorized User');
    // }
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