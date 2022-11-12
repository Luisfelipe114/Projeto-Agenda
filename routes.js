const express = require('express');
const route = express.Router();

const homeController = require('./src/controllers/homeController');
const loginController = require('./src/controllers/loginController');
const registerController = require('./src/controllers/registerController');
const contatoController = require('./src/controllers/contatoController');

const loginRequired = require('./src/middlewares/middleware').loginRequired;


//rotas da home
route.get('/', homeController.index);

//rotas de cadastro
route.get('/register/index', registerController.index);

route.post('/register/cadastrar', registerController.register);

//rotas de login
route.get('/login/index', loginController.index);

route.post('/login/entrar', loginController.login)

route.get('/login/sair', loginController.logout);

//rotas de contato
route.get('/contato/index', loginRequired ,contatoController.index);

route.post('/contato/register', contatoController.register);

route.get('/contato/index/:id', loginRequired, contatoController.editIndex);

route.post('/contato/edit/:id', loginRequired, contatoController.edit)

route.get('/contato/delete/:id', loginRequired, contatoController.delete);

module.exports = route;