(function(win,documentElement,undefined) {

	'use strict';

	var ELEMENT_HANDLER_ID_ATTRIBUTE = 'picohCSSAnimID',
		CLASS_NAME_ANIM_ACTIVE = 'cssanimactive',
		HANDLER_TYPE_INDEX_ANIMATION = 0,
		HANDLER_TYPE_INDEX_TRANSITION = 1,
		HANDLER_ID_LENGTH = 3,
		HANDLER_ID_START_CHAR = 97, // character 'a'
		HANDLER_ID_END_CHAR = 122, // character 'z'
		isDetected,
		animationEventTypeStart,
		animationEventTypeIteration,
		animationEventTypeEnd,
		transitionEventTypeEnd,
		handlerCollection = [undefined,undefined];

	function detectCapabilities() {

		// if already detected support then exit
		if (isDetected) {
			return;
		}

		isDetected = true;

		// list of animation/transition style properties per browser engine and matching event names
		// note that non-prefixed properties are intentionally checked first
		var ANIMATION_DETECT_COLLECTION = {
				animation: ['animationstart','animationiteration','animationend'],
				webkitAnimation: ['webkitAnimationStart','webkitAnimationIteration','webkitAnimationEnd']
			},
			TRANSITION_DETECT_COLLECTION = {
				transition: 'transitionend',
				webkitTransition: 'webkitTransitionEnd'
			};

		function detectEventType(detectCollection) {

			var styleNameList = Object.keys(detectCollection);

			while (styleNameList.length) {
				var styleNameItem = styleNameList.shift()
				if (documentElement.style[styleNameItem] !== undefined) {
					// found capability
					return detectCollection[styleNameItem];
				}
			}

			// no match
		}

		// determine if animation and transition support available
		animationEventTypeEnd = detectEventType(ANIMATION_DETECT_COLLECTION);
		if (animationEventTypeEnd) {
			// animation support detected - split out event types from collection
			animationEventTypeStart = animationEventTypeEnd[0];
			animationEventTypeIteration = animationEventTypeEnd[1];
			animationEventTypeEnd = animationEventTypeEnd[2];
		}

		transitionEventTypeEnd = detectEventType(TRANSITION_DETECT_COLLECTION);
	}

	function eventAdd(obj,type,handler) {

		obj.addEventListener(type,handler,false);
		return true;
	}

	function eventRemove(obj,type,handler) {

		obj.removeEventListener(type,handler,false);
		return true;
	}

	function getElHandlerCollectionID(handlerTypeIndex,el) {

		// look for ID as a custom property of the DOM element
		var handlerID = el[ELEMENT_HANDLER_ID_ATTRIBUTE];

		return (
			(handlerID !== undefined) &&
			(handlerCollection[handlerTypeIndex][handlerID] !== undefined)
		)
			// found handler ID in collection
			? handlerID
			// not found
			: false;
	}

	function removeElHandlerItem(handlerTypeIndex,el,handlerID) {

		// if handlerID already given, no need to find again for element
		handlerID = handlerID || getElHandlerCollectionID(handlerTypeIndex,el);

		if (handlerID !== false) {
			// found element in collection, now remove
			delete handlerCollection[handlerTypeIndex][handlerID];
			delete el[ELEMENT_HANDLER_ID_ATTRIBUTE];

			el.className = (
				(' ' + el.className + ' ').
				replace(' ' + CLASS_NAME_ANIM_ACTIVE + ' ',' ')
			).trim();
		}
	}

	function generateHandlerID(handlerTypeIndex) {

		var handlerID;

		// keep creating handler IDs until we have a unique one
		while (!handlerID || handlerCollection[handlerTypeIndex][handlerID]) {
			handlerID = '';
			while (handlerID.length < HANDLER_ID_LENGTH) {
				// append characters between [a-z] to a total of HANDLER_ID_LENGTH
				handlerID += String.fromCharCode(
					Math.floor(Math.random() * (HANDLER_ID_END_CHAR - HANDLER_ID_START_CHAR)) +
					HANDLER_ID_START_CHAR
				);
			}
		}

		return handlerID;
	}

	function onEndProcess(eventTypeEnd,handlerTypeIndex,el,handler,data) {

		if (!eventTypeEnd) {
			// no CSS3 animation/transition support - call handler right away
			return setTimeout(function() { handler(el,data); });
		}

		if (!handlerCollection[handlerTypeIndex]) {
			// setup end handler
			handlerCollection[handlerTypeIndex] = {};
			eventAdd(documentElement,eventTypeEnd,function(event) {

				// ensure event returned a target element
				if (event.target) {
					// get the element handler list ID - skip over if not found
					var targetEl = event.target,
						handlerID = getElHandlerCollectionID(handlerTypeIndex,targetEl);

					if (handlerID !== false) {
						// execute handler then remove from handler list
						var handlerItem = handlerCollection[handlerTypeIndex][handlerID];
						removeElHandlerItem(handlerTypeIndex,targetEl,handlerID);
						handlerItem[0](targetEl,handlerItem[1]);
					}
				}
			});
		}

		// remove possible existing end handler associated to element
		removeElHandlerItem(handlerTypeIndex,el);

		// add element to handler list and a 'animation active' class identifier to the target element
		var handlerID = generateHandlerID(handlerTypeIndex);
		el[ELEMENT_HANDLER_ID_ATTRIBUTE] = handlerID;
		handlerCollection[handlerTypeIndex][handlerID] = [handler,data];
		el.className = el.className.trim() + ' ' + CLASS_NAME_ANIM_ACTIVE;
	}

	win.CSSAnimEvent = {
		animationSupport: function() {

			detectCapabilities();
			return !!animationEventTypeEnd;
		},

		transitionSupport: function() {

			detectCapabilities();
			return !!transitionEventTypeEnd;
		},

		addAnimationStart: function(el,handler) {

			detectCapabilities();

			return (animationEventTypeStart)
				? eventAdd(el,animationEventTypeStart,handler)
				: false;
		},

		removeAnimationStart: function(el,handler) {

			detectCapabilities();

			return (animationEventTypeStart)
				? eventRemove(el,animationEventTypeStart,handler)
				: false;
		},

		addAnimationIteration: function(el,handler) {

			detectCapabilities();

			return (animationEventTypeIteration)
				? eventAdd(el,animationEventTypeIteration,handler)
				: false;
		},

		removeAnimationIteration: function(el,handler) {

			detectCapabilities();

			return (animationEventTypeIteration)
				? eventRemove(el,animationEventTypeIteration,handler)
				: false;
		},

		addAnimationEnd: function(el,handler) {

			detectCapabilities();

			return (animationEventTypeEnd)
				? eventAdd(el,animationEventTypeEnd,handler)
				: false;
		},

		removeAnimationEnd: function(el,handler) {

			detectCapabilities();

			return (animationEventTypeEnd)
				? eventRemove(el,animationEventTypeEnd,handler)
				: false;
		},

		addTransitionEnd: function(el,handler) {

			detectCapabilities();

			return (transitionEventTypeEnd)
				? eventAdd(el,transitionEventTypeEnd,handler)
				: false;
		},

		removeTransitionEnd: function(el,handler) {

			detectCapabilities();

			return (transitionEventTypeEnd)
				? eventRemove(el,transitionEventTypeEnd,handler)
				: false;
		},

		onAnimationEnd: function(el,handler,data) {

			detectCapabilities();

			onEndProcess(
				animationEventTypeEnd,
				HANDLER_TYPE_INDEX_ANIMATION,
				el,handler,data
			);
		},

		cancelAnimationEnd: function(el) {

			removeElHandlerItem(HANDLER_TYPE_INDEX_ANIMATION,el);
		},

		onTransitionEnd: function(el,handler,data) {

			detectCapabilities();

			onEndProcess(
				transitionEventTypeEnd,
				HANDLER_TYPE_INDEX_TRANSITION,
				el,handler,data
			);
		},

		cancelTransitionEnd: function(el) {

			removeElHandlerItem(HANDLER_TYPE_INDEX_TRANSITION,el);
		}
	};
})(window,document.documentElement);
