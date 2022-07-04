const db = require ('../db').pool;
const axios = require('axios');
const getAll = () => {
    return new Promise((resolve, reject) => {
        db.query('select * from book', (err, rows) => {
            if (err) reject(err);
            resolve(rows);
        })
    })
}

const insert = ({title,subtitle,autor,category,publication_date,editor,description,img}) => {
    return new Promise((resolve, reject) => {
        db.query(`insert into book (title,subtitle,autor,category,publication_date,editor,description,img) values (?,?,?,?,?,?,?,?)`, [title,subtitle,autor,category,publication_date,editor,description,img] , (err, rows) => {
            if (err) reject(err);
            resolve(rows);
        })
    })
}

const update = (id, {title,subtitle,autor,category,publication_date,editor,description,img}) => {
    return new Promise((resolve, reject) => {
        const aux = img.split('default');
        if (aux.length == 2) {
            db.query(`update book set title = ?, subtitle = ?,autor = ?,category = ?,publication_date = ?,editor = ?,description = ? where idbn = ?`, [title,subtitle,autor,category,publication_date,editor,description,id] , (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            })
        } else {

            db.query(`update book set title = ?, subtitle = ?,autor = ?,category = ?,publication_date = ?,editor = ?,description = ?,img = ? where idbn = ?`, [title,subtitle,autor,category,publication_date,editor,description,img, id] , (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            })
        }
    })
}

const deleted = (id) => {
    return new Promise((resolve, reject) => {
        db.query(`delete from book where idbn=?`, [id] , (err, rows) => {
            if (err) reject(err);
            resolve(rows);
        })
    })
}

const searchExt = (query) => {
    return new Promise((resolve, reject) => {
        axios.get('https://www.etnassoft.com/api/v1/get/?keyword='+query).then((res) => {
        //console.log(res);
        resolve(res.data);
        }).catch((err) => reject(err))
        
    })
}

const getByTitle = (pTitle) => {
    return new Promise((resolve, reject) => {
        db.query('select * from book where title=?',[pTitle], (err, rows) => {
            if (err) reject(err);
            resolve(rows);
        })
    })
}

module.exports = {
    getAll,
    insert,
    update,
    deleted,
    searchExt,
    getByTitle
}