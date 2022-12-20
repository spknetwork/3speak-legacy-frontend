const admins = ['threespeak', 'starkerz', 'theycallmedan', 'vaultec', 'eddiespino', 'sisygoboom'];

module.exports =  (req, res, next) => {

    if (req.user && admins.includes(req.user.nickname)) {

 return next();

}
    if (req.body) {

        return res.status(401).json({error: 'you must be logged in with an authorised account'})

}
        res.redirect('/');

};
