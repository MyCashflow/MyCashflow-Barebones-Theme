/**
 * MyCashflow Default Theme
 * Copyright (c) 2016 Pulse247 Oy
 * MIT License <http://opensource.org/licenses/MIT>
 */
;(function ($) {
	'use strict';

	var Modals = {
		init: function (config) {
			var defaults = {
				closeBtnInside: false,
				delegate: 'a[data-modal]',
				type: 'ajax',
				callbacks: {
					elementParse: this.onElementParse,
					parseAjax: this.onParseAjax
				}
			};
			$(document).magnificPopup($.extend(true, defaults, config));
		},

		onElementParse: function (item) {
			if (item.el.attr('data-modal-helper')) {
				item.src = '/interface/Helper?file=' + item.el.attr('data-modal-helper');
			} else if (item.el.attr('data-modal-interface')) {
				item.src = '/interface/' + item.el.attr('data-modal-interface');
			}
		},

		onParseAjax: function (mfpResponse) {
			mfpResponse.data = $('<div class="mfp-ajax-content"/>').append(mfpResponse.data);
			return mfpResponse;
		}
	};

	$.extend(true, window, { MCF: { Modals: Modals }});
})(jQuery);
