'use strict';

Lunar.module("testTakeOff", function(undefined) {
	"use strict";
 
	// private scope
	var iterator = 0;
 
	// public module interface
	var module = {};

	module.$takeOff = function(modules) {
		iterator = 5;
	};
 
	// public interface
	module.next = function() {
		return iterator++;
	};
 
	return module;
});

describe('Take Off tests', function() {

	it("Lunar instance doesn't auto-takeoff if the parent hasn't taken off", function() {
		var lunar1 = Lunar.instance();
		expect(lunar1.module("testTakeOff").next()).toBe(0);
		expect(lunar1.module("testTakeOff").next()).toBe(1);

		lunar1.takeOff();

		expect(lunar1.module("testTakeOff").next()).toBe(5);
		expect(lunar1.module("testTakeOff").next()).toBe(6);
	});

	it("Lunar instance does auto-takeoff if the parent has taken off", function() {
		var lunar1 = Lunar.instance();
		lunar1.takeOff();

		var lunar2 = lunar1.instance();
		expect(lunar2.module("testTakeOff").next()).toBe(5);
		expect(lunar2.module("testTakeOff").next()).toBe(6);
	});

	it("Lunar instance manual take-off", function() {
		var lunar1 = Lunar.instance(true);
		expect(lunar1.module("testTakeOff").next()).toBe(5);
		expect(lunar1.module("testTakeOff").next()).toBe(6);
	});

	it("Lunar instance manual no-take-off", function() {
		var lunar1 = Lunar.instance();
		lunar1.takeOff();

		var lunar2 = lunar1.instance(false);
		expect(lunar2.module("testTakeOff").next()).toBe(0);
		expect(lunar2.module("testTakeOff").next()).toBe(1);
	});

});
