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
	var _modules = {};
	
	function module(name, func) {
		if (typeof func === "function") {
			var myArguments = Array.prototype.slice.call(arguments);
			var funcArguments = myArguments.slice(2);
			var module = func.apply(null, funcArguments);
			_modules[name] = module;
		} else {
			return _modules[name];
		}
	}

	function instance(name) {
		var moduleObject = module(name);
		var func = function() {};
		func.prototype = moduleObject;
		var result = new func();
		result.$new();
		return result;
	}
	
	function takeOff() {
		var modulesCopy = merge({}, _modules);
		call("$takeOff", modulesCopy);
	}
	
	function call(funcName) {
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
	
	var Lunar = window.Lunar = {
		module: module,
		instance: instance,
		takeOff: takeOff,
		call: call
	};
})(window);
