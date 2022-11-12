import 'core-js/stable';
import 'regenerator-runtime/runtime';

import Login from './modules/validaLogin';

import Contato from './modules/validaContato';

const cadastro = new Login('.form-cadastro');
const login = new Login('.form-login');

cadastro.init();
login.init();

const validacaoContato = new Contato('.form-contato');

validacaoContato.init();