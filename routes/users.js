var express = require('express');
var router = express.Router();

const Users = require('../models/users');

const bcrypt = require('bcrypt');
const jwt = require('jwt-simple');
const moment = require('moment');
const middleware = require('./middleware');

const createToken = (user) => {
  let payload = {
    userId: user.id,
    createdAt: moment().unix(),
    expiresAt: moment().add(1, 'day').unix()
  }
  return jwt.encode(payload, process.env.TOKEN_KEY);
}

/* GET users listing. */
router.get('/', async function(req, res, next) {
  //res.send('respond with a resource');
  const users =  await Users.getAll();
    res.json(users);
});

router.post('/register/', async (req, res) => {
  console.log(req.body);
  req.body.password = bcrypt.hashSync(req.body.password, 10);
  const result = await Users.insert(req.body);
  res.json(result);
});

router.post('/login', async (req, res) => {
  const user = await Users.getByEmail(req.body.email);
  if (user === undefined) {
    res.json({
      error: 'Error, email o password no son correctos'
    })
  } else {
    const equals = bcrypt.compareSync(req.body.password, user.password);
    if(!equals) {
      res.json({
        error: 'Error, email o password no son correctos'
      })
    } else {
      res.json({
        successfull: createToken(user),
        done: 'Login exitoso'
      })
    }
  }
})

router.use(middleware.checkToken);

router.get('/userId', (req, res) => {
  console.log(req.userId);
  Users.getById(req.userId).then(row => {
    res.json(row);
  }).catch(err => console.log(err));
})

module.exports = router;
