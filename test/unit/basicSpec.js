'use strict';

Lunar.module("test", function($, undefined) {
	"use strict";
	 
	// imports
	var anotherModule;
 
	// private scope
	var iterator = 0;
 
	// public module interface
	var module = {};

	module.$takeOff = function(modules) {
		anotherModule = modules.anotherModule;
	};

	module.$new = function() {
		this.iterator = 0;
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

Lunar.takeOff();

describe('Basic tests', function() {

	it("Substitution", function() {
		var testModule = Lunar.module("test");
		expect(testModule.doSomething()).toBe(42);
		expect(testModule.doSomething()).toBe(43);

		var instance = Lunar.instance("test");
		expect(instance.doSomething()).toBe(44);
		expect(instance.doSomething()).toBe(45);
		expect(testModule.doSomething()).toBe(46);

		expect(instance.doSomethingElse()).toBe(42);
		expect(instance.doSomethingElse()).toBe(43);

		expect(instance.doSomething()).toBe(47);
		expect(testModule.doSomething()).toBe(48);

	});

});
