'use strict';

app.controller('Product1Ctrl', function($scope, shoppingcartService) {
	this.shoppingcartService_ = shoppingcartService;
	this.addProduct1 = function(){
		this.shoppingcartService_.addCart('product1');
	};
});