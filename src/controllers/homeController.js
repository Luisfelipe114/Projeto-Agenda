const Contato = require('../models/ContatoModel');

exports.index = async function(req, res, next) {
    const contatos = await Contato.buscaContatos();
    res.render('index', {contatos});
    //next();
}


