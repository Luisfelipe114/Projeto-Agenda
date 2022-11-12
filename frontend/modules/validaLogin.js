import validator from "validator";

class Erro {
    constructor(campo, erro) {
        this.campo = campo;
        this.erro = erro;
    }
}

export default class FormLogin {
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
        this.erros = Array();
        const el = e.target;
        const emailInput = el.querySelector('input[name="email"]');
        const passwordInput = el.querySelector('input[name="password"]');

        let error = false;

        if(!validator.isEmail(emailInput.value)) {
            let emailErro = new Erro(emailInput, "Email inválido");
            this.erros.push(emailErro);
            
            error = true;
        }

        if(passwordInput.value.length < 3 || passwordInput.value.length >= 30) {
            let senhaErro = new Erro(passwordInput, "Senha precisa ter entre 3 e 30 caracteres");
            this.erros.push(senhaErro);

            error = true;
        }

        if(error) {
            this.mostrarErros()
        } else {
            el.submit();
        }
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