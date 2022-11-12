import validator from "validator";

class Erro {
    constructor(campo, erro) {
        this.campo = campo;
        this.erro = erro;
    }
}

export default class FormContato {
    constructor(formClass) {
        this.form = document.querySelector(formClass);
        this.erros;
    }

    init() {
        this.events();
    }

    events() {
        if(!this.form) return;
        this.form.addEventListener('submit', e => {
            e.preventDefault();
            this.validate(e);
        })
    }

    validate(e) {
        const el = e.target;
        this.erros = Array();
        const nameImput = el.querySelector('input[name="nome"]')
        const emailInput = el.querySelector('input[name="email"]');
        const telefoneInput = el.querySelector('input[name="telefone"]');

        let error = false;

        if(nameImput.value == '' ) {
            error = true;
            let campoNomeVazioErro = new Erro(nameImput, "Campo Nome precisa estar preenchido")
            this.erros.push(campoNomeVazioErro);
        }

        if(this.validateEmailETelefone(emailInput, telefoneInput)) error = true;

        if(error) {
            this.mostrarErros();
        } else {
            el.submit();
        }
    }

    validateEmailETelefone(email, telefone) {
        if(email.value == '' && telefone.value == '') {
            let emailOuTelefoneErro = new Erro(email, "Pelo menos um dos seguintes campos precisa estar preenchido: Email ou Telefone")
            this.erros.push(emailOuTelefoneErro);
            let telefoneOuEmailErro = new Erro(telefone, "Pelo menos um dos seguintes campos precisa estar preenchido: Email ou Telefone")
            this.erros.push(telefoneOuEmailErro);

            return true;
        }

        if(telefone.value == '') {
            if(!validator.isEmail(email.value)) {
                let emailErro = new Erro(email, "Email inválido")
                this.erros.push(emailErro);
            
                return true;
            }
        }
        return false;
    }

    mostrarErros() {
        if(this.erros.length == 0) return;
        for(let errorText of this.form.querySelectorAll('.text-danger')) {
            errorText.remove();
        }
        for(let i in this.erros) {
            const div = document.createElement('div');
            const campo = this.erros[i].campo;
            div.innerText = this.erros[i].erro;
            div.classList.add('text-danger');
            campo.insertAdjacentElement('afterend', div);
        }
    }
}