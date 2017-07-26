We can compose objects out of sets of parts. 
For example, we can make a function that can add simple event processing features to any object. 
It adds an on method, a fire method, and a private event registry:
	var eventuality = function (that) {
		var registry = {};
		that.fire = function (event) {
			// Fire an event on an object. 
			// The event can be either a string containing the name of the event or an object containing a type property containing the name of the event. 
			// Handlers registered by the 'on' method that match the event name will be invoked.
			var array, func, handler, i, type = typeof event === 'string' ? event : event.type;
			// If an array of handlers exist for this event, then loop through it and execute the handlers in order.
			if (registry.hasOwnProperty(type)) {
				array = registry[type];
				for (i = 0; i < array.length; i += 1) {
					handler = array[i];

					// A handler record contains a method and an optional array of parameters. 
					// If the method is a name, look up the function.
					func = handler.method;
					if (typeof func === 'string') {
						func = this[func];
					}

					// Invoke a handler. 
					// If the record contained parameters, then pass them. 
					// Otherwise, pass the event object.
					func.apply(this, handler.parameters || [event]);
				}
			}
			return this;
		};

		that.on = function (type, method, parameters) {
			// Register an event. 
			// Make a handler record. 
			// Put it in a handler array, making one if it doesn't yet exist for this type.
			var handler = {
				method: method,
				parameters: parameters
			};
			if (registry.hasOwnProperty(type)) {
				registry[type].push(handler);
			} else {
				registry[type] = [handler];
			}
			return this;
		};
	return that;
	};


We could call eventuality on any individual object, bestowing it with event handling methods. 
We could also call it in a constructor function before that is returned:
	eventuality(that);

In this way, a constructor could assemble objects from a set of parts. 
JavaScript’s loose typing is a big benefit here because we are not burdened with a type system that is concerned about the lineage of classes. 
Instead, we can focus on the character of their contents.
If we wanted eventuality to have access to the object’s private state, we could pass it the my bundle.