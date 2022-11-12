const bcryptJs = require('bcryptjs');
const validator = require('validator');
const loginMongoose = require('./MoongoseModelUser');

class Login {
    constructor(body) {
        this.body = body;
        this.erros = Array();
        this.user = null;
    }

    async login() {
        this.valida();
        if(this.erros.length > 0) return;

        const userAlreadyExists = await this.userExists(); //checando se o usuário já existe

        if(!userAlreadyExists) return;

        if(!bcryptJs.compareSync(this.body.password, this.user.password)) {
            this.erros.push('Senha incorreta');
            this.user = null;
            return;
        }
    }

    valida() {
        this.cleanUp();
        //validação
        if(!validator.isEmail(this.body.email)) this.erros.push('Email inválido');

        if(this.body.password.length < 3 || this.body.password.length >= 30) {
            this.erros.push('A senha precisa ter entre 3 e 30 caracteres')
        }

    }

    cleanUp() {
        for(let key in this.body) {
           if(typeof this.body[key] !== 'string') {
            this.body[key] = '';
           }
        }

        this.body  = {
            email: this.body.email,
            password: this.body.password
        };
    }

    
    async userExists() {
        this.user = await loginMongoose.userModel.findOne({email: this.body.email});
        if(!this.user) {
            this.erros.push("Usuário não existe");
            return false;
        }
        return true;
    }
}

module.exports = Login;