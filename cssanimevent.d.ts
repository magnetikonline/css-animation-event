// Type definitions for cssanimevent
// Project: https://github.com/magnetikonline/cssanimevent
// Definitions by: Aluísio Augusto Silva Gonçalves <https://github.com/AluisioASG>

declare namespace CSSAnimEvent {
    /**
     * Event handlers are passed the `element` that fired the event and an
     * optional `data` payload.
     */
    type Handler = (element: Element, data: any) => void

    /**
     * Adds a 'one shot' event handler to the given DOM `element`, with
     * `handler` executing either upon `animationend` or instantaneously if CSS
     * animation support not detected.
     *
     * The given DOM element will be decorated with a CSS class
     * `cssanimactive`, removed upon animation completion which can be used as
     * a CSS styling hook.
     */
    export function onAnimationEnd(element: Element, handler: Handler, data?: any): void

    /**
     * Cancels a 'one shot' event handler set by {@link onAnimationEnd} on the
     * given DOM `element`.
     */
    export function cancelAnimationEnd(element: Element): void

    /**
     * Adds a 'one shot' event handler to the given DOM `element`, with
     * `handler` executing either upon `transitionend` or instantaneously if
     * CSS transition support not detected.
     *
     * The given DOM element will be decorated with a CSS class
     * `cssanimactive`, removed upon transition completion which can be used as
     * a CSS styling hook.
     */
    export function onTransitionEnd(element: Element, handler: Handler, data?: any): void

    /**
     * Cancels a 'one shot' event handler set by {@link onTransitionEnd} on the
     * given DOM `element`.
     */
    export function cancelTransitionEnd(element: Element): void

    /**
     * Returns `true` if CSS animation support is detected.
     */
    export function animationSupport(): boolean

    /**
     * Returns `true` if CSS transition support is detected.
     */
    export function transitionSupport(): boolean

    /**
     * Adds `animationstart` native event handlers to DOM elements.  Provides a
     * handy cross browser wrapper having done browser detection for you.  Does
     * **not** provide faux event firing for non-supported browsers.
     *
     * @returns `true` where supported, `false` otherwise.
     */
    export function addAnimationStart(element: Element, handler: EventListener): boolean

    /**
     * Adds `animationiteration` native event handlers to DOM elements.
     * Provides a handy cross browser wrapper having done browser detection for
     * you.  Does **not** provide faux event firing for non-supported browsers.
     *
     * @returns `true` where supported, `false` otherwise.
     */
    export function addAnimationIteration(element: Element, handler: EventListener): boolean

    /**
     * Adds `animationend` native event handlers to DOM elements.  Provides a
     * handy cross browser wrapper having done browser detection for you.  Does
     * **not** provide faux event firing for non-supported browsers.
     *
     * @returns `true` where supported, `false` otherwise.
     */
    export function addAnimationEnd(element: Element, handler: EventListener): boolean

    /**
     * Removes `animationstart` native event handlers added through
     * {@link addAnimationStart}.
     *
     * @returns `true` where supported, `false` otherwise.
     */
    export function removeAnimationStart(element: Element, handler: EventListener): boolean

    /**
     * Removes `animationiteration` native event handlers added through
     * {@link addAnimationIteration}.
     *
     * @returns `true` where supported, `false` otherwise.
     */
    export function removeAnimationIteration(element: Element, handler: EventListener): boolean

    /**
     * Removes `animationend` native event handlers added through
     * {@link addAnimationEnd}.
     *
     * @returns `true` where supported, `false` otherwise.
     */
    export function removeAnimationEnd(element: Element, handler: EventListener): boolean

    /**
     * Adds `transitionend` native event handlers to DOM elements.  Provides a
     * handy cross browser wrapper having done browser detection for you.  Does
     * **not** provide faux event firing for non-supported browsers.
     *
     * @returns `true` on success/support, `false` otherwise.
     */
    export function addTransitionEnd(element: Element, handler: EventListener): boolean

    /**
     * Removes `transitionend` native event handlers added through
     * {@link addTransitionEnd}.
     *
     * @returns `true` where supported, otherwise `false`.
     */
    export function removeTransitionEnd(element: Element, handler: EventListener): boolean
}
