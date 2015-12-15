var express = require('express');
var router = express.Router();
var stripe = require("stripe")("sk_test_xgN9ij5LtKBOKYCkDS805kt3");


module.exports = function(app) {
  var checkout = function(req, res) {
    console.log(stripe.charges);
    stripe.orders.create({
      currency: 'usd',
      items: [
        {
          type: 'sku',
          parent: 'sku_7WWfSm9CPP55hx'
        }
      ],
      shipping: {
        name: 'Jenny Rosen',
        address: {
          line1: '1234 Main Street',
          city: 'Anytown',
          country: 'US',
          postal_code: '123456'
        }
      },
      email: 'jenny@ros.en'
    }, function(err, order) {
      // asynchronously called
      if (err) {

      }
      stripe.orders.pay(order.id, {
        source: req.body.stripeToken // obtained with Stripe.js
      }, function(err, order) {
        // asynchronously called
      });
    });
  };

  app.get('/', function(req, res) {
    res.render('index');
  });
  app.post('/', checkout);
};
