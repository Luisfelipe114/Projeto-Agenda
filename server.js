require('dotenv').config(); //para ter um arquivo separado com os dados secretos da aplicação

const path = require('path');
const express = require('express');
const routes = require('./routes');
const app = express();

const mongoose = require('mongoose');

const session = require('express-session');
const MongoStore = require('connect-mongo'); //parra salvar as sessões na base de dados
const flash = require('connect-flash'); //para as mensagens flash que somem após a página sofrer outra requisição

const meuMiddleware = require('./src/middlewares/middleware')

const helmet = require('helmet'); //para a segurança
const csrf = require('csurf'); //para a segurança

mongoose.connect(process.env.CONNECTIONSTRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  app.emit('pronto');
}).catch( e => console.log(e));

const sessionOptions = session({
  secret: 'asdasdasdsfdgds',
  store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,//7 dias
    httpOnly: true
  }
})

//app.use(helmet()); 

app.use(sessionOptions);
app.use(flash());
app.use(express.json());
app.use(express.urlencoded({
    extended: true
})); //para o POST funcionar

app.use(express.static(path.resolve(__dirname, 'public')))

//EJS
app.set('views', path.resolve(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

app.use(csrf());

app.use(meuMiddleware.chechCSRFError);
app.use(meuMiddleware.csrfMiddleware);
app.use(meuMiddleware.middlewareGlobal);
app.use(routes);

app.on('pronto', () => {
  app.listen(3000, () => {
    console.log('Acessar http://localhost:3000');
    console.log('Servidor executando na porta 3000');
  });
}) //dessa forma, o app executa só após a conexão estar feita