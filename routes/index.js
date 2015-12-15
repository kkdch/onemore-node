var express = require('express');
var router = express.Router();
var stripe = require("stripe")("sk_test_xgN9ij5LtKBOKYCkDS805kt3");


module.exports = function(app) {
  var checkout = function(req, res) {
    console.log(req.body);
    var stripeToken = req.body.stripeToken;
    var charge = stripe.charges.create({
      amount: 1000, // amount in cents, again
      currency: "usd",
      source: stripeToken,
      description: "Example charge"
    }, function(err, charge) {
      if (err && err.type === 'StripeCardError') {
        // The card has been declined
        res.json({message: 'The card has been declined'});
      } else if (err) {
        res.json({message: 'Error'});
      } else {
        res.json({message: 'Successful'});
      }
    });
  };

  app.get('/', function(req, res) {
    res.render('index');
  });
  app.post('/', checkout);
};
