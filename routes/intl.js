var express = require('express');
var router = express.Router();

router.get('/faq', (req, res) => {

    res.render('new/intl_faq');

});

router.get('/about_us', (req, res) => {

    res.render('new/intl_about_us');

});

router.get('/terms_of_service', (req, res) => {

    res.redirect(CDN_TOS_URL)

});

router.get('/privacy', (req, res) => {

   res.render('new/intl_privacy')

});

router.get('/contact_m', (req, res) => {

    res.redirect(`mailto:${SUPPORT_EMAIL}`)

});

module.exports = router;
