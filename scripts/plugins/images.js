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
		variationsRadio: '.BuyFormVariationRadio',
		variationsSelect: '.BuyFormVariationSelect',

		imageToVariation: true,
		variationToImage: true,

		init: function (config) {
			// Enable MagicZoom for the current image.
			$(this.currentImage).addClass('MagicZoom');

			// Add MagicZoom attributes to thumbnails.
			$(this.thumbnails).each($.proxy(function (index, el) {
				var $thumb = $(el);
				$thumb.attr('data-zoom-id', this.currentImage.substr(1))
					.attr('data-image', $thumb.attr('href'));
			}, this));

			window.mzOptions = $.extend(true, {
				onZoomReady: $.proxy(function () {
					this.bindEvents();

					// Set the correct current image based on the form selection.
					if (this.variationToImage && $(this.variationsSelect).length) {
						$(this.variationsSelect).find('select').trigger('change');
					} else if (this.variationToImage && $(this.variationsRadio).length) {
						$(this.variationsRadio).find('input:checked').trigger('change');
					}
				}, this)
			}, config);
		},

		bindEvents: function () {
			$(document).on('click', this.thumbnails, $.proxy(this.onClickThumb, this));

			if (this.imageToVariation && $(this.variationsSelect).length) {
				$(document).on('change', 'select', this.variationsSelect,
					$.proxy(this.onChangeSelectVariation, this));
			} else if (this.imageToVariation && $(this.variationsRadio).length) {
				$(document).on('change', 'input', this.variationsRadio,
					$.proxy(this.onChangeRadioVariation, this));
			}
		},

		onClickThumb: function (evt) {
			var title = $(evt.currentTarget).attr('title');
			this.setCaption(title);

			if (this.imageToVariation && $(this.variationsSelect).length) {
				var $select = $(this.variationsSelect).find('select').first();
				var $option = $select.find('option:contains(' + title + ')');
				$select.val($option.attr('value'));
			} else if (this.imageToVariation && $(this.variationsRadio).length) {
				var $label = $(this.variationsRadio).find('label:contains(' + title + ')');
				var $radio = $label.find('input');
				$radio.prop('checked', true);
			}
		},

		onChangeRadioVariation: function (evt) {
			var label = $(evt.currentTarget).closest('label').text().trim();
			this.setCurrentImageByText(label);
		},

		onChangeSelectVariation: function (evt) {
			var label = $(evt.delegateTarget).find(':selected').text().trim();
			this.setCurrentImageByText(label);
		},

		setCaption: function (str) {
			$(this.caption).text(str);
		},

		setCurrentImageByText: function (text) {
			var $thumb = $(this.thumbnails).has('img[alt*="' + text + '"]').first();
			var index = $thumb.closest('li').index();
			this.setCaption($thumb.attr('title'));
			window.MagicZoom.switchTo(this.currentImage.substr(1), index);
		}
	};

	$.extend(true, window, { MCF: { Images: Images }});
})(jQuery);
