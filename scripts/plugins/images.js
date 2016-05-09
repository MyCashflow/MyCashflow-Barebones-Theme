/**
 * MyCashflow Default Theme
 * Copyright (c) 2016 Pulse247 Oy
 * MIT License <http://opensource.org/licenses/MIT>
 */
;(function ($) {
	'use strict';

	var Images = {
		currentImage: '#CurrentProductImage',
		thumbnails: '#ProductThumbnails a',
		caption: '#ProductImageCaption',

		init: function (config) {
			window.mzOptions = $.extend(true, {}, config);
			this.bindEvents();
			this.run();
		},

		bindEvents: function () {
			$(document).on('click', this.thumbnails, $.proxy(this.onClickThumb, this));
		},

		onClickThumb: function (evt) {
			$(this.caption).text($(evt.currentTarget).attr('title'));
		},

		run: function () {
			$(this.currentImage).addClass('MagicZoom');
			$(this.thumbnails).each(function () {
				var $thumb = $(this);
				$thumb.attr('data-zoom-id', 'CurrentProductImage')
					.attr('data-image', $thumb.attr('href'));
			});
		}
	};

	$.extend(true, window, { MCF: { Images: Images }});
})(jQuery);
