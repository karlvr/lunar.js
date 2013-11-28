'use strict';

Lunar.module("test", function() {
	// imports
	var anotherModule;
 
	// private scope
	var iterator = 0;
 
	// public module interface
	var module = {};

	module.$init = function(context) {
		anotherModule = context.anotherModule;
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
});

Lunar.module("anotherModule", function() {
	// private scope
	var myPrivateVar;
 
	// public module interface
	var module = {};
 
	// public interface
	module.getSomething = function() {
		return 42;
	};
 
	return module;
});

describe('Basic tests', function() {

	it("Modules and instances of modules have both shared and independent state", function() {
		var context = Lunar.context();

		var testModule = context.test;
		expect(testModule.doSomething()).toBe(42);
		expect(testModule.doSomething()).toBe(43);

		var instance = context.instance("test");
		expect(instance.doSomething()).toBe(44);
		expect(instance.doSomething()).toBe(45);
		expect(testModule.doSomething()).toBe(46);

		expect(instance.doSomethingElse()).toBe(42);
		expect(instance.doSomethingElse()).toBe(43);

		expect(instance.doSomething()).toBe(47);
		expect(testModule.doSomething()).toBe(48);

	});

	it("Instances of modules have independent state", function() {
		var context = Lunar.context();

		var instance1 = context.instance("test");
		expect(instance1.doSomethingElse()).toBe(42);
		expect(instance1.doSomethingElse()).toBe(43);

		var instance2 = context.instance("test");
		expect(instance2.doSomethingElse()).toBe(42);
		expect(instance2.doSomethingElse()).toBe(43);
	});

	it("Arguments to instance constructors", function() {
		var context = Lunar.context();

		var instance1 = context.instance("test", 10);
		expect(instance1.doSomethingElse()).toBe(52);
		expect(instance1.doSomethingElse()).toBe(53);
	});

	it("Lunar instances are independent", function() {
		var context = Lunar.context();

		/* First we ensure that the test module has been incremented */
		var testModule = context.test;
		testModule.doSomething();
		expect(testModule.doSomething()).not.toBe(42);

		var context2 = Lunar.context();
		var testModule2 = context2.test;

		expect(testModule2.doSomething()).toBe(42);
	});

	it("Lunar modules are properties", function() {
		var context = Lunar.context();

		var testModule = context.test;
		expect(testModule.doSomething()).toBe(42);
	});

});
