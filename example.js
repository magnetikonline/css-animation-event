(function(win) {

	'use strict';

	function $(id) {

		return document.getElementById(id);
	}

	function addEvent(obj,type,handler) {

		if (obj.addEventListener) {
			obj.addEventListener(type,handler,false);
			return;
		}

		// IE < 9 event handler
		obj.attachEvent('on' + type,handler);
	}

	function startAnimation() {

		$('boxanim').className += ' move';

		// onAnimationEnd() hook
		CSSAnimEvent.onAnimationEnd(
			$('boxanim'),
			function(el,data) {

				console.group('Animation finished');
				console.log(el);
				console.log(data);
				console.groupEnd();

				// set final box position for browsers that don't support animations
				$('boxanim').className += ' complete';

				// start first box transition
				startTransition1();
			},
			{ random: 'data' }
		);

		//CSSAnimEvent.cancelAnimationEnd($('boxanim'));
	}

	function startTransition1() {

		$('boxtran1').className += ' move';

		// onTransitionEnd() hook #1
		CSSAnimEvent.onTransitionEnd(
			$('boxtran1'),
			function(el,data) {

				console.group('Transition #1 finished');
				console.log(el);
				console.log(data);
				console.groupEnd();

				// start second box transition
				startTransition2();
			},
			{ random: 'data' }
		);

		//CSSAnimEvent.cancelTransitionEnd($('boxtran1'));
	}

	function startTransition2() {

		$('boxtran2').className += ' move';

		// onTransitionEnd() hook #1
		CSSAnimEvent.onTransitionEnd(
			$('boxtran2'),
			function(el,data) {

				console.group('Transition #2 finished');
				console.log(el);
				console.log(data);
				console.groupEnd();

				console.log('Finished!');
			},
			{ random: 'data' }
		);

		//CSSAnimEvent.cancelTransitionEnd($('boxtran2'));
	}

	addEvent(
		win,'load',
		function() {

			// report status of browser animation/transition support
			console.log('Window loaded');
			console.log('animationSupport: ' + CSSAnimEvent.animationSupport());
			console.log('transitionSupport: ' + CSSAnimEvent.transitionSupport());

			// wire up start button
			addEvent($('startexample'),'click',startAnimation);
		}
	);
})(window);
