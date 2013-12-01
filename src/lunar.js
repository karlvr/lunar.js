/*!
 * Lunar.js 0.0.6
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
		var _contexts = {};
		var _defaultContext;

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
				throw exception("Invalid arguments to module(name, func): " + typeof name + ", " + typeof func);
			}
		};

		function reservedName(name) {
			return name === "instance" || name === "send";
		}

		LunarControl.prototype.context = function(name) {
			if (name === undefined) {
				/* Default context */
				if (_defaultContext === undefined) {
					_defaultContext = makeLunarContext(_moduleTemplates);
				}
				return _defaultContext;
			}

			if (typeof name === "string") {
				if (name === "") {
					/* Anonymous context */
					return makeLunarContext(_moduleTemplates);
				} else {
					/* Named context */
					var existing = _contexts[name];
					if (existing !== undefined) {
						return existing;
					}

					var context = makeLunarContext(_moduleTemplates);
					_contexts[name] = context;
					return context;
				}
			} else {
				throw exception("Invalid argument to context(name): " + typeof name);
			}
		};

		/** Returns a new instance of LunarControl, with no modules and no connection to this instance. 
		 */
		LunarControl.prototype.blank = function() {
			return makeLunarControl();
		};

		return new LunarControl();
	}

	function makeLunarContext(moduleTemplates) {
		var _modules = {};

		function LunarContext() {}

		LunarContext.prototype = {};

		LunarContext.prototype.instance = function(moduleName) {
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
				throw exception("Invalid argument type to instance(moduleName): " + typeof moduleName);
			}
		};

		LunarContext.prototype.send = function(funcName) {
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
				throw exception("Invalid argument type to send(funcName): " + typeof funcName);
			}
		};

		function createModule(template) {
			return template.func.apply(null, template.arguments);
		}

		var lunar = new LunarContext();

		/* Create modules */
		for (var name in moduleTemplates) {
			var module = createModule(moduleTemplates[name]);
			_modules[name] = module;
			lunar[name] = module;
		}

		/* Call init */
		lunar.send("$init", lunar);
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
