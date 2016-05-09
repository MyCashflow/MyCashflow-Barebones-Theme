/**
 * MyCashflow Default Theme
 * Copyright (c) 2016 Pulse247 Oy
 * MIT License <http://opensource.org/licenses/MIT>
 */
;(function ($) {
	'use strict';

	var Sliders = {
		init: function (config) {
			$.extend(true, this, config);
			this.createSliders();
		},

		createSliders: function () {
			$('[data-slider]').each($.proxy(function (index, elem) {
				var config = this[$(elem).attr('data-slider')];
				var defaults = this['default'] || {};
				$(elem).slick(config ? $.extend(true, defaults, config) : defaults);
			}, this));
		}
	};

	$.extend(true, window, { MCF: { Sliders: Sliders }});
})(jQuery);
