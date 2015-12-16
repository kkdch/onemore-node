'use strict';

app.controller('Product2Ctrl', function($scope, shoppingcartService) {
	this.shoppingcartService_ = shoppingcartService;
	this.addProduct1 = function(){
		this.shoppingcartService_.addCart('product1');
	};
	this.addProduct2 = function(){
		this.shoppingcartService_.addCart('product2');
	};
	this.addProduct3 = function(){
		this.shoppingcartService_.addCart('product3');
	};
	this.addProduct4 = function(){
		this.shoppingcartService_.addCart('product2');
	};
});