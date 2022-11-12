const validator = require('validator');
const bcryptJs = require('bcryptjs');
const registerMongoose = require('./MoongoseModelUser');


class Register {
    constructor(body) {
        this.body = body;
        this.erros = Array();
    }

    async register() {
        this.valida();
        if(this.erros.length > 0) return;

        const userAlreadyExists = await this.userExists(); //checando se o usuário já existe

        if(userAlreadyExists) return;

        let salt = bcryptJs.genSaltSync(); //"criptografando" a senha
        this.body.password = bcryptJs.hashSync(this.body.password, salt);

        await registerMongoose.userModel.create(this.body);
       
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
        const user = await registerMongoose.userModel.findOne({email: this.body.email});
        if(user) {
            this.erros.push("Usuário já existe");
            return true;
        }
        return false;
    }
}

module.exports = Register;