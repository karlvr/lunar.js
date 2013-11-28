'use strict';

var myLunar = Lunar.blank();

myLunar.module("sendTest", function() {
	// private scope
	var value = 0;
 
	// public module interface
	var module = {};
 
	module.addOne = function() {
		value++;
	};

	module.add = function(increment) {
		value += increment;
	};

	module.getValue = function() {
		return value;
	}
 
	return module;
});

myLunar.module("sendTest2", function() {
	// private scope
	var value = 0;

	// public module interface
	var module = {};
 
	module.addOne = function() {
		value += 2;
	};

	module.add = function(increment) {
		value += 2 * increment;
	};

	module.getValue = function() {
		return value;
	}
 
	return module;
});

describe('Send tests', function() {

	it("Send messages", function() {
		var context = myLunar.context();

		context.send("addOne");

		var testModule = context.sendTest;
		var testModule2 = context.sendTest2;

		expect(testModule.getValue()).toBe(1);
		expect(testModule2.getValue()).toBe(2);

		context.send("add", 31);
		expect(testModule.getValue()).toBe(32);
		expect(testModule2.getValue()).toBe(64);
	});

});
