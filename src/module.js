/*jslint white: true, unparam: true, vars: true */

Lunar.module("myModule", function($, undefined) {
	"use strict";
	 
	// imports
	var importedModule;
 
	// private scope
	var myPrivateVar;
 
	var module = {};

	// public module interface
	module.$takeOff = function(modules) {
		importedModule = modules.importedModule;
		myPrivateVar = importedModule.getSomething();
	};
 
	// public interface
	module.next = function() {
		importedModule.doSomethingElse(myPrivateVar);
	};
 
	return module;
	
/* global jQuery */
}, jQuery);
