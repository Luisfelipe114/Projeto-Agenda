const session = require('express-session');
const Contato = require('../models/ContatoModel')

exports.index = (req, res) => {
    res.render('contato', {
        contato: ''
    });
}

exports.register = async function(req, res) {
    try {
        const contato = new Contato(req.body);
        await contato.register(req.session.user._id);

        if(contato.erros.length > 0) {
            req.flash('erros', contato.erros);
            req.session.save(() => {
                res.redirect('/contato/index')
            });
            return;
        }

        req.flash('success', 'Contato registrado com sucesso');
        req.session.save(() => {
            res.redirect(`/contato/index/${contato.contato._id}`);
        });
    } catch(e) {
        console.log(e);
        return res.render('404');
    }
    
}

exports.editIndex = async function(req, res) {
    if(!req.params.id) return res.render('404');

    const contato = await Contato.buscaPorId(req.params.id);

    if(!contato) return res.render('404');

    res.render('contato', {contato})
}

exports.edit = async function(req, res) {
    if(!req.params.id) return res.render('404');

    try {
        const contato = new Contato(req.body);
        await contato.editar(req.params.id);

        if(contato.erros.length > 0) {
            req.flash('erros', contato.erros);
            req.session.save(() => {
                res.redirect('back');
            });
            return;
        }

        req.flash('success', 'Contato atualizado com sucesso');
        req.session.save(() => {
            res.redirect(`/contato/index/${contato.contato._id}`)
        });
    } catch(e) {
        console.log(e);
        return res.render('404');
    }


}

exports.delete = async function(req, res) {
    if(!req.params.id) return res.render('404');

    const contato = await Contato.deletar(req.params.id);

    if(!contato) return res.render('404');

    req.flash('success', 'Contato excluído com sucesso');
    req.session.save(() => {
        res.redirect('/');
    });
}