(function(win,undefined) {

	'use strict';

	var TRIM_REGEXP = /^\s+|\s+$/g,
		CLASS_NAME_ANIM_ACTIVE_KEY = ' cssanimactive cssanim',
		CLASS_NAME_ANIMID_REGEXP = new RegExp(CLASS_NAME_ANIM_ACTIVE_KEY + '([0-9]+)( |$)'),
		IS_OPERA_EVENT_TYPE_REGEXP = /^o[AT]/,
		docEl = document.documentElement,
		isDetected,
		animationSupport,
		animationEventTypeStart,
		animationEventTypeIteration,
		animationEventTypeEnd,
		animationEndHandlerCollection,
		transitionSupport,
		transitionEventTypeEnd,
		transitionEndHandlerCollection,
		nextAnimId = 0;

	function detect() {

		// if already detected support then exit
		if (isDetected) return;
		isDetected = true;

		// collection of animation/transition style properties per browser engine and matching DOM events
		// non-prefixed properties are intentionally checked first
		var ANIMATION_DETECT_LIST = [
				['animation','animationstart','animationiteration','animationend'],
				['MozAnimation','mozAnimationStart','mozAnimationIteration','mozAnimationEnd'],
				['OAnimation','oAnimationStart','oAnimationIteration','oAnimationEnd'],
				['webkitAnimation','webkitAnimationStart','webkitAnimationIteration','webkitAnimationEnd']
			],
			TRANSITION_DETECT_LIST = [
				['transition','transitionend'],
				['MozTransition','mozTransitionEnd'],
				['OTransition','oTransitionEnd'],
				['webkitTransition','webkitTransitionEnd']
			];

		function detectHandle(detectList,handler) {

			while (detectList.length) {
				var item = detectList.shift();
				if (docEl.style[item[0]] !== undefined) {
					// found property - deligate to handler
					return handler(item);
				}
			}
		}

		// animation support
		detectHandle(ANIMATION_DETECT_LIST,function(item) {

			animationSupport = true;
			animationEventTypeStart = item[1];
			animationEventTypeIteration = item[2];
			animationEventTypeEnd = item[3];
		});

		// transition support
		detectHandle(TRANSITION_DETECT_LIST,function(item) {

			transitionSupport = true;
			transitionEventTypeEnd = item[1];
		});
	}

	function addEvent(obj,type,handler) {

		obj.addEventListener(type,handler,false);
		if (IS_OPERA_EVENT_TYPE_REGEXP.test(type)) {
			// some earlier versions of Opera (Presto) need lowercased event names
			obj.addEventListener(type.toLowerCase(),handler,false);
		}

		return true;
	}

	function removeEvent(obj,type,handler) {

		obj.removeEventListener(type,handler,false);
		if (IS_OPERA_EVENT_TYPE_REGEXP.test(type)) {
			// some earlier versions of Opera (Presto) need lowercased event names
			obj.removeEventListener(type.toLowerCase(),handler,false);
		}

		return true;
	}

	function getElAnimId(el) {

		// look for animation ID class identifier
		var match = CLASS_NAME_ANIMID_REGEXP.exec(' ' + el.className);
		return (match) ? (match[1] * 1) : false; // cast as integer
	}

	function removeElAnimId(el,animId) {

		// remove animation ID class identifer from element
		el.className =
			(' ' + el.className + ' ').
			replace(CLASS_NAME_ANIM_ACTIVE_KEY + animId + ' ',' ').
			replace(TRIM_REGEXP,'');
	}

	function removeAnimItem(handlerCollection,el) {

		// DOM element has an animation ID?
		var animId = getElAnimId(el);
		if (animId === false) return;

		// remove animation ID from element and handler collection
		removeElAnimId(el,animId);
		delete handlerCollection[animId];
	}

	function onEndProcess(hasSupport,eventTypeEnd,handlerCollection,el,handler,data) {

		if (!hasSupport) {
			// no CSS animation/transition support, call handler right away
			setTimeout(function() { handler(el,data); });

		} else {
			if (!handlerCollection) {
				// setup end handler
				handlerCollection = {};
				addEvent(docEl,eventTypeEnd,function(event) {

					// ensure event returned the target element
					if (!event || !event.target) return;

					// get element animation id - exit if not found
					var targetEl = event.target,
						animId = getElAnimId(targetEl);

					if (animId === false) return;
					removeElAnimId(targetEl,animId);

					// execute handler then remove from collection
					var item = handlerCollection[animId];
					if (item) item[0](item[1],item[2]);

					delete handlerCollection[animId];
				});
			}

			// remove possible existing transition end handler and setup new end handler
			removeAnimItem(handlerCollection,el);

			// add animation ID class identifer to element
			el.className =
				(el.className + CLASS_NAME_ANIM_ACTIVE_KEY + nextAnimId).
				replace(TRIM_REGEXP,'');

			// add item to handler collection
			handlerCollection[nextAnimId++] = [handler,el,data];
		}

		// important handlerCollection is returned since we create a new object for the collection in this function
		return handlerCollection;
	}

	win.CSSAnimEvent = {
		animationSupport: function() {

			detect();
			return !!animationSupport;
		},

		transitionSupport: function() {

			detect();
			return !!transitionSupport;
		},

		addAnimationStart: function(el,handler) {

			detect();
			return (animationSupport) ? addEvent(el,animationEventTypeStart,handler) : false;
		},

		removeAnimationStart: function(el,handler) {

			detect();
			return (animationSupport) ? removeEvent(el,animationEventTypeStart,handler) : false;
		},

		addAnimationIteration: function(el,handler) {

			detect();
			return (animationSupport) ? addEvent(el,animationEventTypeIteration,handler) : false;
		},

		removeAnimationIteration: function(el,handler) {

			detect();
			return (animationSupport) ? removeEvent(el,animationEventTypeIteration,handler) : false;
		},

		addAnimationEnd: function(el,handler) {

			detect();
			return (animationSupport) ? addEvent(el,animationEventTypeEnd,handler) : false;
		},

		removeAnimationEnd: function(el,handler) {

			detect();
			return (animationSupport) ? removeEvent(el,animationEventTypeEnd,handler) : false;
		},

		addTransitionEnd: function(el,handler) {

			detect();
			return (transitionSupport) ? addEvent(el,transitionEventTypeEnd,handler) : false;
		},

		removeTransitionEnd: function(el,handler) {

			detect();
			return (transitionSupport) ? removeEvent(el,transitionEventTypeEnd,handler) : false;
		},

		onAnimationEnd: function(el,handler,data) {

			detect();
			animationEndHandlerCollection = onEndProcess(
				animationSupport,animationEventTypeEnd,
				animationEndHandlerCollection,
				el,handler,data
			);
		},

		cancelAnimationEnd: function(el) {

			removeAnimItem(animationEndHandlerCollection,el);
		},

		onTransitionEnd: function(el,handler,data) {

			detect();
			transitionEndHandlerCollection = onEndProcess(
				transitionSupport,transitionEventTypeEnd,
				transitionEndHandlerCollection,
				el,handler,data
			);
		},

		cancelTransitionEnd: function(el) {

			removeAnimItem(transitionEndHandlerCollection,el);
		}
	};
})(window);
