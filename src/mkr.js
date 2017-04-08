/*!
 * VERSION: 0.2.28
 * DATE: 2017-04-07
 * UPDATES AND DOCS AT: https://chris-moody.github.io/mkr
 *
 * @license copyright 2017 Christopher C. Moody
 *
 *	Permission is hereby granted, free of charge, to any person obtaining a copy of
 *	this software and associated documentation files (the "Software"), to deal in the
 *	Software without restriction, including without limitation the rights to use, copy,
 *	modify, merge, publish, distribute, sublicense, and/or sell copies of the Software,
 *	and to permit persons to whom the Software is furnished to do so, subject to the
 *	following conditions:
 *
 *	The above copyright notice and this permission notice shall be included in all
 *	copies or substantial portions of the Software.
 *
 *	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 *	INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
 *	PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 *	HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 *	OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 *	SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * 
 * @author: Christopher C. Moody, chris@moodydigital.com
 */

(function(global, className){
	var _instances={}, _count=-1;
	
	/**
	 * @class mkr
	 * @description Initializes a new mkr instance.
	 	<ul>
	 		<li>creates a div container, and appends it to the specified parent. @see container</li>
	 		<li>creates a TimelineMax instance</li>
	 	</ul>
	 * @classdesc A lightweight companion library to the {@link https://greensock.com/ greensock animation platform}, mkr delivers a 100% javascript method of content creation
	 * @param {Object} options - A set of attributes and css properties used to create the container. A few special properties are documented below.
	 * @param {Element} [options.parent=document.body] - Element the mkr instance container is appended to
	 * @param {Boolean} [options.preload=false] - When true, delays loading img elements until the instance's load function in called
	 * @param {Object=} options.css - CSS properties to apply to the container element.
	 * @param {Object=} options.attr - Attributes to apply to the container element.
	 * @param {String} [options.attr.class='mkr-container'] - Class string applied to the container element. Applied classes will always include 'mkr-container'
	 * @param {Object=} options.tmln - options passed to the built-in TimelineMax instance.
	 * @requires {@link https://greensock.com/tweenmax TweenMax}
	 * @returns {mkr} A new mkr instance.
	 */
	var mkr = function(options) {
        _count++;
		var id=_count;
		this._elements = [];
		this._states = {};
		this._count=0;
		this._tag = 'mkr-'+id+'-index';
		options = options || {};
		options.tmln = options.tmln || {};
		this._tmln = new TimelineMax(options.tmln);
		delete options.tmln;

		var parent = mkr.getDefault(options, 'parent', document.body);
		delete options.parent;
		if(typeof parent === 'string') parent = mkr.query(parent);

		this._preload = options.preload;
		delete options.preload;

		this._images = [];
		this._loadCallback = null;
		this._loadContext = null;
		var _loadedImages = 0;

		mkr.setDefault(options, 'attr', {});
		var classes = 'mkr-container mkr-'+id;
		'class' in options.attr ? options.attr.class += ' '+classes : options.attr.class = classes;

		/**
		 * @name mkr#container
		 * @type HTMLElement
		 * @description the default container element used to hold all elements added to/created by the mkr instance
		**/
		this.container = this.create("div", options, parent, true);

		_instances[id] = this;

		var _imageLoaded = function() {
			_loadedImages++;
			var self = _instances[id];
			if(_loadedImages == self._images.length) {
				if(self._loadCallback) {
					self._loadCallback.apply(self._loadContext);
				}
				_preload = false;
			}
		}

		/**
		 * @name mkr#id
		 * @public
		 * @readonly
		 * @type int
		 * @description internal id of this mkr instance
		**/
		Object.defineProperty(this, 'id', {
		    get: function() {
		      return id;
		    }
		});

		/**
		 * @function load
		 * @memberof mkr
		 * @instance
		 * @description When preloading is enabled, this function begins loading the instances img tags
		 * @param {function} callback - A callback function to call once loading is complete
		 * @param {Object=} context - Context on which the callback is executed (object that should represent the `this` variable inside callback function)
		**/
		this.load = function(callback, context) {
			this._loadCallback = callback;
			this._loadContext = context;

			var i = this._images.length;
			if(i <= 0) {
				this._loadCallback.apply(this._loadContext);
				return;
			}
			
			while(i--) {
				this._images[i].img.onload = _imageLoaded;
			}

			i = this._images.length;
			while(i--) {
				this._images[i].img.src = this._images[i].src;
			}
		};
	};

	/**
	 * @function makeDC
	 * @memberof mkr
	 * @static
	 * @description Factory method for quickly creating creatives that conform to DCS standards. Differs from the standard constructor in that it adds a border to the container, and sets a few default properties documented below.
	 * @param {Number} width - The width of the creative
	 * @param {Number} height - The height of the creative
	 * @param {Object} options - A set of attributes and css properties used to create the container. A few special properties and default values are documented below.
	 * @param {Element} [options.parent=document.body] - Element the mkr instance container is appended to
	 * @param {Boolean} [options.preload=false] - When true, delays loading img elements until the instance's load function in called
	 * @param {Object=} [options.border] - A set of attributes and css properties used to create the border

	 * @param {Object=} options.border.attr - Attributes to apply to the border element.
	 * @param {String} [options.border.attr.class='mkr.border'] - Class string applied to the border element. Applied classes will always include 'mkr-border'
	 * @param {Object=} options.border.css - CSS properties to apply to the border element.
	 * @param {Number} [options.border.css.left=0] - CSS left property
	 * @param {Number} [options.border.css.top=0] - CSS top property
	 * @param {int} [options.border.css.zIndex=10] - CSS z-index property
	 * @param {String} [options.border.css.borderWidth='1px'] - CSS border-width property
	 * @param {String} [options.border.css.borderStyle='solid'] - CSS border-style property
	 * @param {String} [options.border.css.borderColor='#666666'] - CSS border-color
	 * @param {String} [options.border.css.pointerEvents='none'] - CSS pointer-events
	 * @param {Number} [options.border.css.width=width] - CSS width
	 * @param {Number} [options.border.css.height=height] - CSS height
	 * @returns {mkr} The new mkr instance
	**/
	mkr.makeDC = function(width, height, options) {
		options = options || {};

		mkr.setDefault(options, 'border', {});
		mkr.setDefault(options.border, 'css', {});		
		mkr.setDefault(options.border.css, 'top', 0);
		mkr.setDefault(options.border.css, 'left', 0);
		mkr.setDefault(options.border.css, 'zIndex', 10);
		mkr.setDefault(options.border.css, 'position', 'absolute');
		mkr.setDefault(options.border.css, 'pointerEvents', 'none');
		mkr.setDefault(options.border.css, 'borderWidth', '1px');
		mkr.setDefault(options.border.css, 'borderStyle', 'solid');
		mkr.setDefault(options.border.css, 'borderColor', '#666666');
		var borderWidth = mkr.unitless(options.border.css.borderWidth);
		mkr.setDefault(options.border.css, 'width', width-borderWidth*2);
		mkr.setDefault(options.border.css, 'height', height-borderWidth*2);

		mkr.setDefault(options.border, 'attr', {});
		var classes = 'mkr-border';
		'class' in options.border.attr ? options.border.attr.class += ' '+classes : options.border.attr.class = classes;

		var border = document.createElement('div');
		TweenMax.set(border, options.border);
		/*TweenMax.set(dc.border, {attr:{class:'mkr-border'},
			css:{position:'absolute', pointerEvents:'none', zIndex:'1000',
			left:'0px', top:'0px', border:'1px solid #666666', width:width-2, height:height-2
		}});*/
		delete options.border;

		mkr.setDefault(options, 'attr', {});
		mkr.setDefault(options, 'css', {});
		mkr.setDefault(options.css, 'width', width);
		mkr.setDefault(options.css, 'height', height);
		mkr.setDefault(options.css, 'top', '0px');
		mkr.setDefault(options.css, 'left', '0px');
		mkr.setDefault(options.css, 'zIndex', 1);
		mkr.setDefault(options.css, 'overflow', 'hidden');

		var dc = new mkr(options);
		//dc.width = width;
		//dc.height = height;
		dc.border = border;
		dc.container.appendChild(dc.border);

		return dc;
	};

	/**
	 * @name mkr#tmln
	 * @public
	 * @type TimelineMax
	 * @description reference to this mkr's built-in TimelineMax instance
	**/
	Object.defineProperty(mkr.prototype, 'tmln', {
	    get: function() {
	      return this._tmln;
	    }
	});

	/**
	 * @name mkr#width
	 * @public
	 * @type Number
	 * @description pixel height of this mkr's container
	**/
	Object.defineProperty(mkr.prototype, 'width', {
	    get: function() {
	      return this.container.offsetWidth;
	    },
	    set: function(value) {
	      this.container.offsetWidth = value;
	    }

	});

	/**
	 * @name mkr#height
	 * @public
	 * @type Number
	 * @description pixel width of this mkr's container
	**/
	Object.defineProperty(mkr.prototype, 'height', {
	    get: function() {
	      return this.container.offsetHeight;
	    },
	    set: function(value) {
	      this.container.offsetHeight = value;
	    }
	});

	/**
	 * @function construct
	 * @memberof mkr.prototype
	 * @public
	 * @description Creates a new instance of a mkr construct
	 * @param {String} type - The type of construct to create.
	 * @param {Object=} options - A set of attributes, css, and other properties used to create the construct
	 * @param {Object=} options.css - CSS properties to apply to the new construct.
	 * @param {Object=} options.attr - Attributes to apply to the new construct.
	 * @param {*} [parent=this.container] - The element to append the new construct. Can be an element or a css selector string
	 * @returns {*} The new construct
	**/
	mkr.prototype.construct = function(type, options, parent) {
		options = options || {};
		parent = mkr.default(parent, this.container);

		return mkr.construct(type, options, parent, this);
	}

	/**
	 * @function create
	 * @memberof mkr.prototype
	 * @public
	 * @description Creates a new html element
	 * @param {String} type - The type of element to create.
	 * @param {Object=} options - A set of attributes and css properties used to create the element
	 * @param {Object=} options.css - CSS properties to apply to the new element.
	 * @param {Object=} options.attr - Attributes to apply to the new element.
	 * @param {*} [parent=this.container] - The element to append the new element. Can be an element or a css selector string
	 * @returns {Element} The new element
	**/
	mkr.prototype.create = function(type, options, parent) {
		options = options || {};
		parent = mkr.default(parent, this.container);

		var el;

		if(type === 'img' && this._preload && options.attr && options.attr.src) {
			var img = {src:options.attr.src}
			delete options.attr.src;
			el = mkr.create(type, options, parent);
			img.img = el;
			this._images.push(img);
			return el;
		}

		return mkr.create(type, options, parent);
	};

	/**
	 * @function batch
	 * @memberof mkr.prototype
	 * @public
	 * @description Creates a specified number of elements with the same parameters
	 * @param {String} type - The type of element to create.
	 * @param {Object=} options - A set of attributes and css properties used to create the elements
	 * @param {Number} num - The number of elements to produce
	 * @param {*=} parent - The element to append the new elements. Can be an element or a css selector string
	 * @returns {Array} An array containing the new elements
	**/
	mkr.prototype.batch = function(type, options, num, parent) {
		var elements = [];
		var n = num;
		while(n--) {
			elements.push(this.create(type, options, parent));
		}
		return elements;
	}

	/**
	 * @function kill
	 * @memberof mkr.prototype
	 * @public
	 * @description Kills this mkr's tweens, child tweens, and timeline. Removes all listeners and removes the container from the DOM
	**/
	mkr.prototype.kill = function() {
		TweenMax.killTweensOf(this);
		TweenMax.killTweensOf(this.container);
		TweenMax.killChildTweensOf(this.container);
		mkr.off('.mkr-'+this.id+' *');
		mkr.remove(this.container);
	};

    /**
	 * @function each
	 * @memberof mkr
	 * @static
	 * @description Executes the provided function for each target object
	 * @param {*} target - An single element, array of elements, or a css selector string.
	 * @param {*} callback - Function to execute for each object
	 * @param {Object=} context - Context on which the callback is executed (object that should represent the `this` variable inside callback function)
	**/
    mkr.each = function(target, callback, context) {
    	if(target == null || typeof target === 'undefined') {
			return;
		}
		var targets;
		if(typeof target === 'string') targets = mkr.queryAll(target);
		else if(Array.isArray(target)) targets = target;
		else targets = [target];
		//console.log(targets);
		forEach(targets, callback, context);
    };

    var forEach = function(arrayLike, callback, context) {
    	for(var i = 0; i < arrayLike.length; i++) {
    		callback.call(context, arrayLike[i], i)
    	}
    };

	/**
	 * @function on
	 * @memberof mkr
	 * @static
	 * @description Add a listener to one or many objects
	 * @param {*} target - An single element, array of elements, or a css selector string.
	 * @param {String} type - A string representing the type of event the listener is associated with
	 * @param {Function} callback - The function to be executed when the associated event is fired
	 * @param {Object=} context - Context on which the callback is executed (object that should represent the `this` variable inside callback function)
	 * @param {Number} [priority=0] - Affects callback execution order. Higher priority listeners are executed before those with lower priority. Listeners of the same priority are executed in order of insertion
	**/
	mkr.on = function(target, type, callback, context, priority) {
		mkr.each(target, function(el) {
			//console.log(el, type);
			var cxt = mkr.default(context, el);
			mkr._triggerMatrix.add(el, type, callback, cxt, priority);
			//el.addEventListener(eventType, callback, false);
		});
	};

	/**
	 * @function once
	 * @memberof mkr
	 * @static
	 * @description Add a listener to one or many objects that only executes once per object
	 * @param {*} target - An single element, array of elements, or a css selector string.
	 * @param {String} type - A string representing the type of event the listener is associated with
	 * @param {Function} callback - The function to be executed when the associated event is fired
	 * @param {Object=} context - Context on which the callback is executed (object that should represent the `this` variable inside callback function)
	 * @param {Number} [priority=0] - Affects callback execution order. Higher priority listeners are executed before those with lower priority. Listeners of the same priority are executed in order of insertion
	**/
	mkr.once = function(target, type, callback, context, priority) {
		mkr.each(target, function(el) {
			var cxt = mkr.default(context, el);
			mkr._triggerMatrix.addOnce(el, type, callback, cxt, priority);
			//el.addEventListener(eventType, callback, false);
		});
	};

	/**
	 * @function off
	 * @memberof mkr
	 * @static
	 * @description Remove listeners from one or many objects. Behaves differently depending on the number of passed arguments.
	 * - 3+ arguments: Only removes the specified listener from the target
	 ^ - First 2 arguments only: Removes all listeners of provdied event type
	 * - First argument only: Removes all listeners from the target
	 * @param {*} target - An single element, array of elements, or a css selector string.
	 * @param {String=} type - The event type. Excluding this this argument removes all listeners from the target regardless of type.
	 * @param {Function=} callback - The callback to remove. Excluding this argument removes all listeners of the specified from the target
	 * @param {Object=} context - Context on which the callback is executed (object that should represent the `this` variable inside callback function)
	**/
	mkr.off = function(target, type, callback, context) {
		var func;
		if(type === undefined) func = mkr._triggerMatrix.delete.bind(mkr._triggerMatrix);
		else if(callback === undefined) func = mkr._triggerMatrix.removeAll.bind(mkr._triggerMatrix);
		else func = mkr._triggerMatrix.remove.bind(mkr._triggerMatrix);

		mkr.each(target, function(el) {
			var cxt = mkr.default(context, el);
			func(el, type, callback, cxt);
			//el.removeEventListener(eventType, callback, false);
		});
	};

	/**
	 * @function clearListeners
	 * @memberof mkr
	 * @static
	 * @description Removes all listeners managed by mkr across all mkr instances. Its a good idea to be sure that you want to do this.
	**/
	mkr.clearListeners = function() {
		mkr._triggerMatrix.clear();
	};

	/**
	 * @function reveal
	 * @memberof mkr
	 * @static
	 * @description shortcut for revealing scrollable content.
	 * @param {*} target - A selector string, Array, or element
	 * @param {Object=} options - An optional set of attributes and css properties applied to the target
	 * @param {Object=} parentOpts - An optional set of attributes and css properties applied to every parent of the target
	**/
    mkr.reveal = function(target, options, parentOpts) {
    	if(options) TweenMax.set(target, options);
    	parentOpts = parentOpts || {};
    	mkr.setDefault(parentOpts, 'overflowY', 'visible');

		mkr.each(target, function(el) {
			var parent = el.parentNode;
			while(parent) {
				parentOpts.height = parent.scrollHeight+1;
				TweenMax.set(parent, parentOpts);
				//TweenMax.set(parent, {overflowY:'visible', height:parent.scrollHeight+1});
				parent = parent.parentNode;
			}
		});
    };
    
    /**
	 * @function scroll
	 * @memberof mkr
	 * @static
	 * @description Tweens the scrollable area of targets at the specified speed in px/s. Can target multiple objects
	 * @param {*} target - A selector string, Array, or element
	 * @param {Number} [speed=14] - The speed of the tween in px/s
	 * @param {Object=} options - Additional properties passed to the tween
	 * @returns {Array} An array of tweens created to facilitate the animation
	**/
    mkr.scroll = function(target, speed, options) {
    	options = options || {};
		mkr.setDefault(options, 'scrollTo', 'max');
		mkr.setDefault(options, 'ease', Power0.easeNone);
		speed = mkr.default(speed, 14);

		var tweens = [];
		mkr.each(target, function(el) {
			var scrollTime = el.scrollHeight/speed;
			tweens.push(TweenMax.to(el, scrollTime, options));
			//duration = Math.max(duration, scrollTime);
		});
		return tweens;
    };

	/**
	 * @function extend
	 * @memberof mkr
	 * @static
	 * @description shortcut for creating class extensions using protoypal inheritance
	 * @param {Object} baseObj - The object to be extended
	 * @returns {Object}
	**/
	mkr.extend = function(baseObj) {
		if (typeof Object.create !== 'function') {
		    Object.create = function (o) {
		        function F() {}
		        F.prototype = o;
		        return new F();
		    };
		}
		newObj = Object.create(baseObj);
	};

	/**
	* @function query
	* @memberof mkr
	* @static
	* @description Returns the first element within the baseElement that matches the specified selectors. element.querySelector(selectors) shortcut
	* @param {String} selectors - A string containing one or more CSS selectors separated by commas.
	* @param {Element} [baseElement=document] - The ancestor element to search. Defaults to the document object
	* @returns {Element} The first element within the baseElement that matches the specified selectors.
	*/
	mkr.query = function(selectors, baseElement) {
		baseElement = baseElement || document;
		return baseElement["querySelector"](selectors);
	};

	/**
	 * @function queryAll
	 * @memberof mkr
	 * @static
	 * @description Returns a NodeList of all elements within the baseElement that match the specified selectors. element.querySelectorAll(selectors) shortcut
	 * @param {String} selectors - A string containing one or more CSS selectors separated by commas.
	 * @param {Element} [baseElement=document] - The ancestor element to search. Defaults to the document object
	 * @returns {NodeList} A NodeList of all elements within the baseElement that match the specified selectors.
	**/
	mkr.queryAll = function(selectors, baseElement) {
		baseElement = baseElement || document;
		return baseElement["querySelectorAll"](selectors);
	};

	/**
	 * @function construct
	 * @memberof mkr
	 * @static
	 * @description Creates a new instance of a mkr construct
	 * @param {String} type - The type of construct to create.
	 * @param {Object=} options - A set of attributes, css, and other properties used to create the construct
	 * @param {Object=} options.css - CSS properties to apply to the new construct.
	 * @param {Object=} options.attr - Attributes to apply to the new construct.
	 * @param {*=} parent - The element to append the new construct. Can be an element or a css selector string
	 * @returns {*} The new construct
	**/
	mkr.construct = function(type, options, parent) {
		if(type in mkr._constructs) {
			mkr.setDefault(options, 'parent', parent);
			return new mkr._constructs[type](options);
		}
		console.warn(type, 'not found!');
		return null;
	}
	mkr._constructs = {};
	Object.defineProperty(mkr, 'constructs', {
	    get: function() {
	      return mkr._constructs;
	    }
	});

	/**
	 * @function create
	 * @memberof mkr
	 * @static
	 * @description Creates a new html element
	 * @param {String} type - The type of element to create.
	 * @param {Object=} options - A set of attributes and css properties used to create the element
	 * @param {Object=} options.css - CSS properties to apply to the new object.
	 * @param {Object=} options.attr - Attributes to apply to the new object.
	 * @param {*} [parent=null] - The element to append the new element. Can be an element or a css selector string
	 * @returns {Element} The new element
	**/
	mkr.create = function(type, options, parent) {
		var t = type.toLowerCase();
		options = options || {};
		options = mkr.merge(options, mkr.defaults);

		parent = mkr.default(parent, null);
		if(typeof parent === 'string') parent = mkr.query(parent);

		var xlnkns = 'http://www.w3.org/1999/xlink'
		var svgns = 'http://www.w3.org/2000/svg';
		var svgTags = ['svg', 'defs', 'use', 'image', 'g', 'mask', 'clippath', 'lineargradient', 'radialgradient', 'stop', 'text', 'rect', 'circle', 'ellipse', 'line', 'polyline', 'polygon', 'path'];
		var element;
		if(svgTags.indexOf(t) >= 0) {
			element = document.createElementNS(svgns, type);
			//if(type == 'svg') options.css.position = options.css.position || "absolute";

			if('xlink:href' in options.attr) {
				element.setAttributeNS(xlnkns, 'href', options.attr['xlink:href']);
				delete options.attr['xlink:href'];
			}
		}
		else {
			element = document.createElement(type);
		}

		TweenMax.set(element, options);
		mkr.add(element, parent);
	
		return element;
	};

	/**
	 * @function add
	 * @memberof mkr
	 * @static
	 * @description Adds an existing element to the specified parent
	 * @param {String} target - An single element, array of elements, or a css selector string.
	 * @param {Element} [parent=document.body] - The ancestor element to search. Defaults to the document object
	 * @param {int=} index - Where in the parent to add the element. Defaults to the end.
	 * @returns {*} The added element, or array of eleements
	**/
	mkr.add = function(target, parent, index) {
		parent = mkr.default(parent, document.body);
		var targets = [];

		if(!parent) {
			mkr.each(target, function(el) {
				targets.push(el);
			});
		}
		else {
			if(typeof parent === 'string') parent = mkr.query(parent);
			index = mkr.default(index, parent.childNodes.length);

			mkr.each(target, function(el) {
				parent.insertBefore(el, parent.childNodes[index]);
				targets.push(el);
			});
		}
		return targets.length > 1 ? targets : targets[0];
	};

	/**
	 * @function remove
	 * @memberof mkr
	 * @static
	 * @description Removes an existing element from the DOM
	 * @param {String} target - An single element, array of elements, or a css selector string.
	 * @returns {Element} The removed  element, or array of eleements
	**/
	mkr.remove = function(target) {
		var targets = [];
		mkr.each(target, function(el) {
			targets.push(el.parentNode.removeChild(el));
		});
		return targets.length > 1 ? targets : targets[0];
	};

	/**
	 * @function default
	 * @memberof mkr
	 * @static
	 * @description Examines provided value and returns the fallback if it is undefined
	 * @param {String} value - The value to examine
	 * @param {String} value - The fallback value
	 * @returns {*} returns value or the fallback if it is undefined
	**/
	mkr.default = function(value, fallback) {
		return value === undefined ? fallback : value;
	};

	/**
	 * @function getDefault
	 * @memberof mkr
	 * @static
	 * @description Returns target[key] or value if target[key] has not be defined
	 * @param {Object} target - The target of this operation
	 * @param {String} key - The name of the property being set
	 * @param {String} value - The value to set
	 * @returns {*} target[key] or value if target[key] has not be defined
	**/
	mkr.getDefault = function(target, key, value) {
		/*if(!(key in target)) {
			return val;
		}
		return target[key]*/
		return mkr.default(target[key], value);
	};

	/**
	 * @function setDefault
	 * @memberof mkr
	 * @static
	 * @description Sets the the value of target[key] to value if key has not already been assigned
	 * @param {Object} target - The target of this operation
	 * @param {String} key - The name of the property being set
	 * @param {String} value - The value to set
	 * @returns {*} The value of target[key]
	**/
	mkr.setDefault = function(target, key, value) {
		target[key] = mkr.default(target[key], value);
		return target[key];
	};

	/**
	 * @function createStyleSheet
	 * @memberof mkr
	 * @private
	 * @description Creates the style sheet mkr uses for dynamic styles
	 * @returns {StyleSheet} The new stylesheet
	**/
	var createStyleSheet = function() {	
		var style = document.createElement('style');		
		style.appendChild(document.createTextNode(''));
		document.head.appendChild(style);
		return style.sheet;
	};

	/**
	 * @function addRule
	 * @memberof mkr
	 * @static
	 * @description Adds a CSS rule to mkr's global stylesheet.
	 * @param {String} selector - A selector string, that the rule should target
	 * @param {Object} styles - The styles to add to the new rule
	 * @param {int=} index - The index at which to insert the rule.
	 * @returns {int} The index of the newly inserted rule
	 * @requires {@link https://greensock.com/cssruleplugin CSSRulePlugin}
	**/
    mkr.addRule = function(selector, styles, index) {
    	//var ruleString = JSON.stringify(styles).replace(/\"/g, '');
    	index = index === undefined ? mkr.styles.cssRules.length : index;
		//mkr.styles.insertRule(selector + "{" + styles + "}", index);
		var rules = selector+"{}";
		var n = -1;
		try {
			n = mkr.styles.insertRule(rules, index);
			var rule = mkr.styles.cssRules[n].style;//CSSRulePlugin.getRule(selector);
			TweenMax.set(rule, {cssRule:styles});
		}
		catch(e){console.warn(e)};
		return n;
	};

	/**
	 * @function removeRule
	 * @memberof mkr
	 * @static
	 * @description Traverses mkr's stylesheet and removes first rule to match the selector.
	 * @param {String} selector - The selector text of the rule to remove.
	**/
    mkr.removeRule = function(selector) {
    	var index = mkr.findRule(selector);
    	if(index > -1) {
    		mkr.styles.deleteRule(index);
    	}
	};

	/**
	 * @function hasClass
	 * @memberof mkr
	 * @static
	 * @description Tests whether the target element has the indicated class assigned
	 * @param {*} target - An single element, or a css selector string.
	 * @param {String} className - A string representing the class to search for.
	**/
    mkr.hasClass = function(target, className) {
    	if(typeof target === 'string') target = mkr.query(target);
    	if(!target) return false;

    	return target.className.split(' ').indexOf(className); 
	};

	/**
	 * @function deleteRule
	 * @memberof mkr
	 * @static
	 * @description Delete the CSS rule at the specified index.
	 * @param {int=} index - The index the rule to remove.
	**/
    mkr.deleteRule = function(index) {
		mkr.styles.deleteRule(index);
	};

	/**
	 * @function findRule
	 * @memberof mkr
	 * @static
	 * @description Traverses mkr's stylesheet and returns the index of the first rule to match the selector. Returns -1 if the rule is not found.
	 * @param {String} selector - Selector used to search the stylesheet
	 * @returns {int} index - The index of the rule or -1 if not found.
	**/
    mkr.findRule = function(selector) {
    	var len = mkr.styles.cssRules.length;
    	for(var i=0; i < len; i++) {
    		if(selector === mkr.styles.cssRules[i].selectorText) {
    			return i;
    		}
    	}
    	return -1;
	};

	/**
	 * @function getRule
	 * @memberof mkr
	 * @static
	 * @description Alias for CSSRulePlugin.getRule. Returns the CSSRules that match the provided selector
	 * @param {String} selector - A selector string by which to select rules
	 * @returns {CSSStyleDeclaration} - The matched rule(s)
	 * @requires {@link https://greensock.com/cssruleplugin CSSRulePlugin}
	**/
    mkr.getRule = function(selector) {
    	return CSSRulePlugin.getRule(selector);
	};

	/**
	 * @function setRule
	 * @memberof mkr
	 * @static
	 * @description Updates the matched CSSRules with the provided styles
	 * @param {String} selector - A selector string, that the rule should target
	 * @param {Object} styles - The styles to set of the matched rules
	 * @requires {@link https://greensock.com/cssruleplugin CSSRulePlugin}
	**/
    mkr.setRule = function(selector, styles) {
    	var rule = CSSRulePlugin.getRule(selector);
    	if(rule) {
			TweenMax.set(rule, {cssRule:styles});
		}
	};

	/**
	 * @function merge
	 * @memberof mkr
	 * @static
	 * @description Merges one object into another, optionally overwriting overlapping keys. This utility method should only be used on objects holding primitive values!
	 * @param {Object} base - the base object
	 * @param {Object} merger - The styles to set of the matched rules
	 * @param {Boolean} [overwrite=false] - Whether to overwrite overlapping values
	 * @returns {Object} The resulting merge
	**/
	mkr.merge = function(base, merger, overwrite) {
		overwrite = mkr.default(overwrite, false);
		var res = mkr.clone(base);

		for(var key in merger) {
			if(base[key] !== undefined) {//if key is defined
				if(typeof base[key] === 'object') {//if both values are objects
					if(typeof merger[key] === 'object')
						res[key] = mkr.merge(base[key], mkr.clone(merger[key]), overwrite);//set value to their merge
					else if(override) res[key] = merger[key]
				}
				else if(!overwrite) {continue;}
				else res[key] = merger[key];
			}
			else res[key] = merger[key];
		}
		return res;
	};

	/**
	 * @function clone
	 * @memberof mkr
	 * @static
	 * @description Clones an object. This utility method should only be used on objects holding primitive values!
	 * @param {Object} base - The object to clone
	 * @returns {Object} The clone
	**/
	mkr.clone = function(base) {
		return JSON.parse(JSON.stringify(base));
	};

	mkr._units = /(\-?\d+(\.\d+)?)([A-z%]*)/gi;
	/**
	 * @function unit
	 * @memberof mkr
	 * @static
	 * @description Evaluates the provided value and returns the unit suffix it implements
	 * @param {*} value - The value to evaluate
	 * @returns {String} The unit suffix
	**/
    mkr.unit = function(value) {
    	return String(value).replace(mkr._units, '$3');
	};

	/**
	 * @function unitless
	 * @memberof mkr
	 * @static
	 * @description Evaluates the provided value and returns a number without a unit suffix
	 * @param {*} value - The value to evaluate
	 * @returns {Number} The numerical value without the unit suffix
	**/
    mkr.unitless = function(value) {
    	return String(value).replace(mkr._units, '$1');
	};

	/**
	 * @function unitize
	 * @memberof mkr
	 * @static
	 * @description Evaluates the provided value and returns a string appended with the unit suffix
	 * @param {*} value - The value to evaluate
	 * @param {String} [unit='px'] - The unit suffix to append
	 * @param {Boolean} [override=true] - Whether to replace an existing unit suffix
	 * @returns {String} The provided value appended with the unit suffix
	**/
    mkr.unitize = function(value, unit, override) {
    	unit = mkr.default(unit, 'px');
    	override = mkr.default(override, true);

    	if(override) return String(value).replace(mkr._units, '$1'+unit);

    	var parts = String(value).replace(mkr._units, '$1 $3').split(' ');
    	unit = (parts[1] && parts[1].length > 0) ? parts[1] : unit;
    	return parts[0]+unit;
	};

	/**
	 * @function setPolyPath
	 * @memberof mkr
	 * @static
	 * @description Shortcut method for dynamically setting the target's clipPath using the polygon func. Useful for animating clipath arrays
	 * @param {Element} target - Target for clipPath
	 * @param {Array} points - Array of points to be used as the clipPath
	 * @param {unit} [unit=%] - The unit of measure to be used in the clipPath
	**/
	mkr.setPolyClipPath = function(target, points, unit) {
		if([null, undefined].indexOf(target) < 0 || [null, undefined].indexOf(points) < 0)
			return;

		unit = unit === undefined ? '%' : unit;
		var clipPath = 'polygon(';
		var len = points.length;
		for(var i = 0; i < len; i++) {
			clipPath += points[i]+unit;
			if(i < len-1) {
				clipPath += i%2==0?' ':',';
			}
		}
		clipPath += ')';
		TweenMax.set(target, {clipPath:clipPath});
	};

	/**
	 * @function distance
	 * @memberof mkr
	 * @static
	 * @description Calculates the distance between two points
	 * @param {Number} x1 - The x-coordinate of the first point
	 * @param {Number} y1 - The y-coordinate of the first point
	 * @param {Number} x2 - The x-coordinate of the second point
	 * @param {Number} y2 - The y-coordinate of the second point
	 * @returns {Number} The distance between the two points
	 *
	**/
	mkr.distance = function(x1, y1, x2, y2) {
		return Math.sqrt(Math.pow(x2-x1, 2) + Math.pow(y2-y1, 2));
	};

	/**
	 * @function rotation
	 * @memberof mkr
	 * @static
	 * @description Calculates the angle(in radians) between two points
	 * @param {Number} x1 - The x-coordinate of the first point
	 * @param {Number} y1 - The y-coordinate of the first point
	 * @param {Number} x2 - The x-coordinate of the second point
	 * @param {Number} y2 - The y-coordinate of the second point
	 * @returns {Number} The angle(in radians) between the two points
	 *
	**/
	mkr.rotation = function(x1, y1, x2, y2) {
		var dx = x2-x1;
		var dy = y2-y1;
		return Math.atan2(dy, dx);
	};

	/**
	 * @function angle
	 * @memberof mkr
	 * @static
	 * @description Calculates the angle(in degrees) between two points
	 * @param {Number} x1 - The x-coordinate of the first point
	 * @param {Number} y1 - The y-coordinate of the first point
	 * @param {Number} x2 - The x-coordinate of the second point
	 * @param {Number} y2 - The y-coordinate of the second point
	 * @returns {Number} The angle(in degrees) between the two points
	 *
	**/
	mkr.angle = function(x1, y1, x2, y2) {
		var ang = mkr.rotation(x1, y1, x2, y2)*mkr.DEG;
		return ang;
	};

	/**
	 * @function randomRange
	 * @memberof mkr
	 * @static
	 * @description returns a random number between the supplied min and max values
	 * @param {Number} min - The minimum value
	 * @param {Number} max - The maximum value
	 * @returns {Number} A random number between the supplied min and max values
	 *
	**/
	mkr.randomRange = function(min, max) {
        return Math.floor(Math.random() * (max - min + 0.99)) + min;
    };

	/**
	 * @alias mkr.RAD
	 * @memberof mkr
	 * @static
	 * @type Number
	 * @description Mathematical constant for converting degrees to radians
	**/
	mkr.RAD = Math.PI/180;

	/**
	 * @alias mkr.DEG
	 * @memberof mkr
	 * @static
	 * @type Number
	 * @description Mathematical constant for converting radians to degrees
	**/
	mkr.DEG = 180/Math.PI;

    /**
	 * @name mkr.styles
	 * @memberof mkr
	 * @static
	 * @readonly
	 * @type StyleSheet
	 * @description mkr's dynamic stylesheet. Used by mkr.addRule
	**/
	Object.defineProperty(mkr, 'styles', {
	    get: function() {
	      return mkr._styles;
	    }
	});

	mkr._styles = createStyleSheet();

	/**
	 * @name mkr.rules
	 * @memberof mkr
	 * @static
	 * @readonly
	 * @type CSSRuleList
	 * @description mkr's dynamic stylesheet rules.
	**/
	Object.defineProperty(mkr, 'rules', {
	    get: function() {
	      return mkr.styles.cssRules;
	    }
	});

	/**
	 * @name mkr.defaults
	 * @memberof mkr
	 * @static
	 * @readonly
	 * @type Object
	 * @property {Boolean} [force3d=true] - force3d true for all elements by default, Smooths transforms.
	 * @property {Object} [attr={}] - attributes applied to all created elements
	 * @property {Object} [css={}] - styles applied to all created elements
	 * @property {String} [css.position='absolute'] - All elements created my mkr are positioned absolutely by default
	 * @description Default css and attributes applied to HTMLElements and SVGs. Set keys to change defaults settings for created elements
	**/
	Object.defineProperty(mkr, 'defaults', {
	    get: function() {
	      return mkr._defaults;
	    }
	});
	mkr._defaults = {
		force3d:true,
		css:{position:'absolute'},
		attr:{}
	};

    (function(className, scope) {
	    var SignalManager = function (options) {
	        var _signals = {};

	        this.register = function (signalId) {
	            if(!(signalId in _signals)) {
	                _signals[signalId] = new signals.Signal();
	            }
	        };

	        this.add = function (signalId, listener, context, priority, isOnce) {
	            if(!(signalId in _signals)) {
	                _signals[signalId] = new signals.Signal();
	            }

	            var signal = _signals[signalId];
	            context = context || null;
	            priority = priority || 0;
	            isOnce = isOnce === undefined
	            return signal.add(listener, context, priority);
	        };

	        this.addOnce = function (signalId, listener, context, priority) {
	            if(!(signalId in _signals)) {
	                _signals[signalId] = new signals.Signal();
	            }

	            var signal = _signals[signalId];
	            context = context || null;
	            priority = priority || 0;

	            return signal.addOnce(listener, context, priority);
	        };

	        this.dispatch = function (signalId, params) {
	            if(!(signalId in _signals)) {
	                return;
	            }

	            _signals[signalId].dispatch.apply(null, Array.prototype.slice.call(arguments, 1));
	        };

	        this.dispose = function (signalId) {
	            if(!(signalId in _signals)) {
	                return;
	            }

	            _signals[signalId].dispose();
	            delete _signals[signalId];
	        };

	        this.forget = function (signalId) {
	            if(!(signalId in _signals)) {
	                return;
	            }

	            _signals[signalId].forget();
	        };

	        this.getNumListeners = function (signalId) {
	            if(!(signalId in _signals)) {
	                return 0;
	            }

	            return _signals[signalId].getNumListeners();
	        };

	        this.halt = function (signalId) {
	            if(!(signalId in _signals)) {
	                return;
	            }

	            _signals[signalId].halt();
	        };

	        this.has = function (signalId, listener, context) {
	            if(!(signalId in _signals)) {
	                return false;
	            }
	            context = context || null;
	            return _signals[signalId].has(listener, context);
	        };

	        this.remove = function (signalId, listener, context) {
	            if(!(signalId in _signals)) {
	                return;
	            }
	            context = context || null;
	            _signals[signalId].remove(listener, context);
	        };

	        this.removeAll = function (signalId) {
	            if(!(signalId in _signals)) {
	                return;
	            }

	            _signals[signalId].removeAll();
	        };

	        this.destroy = function () {
	            for(sigId in _signals) {
	                _signals[sigId].dispose();
	                delete _signals[sigId];
	            }
	        };
	    };

	    scope[className] = SignalManager;
	    return SignalManager;
	})('SignalManager', mkr);

	(function(global, className){
		var _instances={}, _count=-1, _uid=-1;
		
		var map = function() {
			Object.defineProperty(this, '_id', {
				enumerable: false,
				value: ++_count
			});
			
			this._dict = {};
			this._keys = {};
			
			_instances[this._id] = this;
		};
		
		map.prototype = {
			get: function(key) {
				if(typeof key === 'string') {
					return this._dict[key];
				}
				if(key._mkrmapid === undefined) {
					return undefined;
				}
				return this._dict[key._mkrmapid];
			},
			set: function(key, value) {
				if(typeof key === 'string') {
					this._dict[key] = value;
				}
				else {
					if(key._mkrmapid === undefined) {
						Object.defineProperty(key, '_mkrmapid', {
							enumerable: false,
							value: ++_uid,
							configurable: true
						});
					}
					this._keys[key._mkrmapid] = key;
					this._dict[key._mkrmapid] = value;
				}
				
				return this;
			},
			has: function(key) {
				if(typeof key === 'string') {
					return (key in this._dict);
				}
				if(key._mkrmapid === undefined) {
					return false;
				}
				return  (key._mkrmapid in this._dict);
			},
			delete: function(key) {
				var flag = this.has(key);
				
				if(typeof key === 'string') {
					delete this._dict[key];
				}
				if(key._mkrmapid === undefined) {
					return false;
				}
				delete this._keys[key._mkrmapid];
				delete this._dict[key._mkrmapid];
				delete key._mkrmapid;
				
				return flag;
			},
			clear: function() {
				for(var key in this._dict) {
					if(key in this._keys) {
						this.delete(this._keys[key]);
						continue;
					}
					this.delete(key);
				}
			},
			forEach: function(callback, context) {
				for(var key in this._dict) {
					var target = (key in this._keys) ? this._keys[key] : key;
					callback.apply(context, [this._dict[key], target, this]);
				}
			}
		}
		
		global[className] = map;
		return map;
	})(mkr, 'map');

	(function(className, scope) {
	  	var matrix = function(options) {
	    	this._mngrs = new mkr.map();
	    	
	    	//add a listener
			this.add = function(target, type, listener, context, priority, isOnce) {
				isOnce = isOnce === undefined ? false : isOnce;
				if(!this._mngrs.has(target)){
					this._mngrs.set(target, {signals:new scope.SignalManager(), triggers:{}});
				}
				var mngr = this._mngrs.get(target);

				var trigger;
				if(mngr.triggers.hasOwnProperty(type)) { //clear existing trigger
					trigger = mngr.triggers[type];
					target.removeEventListener(type, trigger);
					delete mngr.triggers[type];
				}

				if(isOnce) {
					trigger = function(e) {
						mngr.signals.dispatch(type, e);
						if(mngr.signals.getNumListeners(type) == 0) {
			              	target.removeEventListener(type, trigger);
			              	delete mngr.triggers[type];
			            }
					};

					mngr.signals.addOnce(type, listener, context, priority);
				}
				else {
					trigger = function(e){mngr.signals.dispatch(type, e)};
					mngr.signals.add(type, listener, context, priority);
				}

				target.addEventListener(type, trigger);
				mngr.triggers[type] = trigger;
			};
	    	
	    	//add a listener that removes itself after te 1st trigger
			this.addOnce = function(target, type, listener, context, priority) {
				this.add(target, type, listener, context, priority, true);
			};

			//remove a single listener
			this.remove = function(target, type, listener, context) {
				if(!this._mngrs.has(target)) { //no listeners for target exist
					return;
				}
				var mngr = this._mngrs.get(target);

				if(!mngr.triggers.hasOwnProperty(type)) { //no listeners of type
					return;
				}
				if(!mngr.signals.has(type, listener, context)) { //not here to remove
					return;
				}
        		
        		mngr.signals.remove(type, listener, context);

		        //remove trigger if no more listeners are attached
		        if(mngr.signals.getNumListeners(type) == 0) {
		          	var trigger = mngr.triggers[type];
		          	target.removeEventListener(type, trigger);
		          	delete mngr.triggers[type];
		        }
			}

			//remove all listeners on a target of the specified type
			this.removeAll = function(target, type) {
				if(!this._mngrs.has(target)) { //no listeners for target exist
					return;
				}
				var mngr = this._mngrs.get(target);

				if(!mngr.triggers.hasOwnProperty(type)) { //no listeners of type
					return;
				}
        		
        		mngr.signals.removeAll(type);
        		var trigger = mngr.triggers[type];
	          	target.removeEventListener(type, trigger);
	          	delete mngr.triggers[type];
			}

			//remove all listeners for a target
		    this.delete = function(target) {
				if(!this._mngrs.has(target)) { //no listeners for target exist
					return;
				}
				var mngr = this._mngrs.get(target);

				for(var type in mngr.triggers) {
					var trigger = mngr.triggers[type];
					target.removeEventListener(type, trigger);
					delete mngr.triggers[type];
				}	      
				mngr.signals.destroy();
				this._mngrs.delete(target);
		  	}

		  	//clear the entire matrix of listeners
		  	this.clear = function() {
		  		var self = this;
		  		this._mngrs.forEach(function(value, target, map) {
		  			self.delete(target);
		  		});
		  	}
		};

		scope[className] = matrix;
		return matrix;
	})('TriggerMatrix', mkr);

	/**
	* @alias mkr._triggerMatrix
	* @memberof mkr
	* @private
	* @static
	* @type TriggerMatrix
	* @description mkr's internal event trigger matrix
	**/
	mkr._triggerMatrix = new mkr.TriggerMatrix();

	/**
	* @alias mkr.VERSION
	* @memberof mkr
	* @static
	* @readonly
	* @type String
	* @description returns mkr's version number
	**/
	Object.defineProperty(mkr, 'VERSION', {
	    get: function() {
	      return '0.2.28';
	    }
	});

    if(typeof define === 'function' && define.amd){ //AMD
        define(function () { return mkr; });
    } else if (typeof module !== 'undefined' && module.exports){ //node
        module.exports = mkr;
    } else { //browser
        global[className] = mkr;
    }
})(this, 'mkr');

