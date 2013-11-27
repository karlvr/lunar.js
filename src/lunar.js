/*!
 * Lunar.js 0.0.1
 * @author Karl von Randow
 * @license Apache License, Version 2.0
 */
 /*
    Copyright 2013 Karl von Randow

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
  */
/*jslint white: true, unparam: true, vars: true */
(function(window, undefined) {
	window.Lunar = LunarFunc({});

	function LunarFunc(moduleTemplates, autoTakeOff) {
		var _modules = {};
		var _moduleTemplates = moduleTemplates;
		var _takenOff = false;
		var _children = [];

		/* Create initial modules */
		for (var name in _moduleTemplates) {
			_modules[name] = createModule(_moduleTemplates[name]);
		}

		function Lunar() {}

		Lunar.prototype = {};

		Lunar.prototype.module = function(name, func) {
			if (typeof name === "string" && typeof func === "function") {
				var myArguments = Array.prototype.slice.call(arguments);
				var funcArguments = myArguments.slice(2);

				var template = {
					func: func,
					arguments: funcArguments
				};

				_moduleTemplates[name] = template;
				_modules[name] = createModule(template);
			} else if (typeof name === "string") {
				return _modules[name];
			} else {
				throw exception("Invalid argument type to module() method: " + typeof name);
			}
		}

		function createModule(template) {
			return template.func.apply(null, template.arguments);
		}

		Lunar.prototype.instance = function(name) {
			if (typeof name === "string") {
				/* Return a new instance of the named module */
				var moduleObject = this.module(name);
				var func = function() {};
				func.prototype = moduleObject;
				var result = new func();

				var myArguments = Array.prototype.slice.call(arguments);
				var funcArguments = myArguments.slice(1);
				result["$new"].apply(result, funcArguments);

				return result;
			} else if (name === undefined || typeof name === "boolean") {
				/* Return a new instance of Lunar */
				var lunar = LunarFunc(_moduleTemplates, name !== undefined ? name : _takenOff);
				_children.push(lunar);
				return lunar;
			} else {
				throw exception("Invalid argument type to instance() method: " + typeof name);
			}
		}
		
		Lunar.prototype.takeOff = function() {
			if (_takenOff)
				return false;
			_takenOff = true;

			var myArguments = Array.prototype.slice.call(arguments);
			var modulesCopy = merge({}, _modules);
			var funcArguments = ["$takeOff", modulesCopy].concat(myArguments);
			this.call.apply(this, funcArguments);

			for (var child in _children) {
				child.takeOff();
			}
			return true;
		}
		
		Lunar.prototype.call = function(funcName) {
			var myArguments = Array.prototype.slice.call(arguments);
			var funcArguments = myArguments.slice(1);

			var modulesCopy = merge({}, _modules);
			var results = {};
			for (var moduleName in modulesCopy) {
				var module = _modules[moduleName];
				if (typeof module[funcName] === "function") {
					var result = module[funcName].apply(module, funcArguments);
					results[moduleName] = result;
				}
			}
			return results;
		}

		var lunar = new Lunar();
		if (autoTakeOff) {
			lunar.takeOff();
		}
		return lunar;
	};

	/**
	 * Merge objects passed as arguments. If the first parameter is a boolean that specifies whether to do a deep
	 * copy.
	 */
	function merge() {
		/* Support cycles */
		var seen = [];
		var merged = [];

		function _merge() {
			var objectsStart = 0;
			var deep = false;
			if (typeof arguments[0] === "boolean") {
				deep = arguments[0];
				objectsStart++;
			}
			var target = arguments[objectsStart];
			if (typeof target !== "object" && typeof target !== "function") {
				throw exception("Target object argument to merge is not appropriate: " + typeof target);
			}
			if (target === null) {
				throw exception("Target object argument to merge is not appropriate: " + target);
			}
			for (var i = objectsStart + 1; i < arguments.length; i++) {
				var source = arguments[i];
				if (source === undefined) {
					continue;
				}

				if (typeof source !== "object" && typeof source !== "function") {
					throw exception("Argument " + (i+1) + " to merge is not appropriate: " + typeof source);
				}

				seen.push(source);
				merged.push(target);

				for (var name in source) {
					var value = source[name];
					if (value !== undefined) {
						if (deep && typeof value === "object" && value !== null) {
							var found = arrayIndexOf(seen, value);
							if (found === -1) {
								var deepTarget = target[name];
								if (deepTarget === undefined) {
									deepTarget = isArray(value) ? [] : {};
								}
								value = _merge(true, deepTarget, value);
							} else {
								value = merged[found];
							}
						}
						target[name] = value;
					}
				}
			}
			return target;
		}

		return _merge.apply(this, arguments);
	}

	/* Exceptions */

	function exception(message) {
		return new LunarException(message);
	}

	LunarException.prototype = new Object();

	function LunarException(message) {
		this.name = "LunarException";
		this.message = message;
	}

	LunarException.prototype.toString = function() {
		return "Lunar.js exception: " + this.message;
	};
/* global window */
})(window);
