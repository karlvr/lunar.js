/*jslint white: true, unparam: true, vars: true */

Lunar.module("myModule", function($, undefined) {
	"use strict";
	 
	// imports
	var importedModule;
 
	// private scope
	var myPrivateVar;
 
	// public module interface
	var module = {};

	module.$takeOff = function(modules) {
		importedModule = modules.importedModule;
		myPrivateVar = importedModule.getSomething();
	};
 
	// public interface
	module.doSomething = function() {
		importedModule.doSomethingElse(myPrivateVar);
	};
 
	return module;
	
/* global jQuery */
}, jQuery);
