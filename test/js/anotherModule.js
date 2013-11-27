/*jslint white: true, unparam: true, vars: true */

Lunar.module("anotherModule", function($) {
	"use strict";
	 
	// private scope
	var myPrivateVar;
 
	// public module interface
	var module = {};

	module.$takeOff = function(modules) {
		
	};
 
	// public interface
	module.getSomething = function() {
		return 42;
	};
 
	return module;
	
/* global jQuery */
}, jQuery);
