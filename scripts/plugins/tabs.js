/**
 * MyCashflow Default Theme
 * Copyright (c) 2016 Pulse247 Oy
 * MIT License <http://opensource.org/licenses/MIT>
 */
;(function ($) {
	'use strict';

	var Tabs = {
		currentClass: 'Current',

		init: function () {
			$(document).on('click', '.TabsNavigation a', $.proxy(this.toggle, this));
		},

		toggle: function (evt) {
			var $navElem = $(evt.currentTarget);
			var $liElem = $navElem.closest('li');
			var $tabElem = $($navElem.attr('href'));

			if (!$tabElem.length) {
				return true;
			}

			$liElem.addClass(this.currentClass).siblings().removeClass(this.currentClass);
			$tabElem.addClass(this.currentClass).siblings().removeClass(this.currentClass);
			return false;
		}
	};

	$.extend(true, window, { MCF: { Tabs: Tabs }});
})(jQuery);
