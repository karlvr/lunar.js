/*jslint white: true, unparam: true, vars: true */

Lunar.module("test", function($, undefined) {
	"use strict";
	 
	// imports
	var anotherModule;
 
	// private scope
	var iterator = 0;
 
	// public module interface
	var module = {};

	module.$init = function(modules) {
		anotherModule = modules.anotherModule;
	};

	module.$new = function(initialValue) {
		this.iterator = initialValue !== undefined ? initialValue : 0;
	};
 
	// public interface
	module.doSomething = function() {
		return anotherModule.getSomething() + iterator++;
	};

	module.doSomethingElse = function() {
		return anotherModule.getSomething() + this.iterator++;
	};
 
	return module;
/* global jQuery */
}, jQuery);
