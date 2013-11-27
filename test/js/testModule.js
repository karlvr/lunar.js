/*jslint white: true, unparam: true, vars: true */

Lunar.module("test", function($, undefined) {
	"use strict";
	 
	// imports
	var anotherModule;
 
	// private scope
 
	// public module interface
	var module = {};

	module.$takeOff = function(modules) {
		anotherModule = modules.anotherModule;
	};
 
	// public interface
	module.doSomething = function() {
		return anotherModule.getSomething();
	};
 
	return module;
/* global jQuery */
}, jQuery);
