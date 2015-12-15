var express = require('express');
var router = express.Router();
var stripe = require("stripe")("sk_test_xgN9ij5LtKBOKYCkDS805kt3");


module.exports = function(app) {
  var checkout = function(req, res) {
    var stripeToken = req.body.stripeToken;
    var charge = stripe.charges.create({
      amount: 1000, // amount in cents, again
      currency: "usd",
      source: stripeToken,
      description: "Example charge"
    }, function(err, charge) {
      if (err && err.type === 'StripeCardError') {
        // The card has been declined
        return res.json({message: 'The card has been declined'});
      }
      if (err) {
        return res.json({message: 'Error'});
      }
    });
    return res.json({message: 'Successful'});
  };

  app.get('/', function(req, res) {
    res.render('index');
  });
  app.post('/', checkout);
};
