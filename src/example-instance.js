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

	module.$new = function(initArg) {
		this.instanceVar = initArg;
	};
 
	module.doSomething = function() {
		importedModule.doSomethingElse(myPrivateVar);
	};

	module.instanceMethod = function() {
		return this.instanceVar;
	};

	module.doEvent = function(value) {
		if (this === module) {
			myPrivateVar = value;
		} else {
			this.instanceVar = value;
		}
	};
 
	return module;
	
/* global jQuery */
}, jQuery);

var context = Lunar.context();
context.myModule.doSomething();
var moduleInstance = context.instance("myModule");
context.call("doEvent", 8);
