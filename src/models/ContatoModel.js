const mongoose = require('mongoose');
const validator = require('validator');
const session = require('express-session');
const { userModel } = require('./MoongoseModelUser');

const ContatoSchema = new mongoose.Schema({
    nome: {type: String, required: true},
    sobrenome: {type: String, required: false, default: ''},
    email: {type: String, required: false, default: ''},
    telefone: {type: String, required: false, default: ''},
    criadoEm: {type: Date, default: Date.now},
    criadoPor: {type: String}

});

const ContatoModel = mongoose.model('Contato', ContatoSchema);

function Contato(body) {
    this.body = body;
    this.erros = Array();
    this.contato = null;
    this.user = null;
}

Contato.prototype.register = async function(idCriador) {
    this.valida(idCriador)

    if(this.erros.length > 0) return;
    this.contato = await ContatoModel.create(this.body);


};

Contato.prototype.valida = function(idCriador) {
    
    this.cleanUp(idCriador);
    //validação
    if(this.body.email && !validator.isEmail(this.body.email)) this.erros.push('Email inválido');

    if(!this.body.nome) this.erros.push('Nome é um campo obrigatório');

    if(!this.body.email && !this.body.telefone) {
        this.erros.push('Pelo menos um campo precisa ser enviado: email ou telefone')
    }

}

Contato.prototype.cleanUp = function(idCriador) {
    for(let key in this.body) {
        if(typeof this.body[key] !== 'string') {
         this.body[key] = '';
        }
     }

     this.body  = {
        nome: this.body.nome,
        sobrenome: this.body.sobrenome,
        email: this.body.email,
        telefone: this.body.telefone,
        criadoPor: idCriador
     };
}

Contato.prototype.editar = async function(id) {
    if(typeof id !== 'string') return;

    this.valida();
    if(this.erros.length > 0) return;

    this.contato = await ContatoModel.findByIdAndUpdate(id, this.body, {new: true}); //new = true para retornar os dados atualizados

}

//Métodos estáticos 
Contato.buscaPorId = async function(id) {
    if(typeof id !== 'string') return;
    const contato = await ContatoModel.findById(id);
    return contato;
}

Contato.buscaContatos = async function() {
    const contatos = await ContatoModel.find()
    .sort({criadoEm: -1});//1 para crescente e -1 para decrescente
    return contatos;
}

Contato.deletar = async function(id) {
    if(typeof id !== 'string') return;
    const contato = await ContatoModel.findOneAndDelete({_id: id});
    return contato;
}

module.exports = Contato;