'use strict';

// Declare app level module which depends on views, and components
var app= angular.module('myApp', [
  'ngRoute',
  'ngMaterial',
  'ngCookies',
]).
config(['$routeProvider','$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider.when('/product1', {
    templateUrl: 'product1/product1.html',
    controller: 'Product1Ctrl',
	controllerAs: 'prod1Ctrl'
  });
  $routeProvider.when('/product2', {
    templateUrl: 'product2/product2.html',
    controller: 'Product2Ctrl',
	controllerAs: 'prod2Ctrl'
  });
   $routeProvider.when('/shoppingcart', {
    templateUrl: 'shoppingcart/shoppingcart.html',
    controller: 'shoppingcartCtrl',
	controllerAs: 'shoppingCtrl'
  });
  $routeProvider.otherwise({redirectTo: '/product1'});
  //$locationProvider.html5Mode(true);
}]);
app.factory('shoppingcartService', ['$window','$cookies', function(win, $cookies) {
	var factory = {};
	factory.cookies_ = $cookies;
   factory.productMap = [{id:'product1', name:'PSD2', imgSrc : 'newImages/item1.jpg', price:100}, 
					   {id:'product2', name:'EO301-C',imgSrc : 'newImages/item2.jpg', price:200},
					   {id:'product3', name:'1MORE PHD',imgSrc : 'newImages/item3.jpg', price:300},
					   {id:'product4', name:'801',imgSrc : 'newImages/item4.jpg', price:400}];
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
		if(shoppingCartStr) {
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

app.controller('AppCtrl', function($scope, $mdSidenav, $cookies) {


		

});