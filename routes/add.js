var express = require('express');
var forms = require("forms");
var router = express.Router();
var mongoose = require("mongoose");

var fields = forms.fields,
    validators = forms.validators;
var reg_form = forms.create({
  username: fields.string({ required: true })
  , email: fields.string({ required: true, label: 'Email' })
});


/*var reg_form = forms.create({
    username: fields.string({ required: true }),
    password: fields.password({ required: true }),
    confirm: fields.password({
        required: true,
        validators: [validators.matchField('password')]
    }),
    personal: {
        name: fields.string({ required: true, label: 'Name' }),
        email: fields.email({ required: true, label: 'Email' }),
        address: {
            address1: fields.string({ required: true, label: 'Address 1' }),
            address2: fields.string({ label: 'Address 2' }),
            city: fields.string({ required: true, label: 'City' }),
            state: fields.string({ required: true, label: 'State' }),
            zip: fields.number({ required: true, label: 'ZIP' })
        }
    }
});*/

var cardSchema = mongoose.Schema({
  username: String
  , password: String
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('add', { title: 'Test Form'
  , form: reg_form.toHTML()
  , "form-method": 'POST'});

});

router.post('/', function (req, res, next) {
  reg_form.handle(req, {
    success: function (form) {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.write('<h1>Success!</h1>');
      res.end('<pre>' + console.log(form.data) + '</pre>');
      
      var card = mongoose.model('Card', cardSchema);
      
      
    },
    // perhaps also have error and empty events
    other: function (form) {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.send('Other ??');
    }
  });
  
});

module.exports = router;
