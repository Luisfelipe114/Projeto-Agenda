const Register = require('../models/RegisterModel');

exports.index = (req, res) => {
    res.render('register');
}

exports.register = async function(req, res) {
    try {
        const registro = new Register(req.body);
        await registro.register();
        if(registro.erros.length > 0) {
            req.flash('erros', registro.erros);
            req.session.save(function() {
            return res.redirect('back');
            });
            return;
        }
        req.flash('success', 'Usuário cadastrado com sucesso');
        req.session.save(function() {
            return res.redirect('/register/index'); //ou res.redirect('back')
        });
    } catch(e) {
        console.log(e);
        return res.render('404');
    }
    
}