const pool = require('../config/postgres');
const { promisify } = require('util');
module.exports.getStatistics = async function(req, res){
    let ans = {
        "highest_lent_book":1,
        "most_active_user":2,
        "oldest_book":3,
        "newest_book":4,
        "most_available_book":5,
        "total_users":6,
        'total_books':7,
        "total_lent_books":9
    };

    let results;

    try{
        results = await pool.query('Select bookid, count(*) from records group by bookid order by count desc limit 1;');
        let bookid = results.rows[0].bookid;
        results = await pool.query('Select name from books where bookid = $1', [bookid]);
        ans.highest_lent_book = results.rows[0].name;

    }
    catch(err){
        return res.status(500).send('Internal server error.')
    }
    
    try{
        results = await pool.query('Select userid, count(*) from records group by userid order by count desc limit 1;');
        let userid = results.rows[0].userid;
        results = await pool.query('Select name from users where userid = $1',[userid]);
        ans.most_active_user = results.rows[0].name;
    }
    catch(err){
        return res.status(500).send('Internal server error.')
    }

    try{
        results = await pool.query('select name , min(created_at) from books group by bookid order by min limit 1;');
        ans.oldest_book = results.rows[0].name;
    }
    catch(err){
        return res.status(500).send('Internal server error.')
    }

    try{
        results = await pool.query('select name , max(created_at) from books group by bookid order by max desc limit 1;');
        ans.newest_book = results.rows[0].name;
    }
    catch(err){
        return res.status(500).send('Internal server error.')
    }

    try{
        results = await pool.query('Select bookid, count(*) from records group by bookid order by count limit 1;');
        let bookid = results.rows[0].bookid;
        results = await pool.query('Select name from books where bookid = $1', [bookid]);
        ans.most_available_book = results.rows[0].name;
    }
    catch(err){
        return res.status(500).send('Internal server error.')
    }

    try{
        results = await pool.query('Select count(*) as total_users from users;');
        ans.total_users = results.rows[0].total_users;
    }
    catch(err){
        return res.status(500).send('Internal server error.')
    }

    try{
        results = await pool.query('Select count(*) as total_books from books;');
        ans.total_books = results.rows[0].total_books;
    }
    catch(err){
        return res.status(500).send('Internal server error.')
    }

    try{
        results = await pool.query('Select sum(copies) as total_lent_books from records;');
        ans.total_lent_books = results.rows[0].total_lent_books;
    }
    catch(err){
        return res.status(500).send('Internal server error.')
    }

    return res.send(ans);
    // console.log(results.rows);
    
    // pool.query('Select bookid, count(*) from records group by bookid order by count desc limit 1;', (err, results) => {
    //     if(err){
    //         throw err;
    //     }
    //     // console.log(results.rows[0].bookid);

    //     let bookid = results.rows[0].bookid;

    //     pool.query('Select name from books where bookid = $1',[bookid], (err, results) => {
    //         if(err){
    //             throw err;
    //         }

    //         // return res.status(200).json(results.rows);
    //         ans.highest_lent_book = results.rows[0].name; 

    //     });
    //     // return res.status(200).json(results.rows);
    //     // ans.push(results.rows[0]);
    // });

    // pool.query('Select userid, count(*) from records group by userid order by count desc limit 1;', (err, results) => {
    //     if(err){
    //         throw err;
    //     }
    //     // console.log(results.rows[0]);

    //     let userid = results.rows[0].userid;
    //      pool.query('Select name from users where userid = $1',[userid], (err, results) => {
    //         console.log(results.rows);
    //         // return res.status(200).json(results.rows);
    //         ans.most_active_user = results.rows[0].name;
    //      });

    //     // return res.status(200).json(results.rows);
    // });

    // pool.query('select name , min(created_at) from books group by bookid order by min limit 1;', (err, results) => {
    //     if(err){
    //         throw err;
    //     }
    //     // console.log(results.rows[0]);
    //     ans.oldest_book = results.rows[0].name;
    //     // return res.status(200).json(results.rows[0].name);
    // });

    // pool.query('select name , max(created_at) from books group by bookid order by max desc limit 1;', (err, results) => {
    //     if(err){
    //         throw err;
    //     }
    //     // console.log(results.rows[0]);
    //     ans.newest_book = results.rows[0].name;
    //     // return res.status(200).json(results.rows);
    // });

    // pool.query('Select bookid, count(*) from records group by bookid order by count limit 1;', (err, results) => {
    //     if(err){
    //         throw err;
    //     }
    //     // console.log(results.rows[0]);

    //     let bookid = results.rows[0].bookid;

    //     pool.query('Select name from books where bookid = $1',[bookid], (err, results) => {
    //         if(err){
    //             throw err;
    //         }

    //         ans.most_available_book = results.rows[0].name;
    //         // return res.status(200).json(results.rows);
    //     });
    //     // return res.status(200).json(results.rows);
    // });

    // pool.query('Select count(*) as total_users from users;', (err, results) => {
    //     if(err){
    //         throw err;
    //     }
    //     // console.log(results.rows[0]);
    //     ans.total_users = results.rows[0].total_users;
    //     // return res.status(200).json(results.rows);
    // });

    // pool.query('Select count(*) as total_books from books;', (err, results) => {
    //     if(err){
    //         throw err;
    //     }
    //     // console.log(results.rows[0]);
    //     ans.total_books = results.rows[0].total_books;
    //     // return res.status(200).json(results.rows);
    // });


    // pool.queryAsync = promisify(pool.query);
    // pool.queryAsync('Select count(*) as total_books from books;').then(results => {
    //     ans = {
    //         "total_books": results.rows[0].total_books
    //     }
    // })
    // .catch(
    //     err => console.error(err)
    // )


    // let temp;
    // async function countBooks(){
    //     try{
    //         const res = await pool.query('Select count(*) as total_books from books;');

    //         return res.rows;
    //     }
    //     catch(err){
    //         console.error(err);
    //     }
    // }

    // async function main(){
    //     const books = await countBooks();

    //     ans = {
    //         "total_books": books.rows[0].total_books
    //     }
    //     console.log(books);
    // }

    // main();
    // console.log(temp);
    




    // pool.query('Select count(*) as total_books from books;', (err, results) => {
    //     if(err){
    //         throw err;
    //     }
    //     // console.log(results.rows[0]);
    //     ans = {
    //         "total_books": results.rows[0].total_books
    //     }
    //     // return res.status(200).json(results.rows);
    // });

    // pool.query('Select sum(copies) as total_lent_books from records;', (err, results) => {
    //     if(err){
    //         throw err;
    //     }
    //     // console.log(JSON.stringify(results.rows[0]));

    //     ans.total_lent_books = results.rows[0].total_lent_books;
    //     // return res.send(ans);
    //     // return res.status(200).json(results.rows);
    // });
    
    // return res.send(ans);
}