# Lunar.js

Lunar.js is a simple module pattern helper. The module pattern provides separation of scopes and a pattern for explicit coupling between modules using imports. Lunar supports using modules as singletons or as module instances, as well as supporting multiple instances of Lunar itself.

## Examples

### Simple module

```javascript
Lunar.module("myModule", function() {
	// private scope
	var iterator = 0;
 
	// public interface
	var module = {};
 
	module.next = function() {
		return iterator++;
	};
 
	return module;
});
```

And now use that module:
```javascript
var myModule = Lunar.myModule;
console.log(myModule.next()); // 0
console.log(myModule.next()); // 1
```

Note that the module is a singleton module, so if you access it again you get the same instance:
```
var myModuleAgain = Lunar.myModule;
console.log(myModuleAgain.next()); // 2
```

### Multiple modules

Applications are generally made up of lots of different interacting modules. If it is clear how modules interact it makes it easier to understand a complex application. Lunar lets you follow a pattern of explicitly importing modules, so you can see the dependencies at a glance.

```javascript
Lunar.module("moduleA", function() {
	// imports
	var moduleB;

	// private scope
	var iterator = 0;

	// public interface
	var module = {};

	module.$takeOff = function(modules) {
		moduleB = modules.moduleB;
	};

	module.next = function() {
		return moduleB.getValue() + iterator++;
	};

	return module;
});

Lunar.module("moduleB", function() {
	// public interface
	var module = {};

	module.getValue = function() {
		return 42;
	};

	return module;
});
```

You can declare these modules in any order. The imports are created when you tell Lunar to `takeOff`.

```javascript
Lunar.takeOff();

var moduleA = Lunar.moduleA;
console.log(moduleA.next()); // 42
console.log(moduleA.next()); // 43
```

## Messages and events

You can send messages and events to Lunar modules using the `call` method. Any module that has declared a function with the given name will have that function called.

```javascript
Lunar.module("moduleC", function() {
	var counter = 0;

	var module = {};

	module.myEvent = function() {
		counter++;
	};

	module.getCount = function() {
		return counter;
	};

	return module;
});

console.log(Lunar.moduleC.getCount()); // 0
Lunar.call("myEvent");
console.log(Lunar.moduleC.getCount()); // 1
```

You can also pass arguments to the event functions:

```javascript
Lunar.call("myEvent", 6);
```

## Declaring modules

You declare modules using the `Lunar.module` function. You can pass additional function arguments to that function to pass those into your module when it is created.

```javascript
Lunar.module("moduleD", function($, undefined) {
	
}, jQuery);
```

## Instances of modules

Often modules are singletons, but sometimes you want to have multiple instances of a module. Lunar provides the `Lunar.instance` function to create instances of modules. Module instances can share state with their singleton counterparts by using the private variables declared in the module declaration function. Module instances can have private state by using instance variables, e.g. `this.value = 7;`.

Modules that support instances must declare a `$new` function.

```javascript
Lunar.module("classModule", function() {
	// shared state
	var sharedIterator = 0;

	// public interfact
	var module = {};

	module.$new = function() {
		this.privateIterator = 0;
	};

	module.next = function() {
		return this.privateIterator++;
	};

	module.nextShared = function() {
		return sharedIterator++;
	};

	return module;
});
```

```javascript
Lunar.classModule.nextShared(); // 0
Lunar.classModule.nextShared(); // 1

var instance = Lunar.instance("classModule");
instance.nextShared(); // 2, as the state is shared with the singleton module
instance.next(); // 0, as this is the private instance state
instance.next(); // 1

var anotherInstance = Lunar.instance("classModule");
anotherInstance.nextShared(); // 3, as the state is shared
anotherInstance.next(); // 0, as this is the private instance state
```

## Instances of Lunar

Sometimes you want to have multiple collections of modules that are independent of each other. By default, Lunar creates a global shared collection of modules and stores it in the global `Lunar` variable. That is what we have been accessing elsewhere in this documentation. Lunar also supports creating multiple instances of itself, either derived from a parent instance or a blank slate.

To create a new instance of Lunar we use the `Lunar.instance` function without any arguments:

```javascript
var lunar1 = Lunar.instance();
var lunar2 = Lunar.instance();
```

The same modules exist in both Lunar instances but they are completely independent, with no shared state. So you can access singleton modules in each Lunar instance.

## Take off

