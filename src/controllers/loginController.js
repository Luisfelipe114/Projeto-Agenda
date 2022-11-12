const Login = require('../models/LoginModel');

exports.index = (req, res) => {
    if(req.session.user) return res.render('logado');
    res.render('login');
}

exports.login = async function(req, res) {
    try {
        const login = new Login(req.body);
        await login.login();
        if(login.erros.length > 0) {
            req.flash('erros', login.erros);
            req.session.save(function() {
                return res.redirect('back');
            });
            return;
        }
        req.flash('success', 'Login realizado com sucesso');
        req.session.user = login.user;
        req.session.save(function() {
            return res.redirect('/login/index'); //ou res.redirect('back')
        });
    } catch(e) {
        console.log(e);
        return res.render('404');
    }
}

exports.logout = (req, res) => {
    req.session.destroy();
    res.redirect('/');
}

