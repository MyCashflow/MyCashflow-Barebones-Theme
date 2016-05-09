/**
 * MyCashflow Default Theme
 * Copyright (c) 2015 Pulse247 Oy
 * MIT License <http://opensource.org/licenses/MIT>
 */
;(function ($) {
	'use strict';

	var Theme = {
		breakpoints: {
			'desktop': 1200,
			'tablet': 1024,
			'mobile-wide': 800,
			'mobile': 600
		},

		init: function (config) {
			$.extend(true, this,  config);
			$(document.documentElement).removeClass('JS-Loading');
		}
	};

	$.extend(true, window, { MCF: { Theme: Theme }});
})(jQuery);
