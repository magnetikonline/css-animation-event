// simple console messaging system for browsers without native support
(function(win) {

	'use strict';

	var consoleFauxEl,
		fauxConsoleLog,
		groupName,
		messageList = '';

	function consoleLog(text) {

		if (!consoleFauxEl) consoleFauxEl = document.getElementById('consolefaux');

		// htmlencode text
		var divEl = document.createElement('div');
		divEl.appendChild(document.createTextNode(text));

		messageList += getLogPrefix() + divEl.innerHTML + '<br />';
		consoleFauxEl.innerHTML = messageList;
	}

	function getLogPrefix() {

		return (groupName) ? '-- ' : '';
	}

	if (!win.console) {
		// create a faux console.log()
		document.documentElement.className += ' consolefaux';
		win.console = { log: consoleLog };
		fauxConsoleLog = true;
	}

	// console.group() / console.groupEnd() methods
	if (!win.console.group) {
		if (!fauxConsoleLog) {
			// rewrite default console.log() to include getLogPrefix() in all messages
			(function() {

				var defaultLog = win.console.log;
				win.console.log = function(text) {

					// is Function.prototype.call() supported?
					if (typeof defaultLog.call != 'undefined') {
						defaultLog.call(console,getLogPrefix() + text);

					} else {
						defaultLog(getLogPrefix() + text);
					}
				};
			})();
		}

		win.console.group = function(group) {

			// exit if groupName already set
			if (groupName) return;

			console.log('Group [' + group + ']');
			groupName = group;
		};

		win.console.groupEnd = function() {

			// exit if no groupName set
			if (!groupName) return;

			var name = groupName;
			groupName = false;
			console.log('Group end [' + name + ']');
		};
	}
})(window);
