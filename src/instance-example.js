/*jslint white: true, unparam: true, vars: true */

Lunar.module("myModule", function($, undefined) {
	"use strict";
	 
	// imports
	var importedModule;
 
	// private scope
	var myPrivateVar = 7;
 
 	// module interface
	var module = {};

	module.$init = function(context) {
		importedModule = context.importedModule;
	};
 
	module.doSomething = function() {
		importedModule.doSomethingElse(myPrivateVar);
	};

	module.doEvent = function(value) {
		myPrivateVar = value;
	};

	module.$instance = function(initArg) {
		// instance private scope

		var instance = {};
		instance.prototype = module;

		instance.doThat = function() {

		};

		return instance;
	};
 
	return module;
	
/* global jQuery */
}, jQuery);

var context = Lunar.context();
context.myModule.doSomething();
var moduleInstance = context.instance("myModule");
context.call("doEvent", 8);
