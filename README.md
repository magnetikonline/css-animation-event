# CSS animation event

A very small (approx **800 bytes** minified and gzipped) cross browser compatible library to handle CSS3 animation and transition DOM events with a fall back pattern for unsupported browsers.

Tested successfully with CSS animation/transition supported browsers of:

- Google Chrome
- Mozilla Firefox
- Opera (12.10+)
- IE10+

Library supports Internet Explorer IE9 and above, a final version with IE8 support is [tagged here](https://github.com/magnetikonline/css-animation-event/tree/ie8-final).

- [Why?](#why)
- [Usage](#usage)
- [Example](#example)
- [Methods](#methods)
	- [onAnimationEnd(element,handler[,data])](#onanimationendelementhandlerdata)
	- [cancelAnimationEnd(element)](#cancelanimationendelement)
	- [onTransitionEnd(element,handler[,data])](#ontransitionendelementhandlerdata)
	- [cancelTransitionEnd(element)](#canceltransitionendelement)
	- [animationSupport()](#animationsupport)
	- [transitionSupport()](#transitionsupport)
	- [addAnimation{Start|Iteration|End}(element,handler)](#addanimationstartiterationendelementhandler)
	- [removeAnimation{Start|Iteration|End}(element,handler)](#removeanimationstartiterationendelementhandler)
	- [addTransitionEnd(element,handler)](#addtransitionendelementhandler)
	- [removeTransitionEnd(element,handler)](#removetransitionendelementhandler)

## Why?

The CSS3 [animation](https://www.w3.org/TR/css3-animations/) and [transition](https://www.w3.org/TR/css3-transitions/) modules both provide useful DOM events which can be used to track the current state of an animation or transition - extremely useful for chaining future application logic as they progress and complete.

Whilst support for these events is (thankfully) provided in virtually every browser that offers CSS [animations](https://caniuse.com/#feat=css-animation) and [transitions](https://caniuse.com/#feat=css-transitions), as a front-end developer you are still left with the issue of coding alternative program flows where support isn't available and therefore won't fire your animation/transition event handlers.

Consider the following example:

```css
#movethis {
  /* leaving out browser prefixes for brevity */
  height: 100px;
  transition: height 1.5s ease-in;
}

#movethis.nowmove {
  height: 300px;
}
```

```js
// determineCSSTransitionSupport() would determine if browser supports CSS transitions
var supportCSSTransitions = determineCSSTransitionSupport();

// move our element
var moveThisEl = document.getElementById('movethis');
moveThisEl.className += ' nowmove';

// code around no transition support
if (supportCSSTransitions) {
  moveThisEl.addEventListener('transitionend',nextUIStep,false);
} else {
  nextUIStep();
}

function nextUIStep() {
  // the transition ended, keep going
}
```

Having to continually make the decision to utilise DOM animation/transition events vs. a graceful fallback (via `supportCSSTransitions` in example above) throughout your UI code soon becomes clumsy and error prone.

## Usage

[CSSAnimEvent](cssanimevent.js) manages the above situation in a different way, relying on the fact that CSS transitions by design fall back gracefully with unsupported browsers handling element CSS property changes as instant, with a zero transition time.

Methods `onAnimationEnd(element,handler)` and `onTransitionEnd(element,handler)` simply mimic this behaviour by instantaneously calling the given `handler` for browsers that don't provide animation and/or transition support.

Rewriting the above JavaScript example we can now do:

```js
// move our element
var moveThisEl = document.getElementById('movethis');
moveThisEl.className += ' nowmove';

// browsers supporting CSS transitions will call nextUIStep() after the transition ends
// ...otherwise it will be called as window.setTimeout(nextUIStep)
CSSAnimEvent.onTransitionEnd(moveThisEl,nextUIStep);

function nextUIStep() {
  // the transition ended, keep going
}
```

One caveat to be aware of, both `onAnimationEnd()` and `onTransitionEnd()` create 'one shot' event handlers and should be called *just after* CSS updates have been applied to the element, allowing instant delegation back to the given callback handler for unsupported browsers.

Internally `CSSAnimEvent` attaches singular `animationend` and `transitionend` event handlers to the `<html/>` element and delegates to given callbacks as required.

Using CSS `animation/@keyframes` is *slightly* more work since animated elements will never reach their intended keyframe target within unsupported browsers, but a little CSS/JavaScript can handle this situation:

```css
@keyframes myanimation {
  /* prior animation steps in here */

  100% {
    background: #f00;
    height: 300px;
  }
}

#movethis {
  height: 100px;
}

#movethis.nowmove {
  animation: myanimation 1s linear 1 forwards;
}

#movethis.finish {
  /* faux the target of myanimation for older browsers */
  background: #f00;
  height: 300px;
}
```

```js
// move our element
var moveThisEl = document.getElementById('movethis');
moveThisEl.className += ' nowmove';

CSSAnimEvent.onAnimationEnd(moveThisEl,nextUIStep);

function nextUIStep(el) {
  // faux the animation target, by adding 'finish' class to element
  el.className += ' finish';

  // keep going
}
```

## Example

View a very [basic example of this in action](https://magnetikonline.github.io/css-animation-event/) using animation and transition chaining.

For capable browsers the tweens will run as expected - alternatively the DOM elements will update instantly from start to finish, via the same event handler execution flow.

As a small bonus, `CSSAnimEvent` also adds a handy CSS styling hook; `cssanimactive`, which can be used for specific styling which is applied *only* during the animation/transition period.

```html
<!-- our element before onAnimationEnd()/onTransitionEnd() -->
<div id="movethis" class="movethis-basestyle">

<!-- our element after onAnimationEnd()/onTransitionEnd() called -->
<div id="movethis" class="movethis-basestyle cssanimactive">

<!-- and finally, once the animation/transition ends -->
<div id="movethis" class="movethis-basestyle">
```

The [example](https://magnetikonline.github.io/css-animation-event/) uses this CSS styling hook to provide a red border to each box during it's animation/transition period.

## Methods

All methods are under a `window.CSSAnimEvent` namespace.

### `onAnimationEnd(element,handler[,data])`

- Adds a 'one shot' event handler to the given DOM `element`, with `handler` executing either upon `animationend` or instantaneously if CSS animation support not detected.
- The `handler` will be passed `element` that fired the event and an optional `data` payload as a second parameter.
- The given DOM element will be decorated with a CSS class `cssanimactive`, removed upon animation completion which can be used as a CSS styling hook.

### `cancelAnimationEnd(element)`

Cancel a 'one shot' event handler set by `onAnimationEnd()` on the given DOM `element`.

### `onTransitionEnd(element,handler[,data])`

- Adds a 'one shot' event handler to the given DOM `element`, with `handler` executing either upon `transitionend` or instantaneously if CSS transition support not detected.
- The `handler` will be passed `element` that fired the event and an optional `data` payload as a second parameter.
- The given DOM element will be decorated with a CSS class `cssanimactive`, removed upon transition completion which can be used as a CSS styling hook.

### `cancelTransitionEnd(element)`

Cancel a 'one shot' event handler set by `onTransitionEnd()` on the given DOM `element`.

### `animationSupport()`

Returns `true` if CSS animation support is detected.

### `transitionSupport()`

Returns `true` if CSS transition support is detected.

### `addAnimation{Start|Iteration|End}(element,handler)`

- Add `animation{start|iteration|end}` native event handlers to DOM elements.
- Provides a handy cross browser wrapper having done browser detection for you. Does **not** provide faux event firing for non-supported browsers.
- Returns `true` where supported, `false` otherwise.

### `removeAnimation{Start|Iteration|End}(element,handler)`

- Remove `animation{start|iteration|end}` native event handlers for above.
- Returns `true` where supported, otherwise `false`.

### `addTransitionEnd(element,handler)`

- Add `transitionend` native event handlers to DOM elements.
- Provides a handy cross browser wrapper having done browser detection for you. Does **not** provide faux event firing for non-supported browsers.
- Returns `true` on success/support, `false` otherwise.

### `removeTransitionEnd(element,handler)`

- Remove `transitionend` native event handlers for above.
- Returns `true` where supported, otherwise `false`.
