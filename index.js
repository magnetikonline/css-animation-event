(function(doc) {

	'use strict';

	// add console.group(End)() sinks where not supported by browser
	if (!console.group) {
		console.group = console.groupEnd = function() {};
	}

	function $(id) {

		return doc.getElementById(id);
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

				// set final element position for browsers that don't support animations
				$('boxanim').className += ' complete';

				// start first box transition
				startTransition1();
			},
			{ random: 'animData' }
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
			{ random: 'transData1' }
		);

		//CSSAnimEvent.cancelTransitionEnd($('boxtran1'));
	}

	function startTransition2() {

		$('boxtran2').className += ' move';

		// onTransitionEnd() hook #2
		CSSAnimEvent.onTransitionEnd(
			$('boxtran2'),
			function(el,data) {

				console.group('Transition #2 finished');
				console.log(el);
				console.log(data);
				console.groupEnd();

				console.log('Finished!');
			},
			{ random: 'transData2' }
		);

		//CSSAnimEvent.cancelTransitionEnd($('boxtran2'));
	}

	doc.addEventListener('DOMContentLoaded',function() {

		// report status of browser animation/transition support
		console.log('DOMContentLoaded fired');
		console.log('animationSupport:',CSSAnimEvent.animationSupport());
		console.log('transitionSupport:',CSSAnimEvent.transitionSupport());

		// add event handlers for animation start/iteration/end and transition end
		var boxAnimEl = $('boxanim');

		console.log(
			'animationstart supported?',
			CSSAnimEvent.addAnimationStart(
				boxAnimEl,
				function() { console.log('animationstart fired'); }
			)
		);

		console.log(
			'animationiteration supported?',
			CSSAnimEvent.addAnimationIteration(
				boxAnimEl,
				function() { console.log('animationiteration fired'); }
			)
		);

		console.log(
			'animationend supported?',
			CSSAnimEvent.addAnimationEnd(
				boxAnimEl,
				function() { console.log('animationend fired'); }
			)
		);

		console.log(
			'transitionend supported?',
			CSSAnimEvent.addTransitionEnd(
				$('boxtran1'),
				function() { console.log('transitionend fired'); }
			)
		);

		// wire up start button to chained animation demo
		$('startexample').addEventListener('click',startAnimation);
	});
})(document);
