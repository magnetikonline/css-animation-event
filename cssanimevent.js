(function(win,docEl,undefined) {

	'use strict';

	var TRIM_REGEXP = /^\s+|\s+$/g,
		CLASS_NAME_ANIM_ACTIVE = ' cssanimactive',
		IS_OPERA_EVENT_TYPE_REGEXP = /^o[AT]/,
		HANDLER_LIST_INDEX_ANIMATION = 0,
		HANDLER_LIST_INDEX_TRANSITION = 1,
		isDetected,
		animationSupport,
		animationEventTypeStart,
		animationEventTypeIteration,
		animationEventTypeEnd,
		transitionSupport,
		transitionEventTypeEnd,
		handlerList = [undefined,undefined];

	function detect() {

		// if already detected support then exit
		if (isDetected) return;
		isDetected = true;

		// list of animation/transition style properties per browser engine and matching DOM event names
		// the non-prefixed properties are intentionally checked first
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

	function getElHandlerListIndex(handlerIndex,el) {

		var seekList = handlerList[handlerIndex];
		if (seekList !== undefined) {
			for (var index = 0,handlerItem;handlerItem = seekList[index];index++) {
				if (handlerItem[0] == el) {
					// found element in handler list
					return index;
				}
			}
		}

		// not found
		return false;
	}

	function removeElHandlerItem(handlerIndex,el,index) {

		// if index to remove has been given, don't call getElHandlerListIndex()
		if (index === undefined) index = getElHandlerListIndex(handlerIndex,el);

		if (index !== false) {
			// found element in list, remove from handler list array
			handlerList[handlerIndex].splice(index,1);

			// drop the 'animation active' class from element
			el.className =
				(' ' + el.className + ' ').
				replace(CLASS_NAME_ANIM_ACTIVE + ' ',' ').
				replace(TRIM_REGEXP,'');
		}
	}

	function onEndProcess(hasSupport,eventTypeEnd,handlerIndex,el,handler,data) {

		if (!hasSupport) {
			// no CSS animation/transition support, call handler right away
			setTimeout(function() { handler(el,data); });

		} else {
			if (!handlerList[handlerIndex]) {
				// setup end handler
				handlerList[handlerIndex] = [];
				addEvent(docEl,eventTypeEnd,function(event) {

					// ensure event returned the target element
					if (!event || !event.target) return;

					// get the element handler list index - skip over event if not found
					var targetEl = event.target,
						index = getElHandlerListIndex(handlerIndex,targetEl);

					if (index !== false) {
						// execute handler then remove from handler list
						var handlerItem = handlerList[handlerIndex][index];
						removeElHandlerItem(handlerIndex,targetEl,index);
						handlerItem[1](targetEl,handlerItem[2]);
					}
				});
			}

			// remove (possible) existing end handler
			removeElHandlerItem(handlerIndex,el);

			// add element to handler list and a 'animation active' class identifier
			handlerList[handlerIndex].push([el,handler,data]);
			el.className = (el.className + CLASS_NAME_ANIM_ACTIVE).replace(TRIM_REGEXP,'');
		}
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
			onEndProcess(
				animationSupport,animationEventTypeEnd,
				HANDLER_LIST_INDEX_ANIMATION,
				el,handler,data
			);
		},

		cancelAnimationEnd: function(el) {

			removeElHandlerItem(HANDLER_LIST_INDEX_ANIMATION,el);
		},

		onTransitionEnd: function(el,handler,data) {

			detect();
			onEndProcess(
				transitionSupport,transitionEventTypeEnd,
				HANDLER_LIST_INDEX_TRANSITION,
				el,handler,data
			);
		},

		cancelTransitionEnd: function(el) {

			removeElHandlerItem(HANDLER_LIST_INDEX_TRANSITION,el);
		}
	};
})(window,document.documentElement);
