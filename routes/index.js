var express = require('express');
var router = express.Router();
var stripe = require("stripe")("sk_test_xgN9ij5LtKBOKYCkDS805kt3");


module.exports = function(app) {
  var checkout = function(req, res) {
    console.log(req.body);
    var stripeToken = req.body.stripeToken;
    var detail = req.body.firstName + " " + req.body.lastName + " ";
    detail += req.body.address1 + " " + req.body.address2 + " ";
    detail += req.body.city + " " + req.body.state + " " + req.body.postalCode;
    var charge = stripe.charges.create({
      amount: req.body.amount, // amount in cents, again
      currency: "usd",
      source: stripeToken,
      description: detail
    }, function(err, charge) {
      if (err && err.type === 'StripeCardError') {
        // The card has been declined
        res.render('successful', {
          message: "The card has been declined"
        });
      } else if (err) {
        res.render('successful', {
          message: "Error"
        });
      } else {
        res.render('successful', {
          message: "Thanks for your payment"
        });
      }
    });
  };

  app.get('/', function(req, res) {
    res.render('index');
  });
  app.get('/test', function(req, res) {
    res.render('test');
  });
  app.post('/', checkout);
};
