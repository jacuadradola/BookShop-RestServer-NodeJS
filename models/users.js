const db = require ('../db').pool;
const getAll = () => {
    return new Promise((resolve, reject) => {
        db.query('select * from users', (err, rows) => {
            if (err) reject(err);
            resolve(rows);
        })
    })
}

const insert = ({email, password, name, surname}) => {
    return new Promise((resolve, reject) => {
        db.query('insert into users (email, password, name, surname) values (?,?,?,?)',[email, password, name, surname], (err, result   ) => {
            if (err) reject(err);
            resolve(result);
        })
    })
}

const getByEmail = (pEmail) => {
    return new Promise((resolve, reject) => {
        db.query('select * from users where email=?',[pEmail], (err, rows) => {
            if (err) reject(err);
            resolve(rows[0]);
        })
    })
}

const getById = (pId) => {
    return new Promise((resolve, reject) => {
        db.query('select * from users where id=?',[pId], (err, rows) => {
            if (err) reject(err);
            resolve(rows[0]);
        })
    })
}

module.exports = {
    getAll,
    insert,
    getByEmail,
    getById
}