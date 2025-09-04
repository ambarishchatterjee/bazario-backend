const bcrypt = require('bcryptjs')
const User = require('../models/User')

exports.getAdminLogin = (req, res, next)=>{
    res.render('auth/login.ejs', {title: 'Admin Login', layout: false, error: null})
}

//login
exports.postAdminLogin = async (req, res, next)=>{
    try {
        const {email, password} = req.body
        const user = await User.findOne({email, role: 'admin'})

        if(!user){
            return res.render('auth/login', {title: 'Admin Login', layout: false, error: 'User not found'})
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch){
            return res.render('auth/login', {title: 'Admin Login', layout: false, error: 'Wrong credential'})
        }

        req.session.admin = {id: user._id, email: user.email}
        res.redirect('/admin/dashboard')

    } catch (error) {
        return res.render('auth/login', {title: 'Admin Login', layout: false, error: 'Something wrong'}) 
    }
}

//logout
exports.postLogout = (req, res, next)=>{
    req.session.destroy(()=>{
        res.redirect('/admin/login')
    })
}