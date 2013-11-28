/*!
 * Lunar.js 0.0.2
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
	window.Lunar = makeLunarControl();

	function makeLunarControl() {
		var _moduleTemplates = {};
		var _contexts = [];

		function LunarControl() {}

		LunarControl.prototype = {};

		LunarControl.prototype.module = function(name, func) {
			if (typeof name === "string" && typeof func === "function") {
				if (reservedName(name)) {
					throw exception("Illegal module name: " + name);
				}

				var myArguments = Array.prototype.slice.call(arguments);
				var funcArguments = myArguments.slice(2);

				var template = {
					func: func,
					arguments: funcArguments
				};

				_moduleTemplates[name] = template;
			} else {
				throw exception("Invalid arguments to module(name, func) method: " + typeof name + ", " + typeof func);
			}
		};

		function reservedName(name) {
			return name === "instance" || name === "call";
		}

		LunarControl.prototype.context = function() {
			var lunar = makeLunarInstance(_moduleTemplates);
			_contexts.push(lunar);
			return lunar;
		};

		/** Returns a new instance of Lunar, with no modules and no connection to this instance of Lunar. 
		 */
		LunarControl.prototype.blank = function() {
			return makeLunarControl();
		};

		LunarControl.prototype.contexts = function() {
			var contextsCopy = [].concat(_contexts);
			return contextsCopy;
		};

		return new LunarControl();
	}

	function makeLunarInstance(moduleTemplates) {
		var _modules = {};

		function LunarInstance() {}

		LunarInstance.prototype = {};

		LunarInstance.prototype.instance = function(moduleName) {
			if (typeof moduleName === "string") {
				/* Return a new instance of the named module */
				var moduleObject = _modules[moduleName];
				if (!moduleObject) {
					throw exception("Module not declared in this context: " + moduleName);
				}

				var func = function() {};
				func.prototype = moduleObject;

				var result = new func();

				var myArguments = Array.prototype.slice.call(arguments);
				var funcArguments = myArguments.slice(1);
				result["$new"].apply(result, funcArguments);

				return result;
			} else {
				throw exception("Invalid argument type to instance(moduleName) method: " + typeof name);
			}
		};

		LunarInstance.prototype.call = function(funcName) {
			if (typeof funcName === "string") {
				var myArguments = Array.prototype.slice.call(arguments);
				var funcArguments = myArguments.slice(1);

				for (var moduleName in _modules) {
					var module = _modules[moduleName];
					if (typeof module[funcName] === "function") {
						module[funcName].apply(module, funcArguments);
					}
				}
			} else {
				throw exception("Invalid argument type to call(funcName) method: " + typeof name);
			}
		};

		function createModule(template) {
			return template.func.apply(null, template.arguments);
		}

		var lunar = new LunarInstance();

		/* Create modules */
		for (var name in moduleTemplates) {
			var module = createModule(moduleTemplates[name]);
			_modules[name] = module;
			lunar[name] = module;
		}

		/* Call init */
		lunar.call("$init", lunar);
		return lunar;
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
