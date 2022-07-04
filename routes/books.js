var express = require('express');
var router = express.Router();
const middleware = require('./middleware');

const Books = require('../models/books');

var fs = require('fs'),
  request = require('request');

var download = function (uri, filename, callback) {
  request.head(uri, function (err, res, body) {
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};

const path = "images/book/"
router.use(middleware.checkToken);
router.get('/', async function (req, res, next) {
  //res.send('respond with a resource');
  const books = await Books.getAll();
  res.json(books);
});

router.post('/register', async (req, res) => {
  let img = req.body.img;
  if (img) {
    const type = img.split(';base64')[0].split('/')[1];
    var base64Data = img.replace("data:image/" + type + ";base64,", "");
    const name = (new Date()).valueOf().toString();

    require("fs").writeFile('public/' + path + name + "." + type, base64Data, 'base64', function (err) {
      console.log(err);
    });
    req.body.img = path + name + "." + type;
  } else {
    req.body.img = path + 'default.png';
  }
  const book = await Books.insert(req.body);
  res.json(book);
});

router.patch('/update/:id', async (req, res) => {
  let img = req.body.img;

  if (img) {
    const type = img.split(';base64')[0].split('/')[1];
    var base64Data = img.replace("data:image/" + type + ";base64,", "");
    const name = (new Date()).valueOf().toString();

    require("fs").writeFile('public/' + path + name + "." + type, base64Data, 'base64', function (err) {
      console.log(err);
    });
    req.body.img = path + name + "." + type;
  } else {
    req.body.img = path + 'default.png';
  }
  const id = req.params.id
  const book = await Books.update(id, req.body);
  res.json(book);
});

router.delete('/delete/:id', async (req, res) => {
  const id = req.params.id
  const book = await Books.deleted(id);
  res.json(book);
});

router.get('/search', async (req, res) => {
  const query = req.query.query
  const book = await Books.searchExt(query);
  book.forEach(async (element) => {
    const exist = await Books.getByTitle(element.title);
    //console.log(exist)
    if (exist.length == 0) {

      const name = (new Date()).valueOf().toString();
      const aux = element.cover.split('.');
      const type = aux[aux.length - 1];
      download(element.cover, 'public/' + path + name + '.' + type, function () {
        console.log('done');
      });
      let cat = '- ';
      element.categories.forEach(item => {
        cat += item.name + ' - ';
      });
      const req = {
        title: element.title,
        subtitle: 'No aplica',
        autor: element.author,
        category: cat,
        publication_date: element.publisher_date + '-01-01',
        editor: element.publisher,
        description: element.content,
        img: path + name + '.' + type
      }
      await Books.insert(req);
    }

  });
  res.json({ res: 'Ok' });



});





module.exports = router;