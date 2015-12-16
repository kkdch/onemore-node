'use strict';

app.controller('shoppingcartCtrl', function($scope, $cookies, shoppingcartService) {
     
	this.shoppingcartService_ = shoppingcartService;
	this.scope_ = $scope;
	var varl = this.shoppingcartService_.multiply(2,3);
	
	var shoppingCart = this.shoppingcartService_.getShoppingCartFromCookie();
	if(!shoppingCart || shoppingCart.length==0){
		shoppingCart.push({id: 'product1', name:'aaa', price:100, imgSrc : 'newImages/item1.jpg', qty:2});
		shoppingCart.push({id: 'product2', name:'bbb', price:200, imgSrc : 'newImages/item2.jpg', qty:3});
	} 
	this.shoppingcartService_.shoppingCart = shoppingCart;
	this.shoppingcartService_.putShoppingCartToCookie();
	$scope.shoppingCart = this.shoppingcartService_.shoppingCart;
	$scope.total = 100;
	this.getTotal = function(){
		var totalAmt = 0;
		for(var i = 0;i<this.shoppingcartService_.shoppingCart.length;i++) {
			var item = this.shoppingcartService_.shoppingCart[i];
			totalAmt += item.qty * item.price;
		}
		this.scope_.totalAmt= totalAmt;
		return totalAmt;
	};
	this.test = function(){
		return 'aaa';
	}
	this.plus = function(itemId) {
		$scope.shoppingCart= this.shoppingcartService_.addCart(itemId);
		
	};
	this.minus = function(itemId) {
		$scope.shoppingCart= this.shoppingcartService_.removeOneFromCart(itemId);
		
	};
	this.remove = function(itemId) {
		$scope.shoppingCart= this.shoppingcartService_.removeAllFromCart(itemId);
		
	};
});