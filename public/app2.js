'use strict';

// Declare app level module which depends on views, and components
var app= angular.module('myApp', [
  'ngCookies',
]);
app.factory('shoppingcartService', ['$window','$cookies', function(win, $cookies) {
	var factory = {};
	factory.cookies_ = $cookies;
   factory.productMap = [{id:'product1', name:'1M301', imgSrc : 'images/slide3-1.jpg', price:29.99},
					   {id:'product2', name:'EO301',imgSrc : 'images/slide4-2.jpg', price:79.99},
					   {id:'product3', name:'E0323',imgSrc : 'images/slide4-1.jpg', price:79.99},
					   {id:'product4', name:'MK801',imgSrc : 'images/slide3-2.jpg', price:79.99}];
   factory.multiply = function(a, b) {
      return a * b
   };
   factory.removeAllFromCart = function(itemId){
	   factory.shoppingCart = factory.getShoppingCartFromCookie();
		var index = -1;
		for(var i = 0;i<factory.shoppingCart.length;i++){
			if(factory.shoppingCart[i].id == itemId) {
					index = i;
			}
		}
		if(index>=0) {
			factory.shoppingCart.splice(index, 1);
		}
		factory.putShoppingCartToCookie();
		return factory.shoppingCart;
   }

    factory.removeOneFromCart = function(itemId){
		factory.shoppingCart = factory.getShoppingCartFromCookie();
		var index = -1;
		for(var i = 0;i<factory.shoppingCart.length;i++){
			if(factory.shoppingCart[i].id == itemId) {
				factory.shoppingCart[i].qty -=1;
				if(factory.shoppingCart[i].qty == 0)
					index = i;
			}
		}
		if(index>=0) {
			factory.shoppingCart.splice(index, 1);
		}
		factory.putShoppingCartToCookie();
		return factory.shoppingCart;
	};
   factory.addCart = function(itemId){
		factory.shoppingCart = factory.getShoppingCartFromCookie();
		var shoppingCart = factory.shoppingCart ;
		var isFound = false;
		for(var i = 0;i<shoppingCart.length;i++){
			if(shoppingCart[i].id == itemId) {
				shoppingCart[i].qty +=1;
				isFound = true;
			}
		}
		if(!isFound) {
			for(var j =0;j<factory.productMap.length;j++) {
				if(factory.productMap[j].id == itemId) {
					var myProduct = factory.productMap[j];
					factory.shoppingCart.push({id:myProduct.id, name:myProduct.name,
									   price:myProduct.price,imgSrc:myProduct.imgSrc, qty:1});
				}
			}
		}
		factory.putShoppingCartToCookie();
		return shoppingCart;

	};

	factory.getShoppingCartFromCookie = function(){
		var shoppingCartStr = $cookies.get('shoppingCart');

		var obj = [];
    if(shoppingCartStr && shoppingCartStr !='' &&
        shoppingCartStr!='{}') {
			obj = JSON.parse($cookies.get('shoppingCart'));
		}
		return obj;
	}

	factory.putShoppingCartToCookie = function() {
		var serializeValue = JSON.stringify(factory.shoppingCart);

		$cookies.putObject('shoppingCart', factory.shoppingCart)
	}


   return factory;
  }]);

app.controller('AppCtrl', function($window, $scope, $cookies, shoppingcartService) {
  this.shoppingcartService_ = shoppingcartService;
  this.addProduct = function(productName) {
    this.shoppingcartService_.addCart(productName);
    $window.location.href = "shop";
  }
});