/*!JS Signals <http://millermedeiros.github.com/js-signals/> @license Released under the MIT license Author: Miller MedeirosVersion: 1.0.0 - Build: 268 (2012/11/29 05:48 PM)*/
(function(i){function h(a,b,c,d,e){this._listener=b;this._isOnce=c;this.context=d;this._signal=a;this._priority=e||0}function g(a,b){if(typeof a!=="function")throw Error("listener is a required param of {fn}() and should be a Function.".replace("{fn}",b));}function e(){this._bindings=[];this._prevParams=null;var a=this;this.dispatch=function(){e.prototype.dispatch.apply(a,arguments)}}h.prototype={active:!0,params:null,execute:function(a){var b;this.active&&this._listener&&(a=this.params?this.params.concat(a):
a,b=this._listener.apply(this.context,a),this._isOnce&&this.detach());return b},detach:function(){return this.isBound()?this._signal.remove(this._listener,this.context):null},isBound:function(){return!!this._signal&&!!this._listener},isOnce:function(){return this._isOnce},getListener:function(){return this._listener},getSignal:function(){return this._signal},_destroy:function(){delete this._signal;delete this._listener;delete this.context},toString:function(){return"[SignalBinding isOnce:"+this._isOnce+
", isBound:"+this.isBound()+", active:"+this.active+"]"}};e.prototype={VERSION:"1.0.0",memorize:!1,_shouldPropagate:!0,active:!0,_registerListener:function(a,b,c,d){var e=this._indexOfListener(a,c);if(e!==-1){if(a=this._bindings[e],a.isOnce()!==b)throw Error("You cannot add"+(b?"":"Once")+"() then add"+(!b?"":"Once")+"() the same listener without removing the relationship first.");}else a=new h(this,a,b,c,d),this._addBinding(a);this.memorize&&this._prevParams&&a.execute(this._prevParams);return a},
_addBinding:function(a){var b=this._bindings.length;do--b;while(this._bindings[b]&&a._priority<=this._bindings[b]._priority);this._bindings.splice(b+1,0,a)},_indexOfListener:function(a,b){for(var c=this._bindings.length,d;c--;)if(d=this._bindings[c],d._listener===a&&d.context===b)return c;return-1},has:function(a,b){return this._indexOfListener(a,b)!==-1},add:function(a,b,c){g(a,"add");return this._registerListener(a,!1,b,c)},addOnce:function(a,b,c){g(a,"addOnce");return this._registerListener(a,
!0,b,c)},remove:function(a,b){g(a,"remove");var c=this._indexOfListener(a,b);c!==-1&&(this._bindings[c]._destroy(),this._bindings.splice(c,1));return a},removeAll:function(){for(var a=this._bindings.length;a--;)this._bindings[a]._destroy();this._bindings.length=0},getNumListeners:function(){return this._bindings.length},halt:function(){this._shouldPropagate=!1},dispatch:function(a){if(this.active){var b=Array.prototype.slice.call(arguments),c=this._bindings.length,d;if(this.memorize)this._prevParams=
b;if(c){d=this._bindings.slice();this._shouldPropagate=!0;do c--;while(d[c]&&this._shouldPropagate&&d[c].execute(b)!==!1)}}},forget:function(){this._prevParams=null},dispose:function(){this.removeAll();delete this._bindings;delete this._prevParams},toString:function(){return"[Signal active:"+this.active+" numListeners:"+this.getNumListeners()+"]"}};var f=e;f.Signal=e;typeof define==="function"&&define.amd?define(function(){return f}):typeof module!=="undefined"&&module.exports?module.exports=f:i.signals=
f})(this);