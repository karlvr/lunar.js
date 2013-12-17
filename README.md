# Lunar.js

Lunar.js is a simple Javascript module-pattern helper. The module pattern provides separation of scopes and a pattern for explicit coupling between modules using imports. Lunar supports modules as singletons or as instances, as well as creating multiple independent module contexts.

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
var context = Lunar.context();
var myModule = context.myModule;
console.log(myModule.next()); // 0
console.log(myModule.next()); // 1
```

The `Lunar` object is global, and acts as a factory creating contexts populated with modules.

### Multiple modules

Applications are generally made up of lots of different interacting modules. If it is clear how modules interact it is easier to understand a complex application. Lunar provides an explicit module importing pattern, so you can see the dependencies at a glance.

```javascript
Lunar.module("moduleA", function() {
	// imports
	var moduleB;

	// private scope
	var iterator = 0;

	// public interface
	var module = {};

	module.$init = function(context) {
		moduleB = context.moduleB;
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

You can declare these modules in any order. When the context is created, the `$init` function is called, passing in the context, allowing each module to get a reference to the context and to other modules it wants to call explicitly.

```javascript
var context = Lunar.context();

var moduleA = context.moduleA;
console.log(moduleA.next()); // 42
console.log(moduleA.next()); // 43
```

## Messages and events

You can send messages and events to Lunar modules using the `send` method. Any module that has declared a function with the given name will have that function called.

```javascript
Lunar.module("moduleC", function() {
	var counter = 0;

	var module = {};

	module.myEvent = function() {
		counter++;
	};

	module.anotherEvent = function(value) {
		counter += value;
	}

	module.getCount = function() {
		return counter;
	};

	return module;
});
```

```javascript
var context = Lunar.context();

console.log(context.moduleC.getCount()); // 0
context.send("myEvent");
console.log(context.moduleC.getCount()); // 1
```

You can also pass arguments to the event functions:

```javascript
context.send("anotherEvent", 6);
```

### Modules sending messages

Modules can also send messages, rather than explicitly calling functions on other modules. This results in a loosely couple solution; a module can send a message without knowing which module, or modules, will receive it and act upon it. Delightful.

The module gets the reference to the context in the `$init` function, which is called automatically when the context is created.

```javascript
Lunar.module("myModule", function() {
	var context;

	var module = {};

	module.$init = function(theContext) {
		context = theContext;
	};

	module.handleSomething = function() {
		context.send("handleSomethingElse");
	};

	return module;
});
```

NB. `context.send` does not send messages to module _instances_. If you want to pass messages to instances, you should store the instances created in a variable in your module, and pass the message to those instances yourself when the message is received by the module.

## Declaring modules

You declare modules using the `Lunar.module` function. You can pass additional function arguments to that function to pass those into your module when it is created.

```javascript
Lunar.module("moduleD", function($) {
	
}, jQuery);
```

## Initialising modules

Whenever a Lunar context is created, by calling `Lunar.context()` (or see below for more options), the modules are sent the `$init` message, effectively calling the function named `$init` if there is one. The context is passed as an argument. This enables the context to get references to other modules in the context, or to store a reference to the context itself.

## Instances of modules

Often modules are singletons, but sometimes you want to have multiple instances of a module. Lunar provides the `context.instance` function to create instances of modules. Module instances share state with their singleton counterparts by using the private variables declared in the module declaration function. Module instances have private state using instance variables, e.g. `this.value = 7;`.

Modules that support instances must declare a `$new` function.

```javascript
Lunar.module("classModule", function() {
	// shared state
	var sharedIterator = 0;

	// public interface
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
var context = Lunar.context();
context.classModule.nextShared(); // 0
context.classModule.nextShared(); // 1

var instance = context.instance("classModule");
instance.nextShared(); // 2, as the state is shared with the singleton module
instance.next(); // 0, as this is the private instance state
instance.next(); // 1

var anotherInstance = context.instance("classModule");
anotherInstance.nextShared(); // 3, as the state is shared
anotherInstance.next(); // 0, as this is the private instance state
```

## Lunar contexts

Calling `Lunar.context()` returns the default context. The default context is the most commonly used.

```javascript
var defaultContext = Lunar.context();
```

You can create additional named contexts by passing a name argument. This created a named context, so calling `Lunar.context(name)` again with the same name will return the same context object.

```javascript
var namedContext = Lunar.context("my context");
var anotherContext = Lunar.context("other context");
```

You can also create anonymous contexts by passing an empty string as the name for the context. Note for experts: Lunar doesn't retain any references to anonymous contexts so they will be garbage collected when you've finished using them, whereas named contexts and the default context are retained.

```javascript
var anonymousContext = Lunar.context("");
```

All of the different contexts created are independent. The same modules exist in all of the contexts but they are independent as they are different objects.
