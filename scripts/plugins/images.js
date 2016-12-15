/**
 * MyCashflow Default Theme
 * Copyright (c) 2016 Pulse247 Oy
 * MIT License <http://opensource.org/licenses/MIT>
 */
;(function ($) {
	'use strict';

	var LABEL_REGEX = /(.+),\s.?[\d+\s\d]+[,.]\d+.+/i;

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
				}, this),

				onUpdate: $.proxy(function (zoomId, prevSelector, newSelector) {
					var $newSelector = $(newSelector)
					if ($newSelector.is(prevSelector)) {
						return false;
					}

					var $caption = $(this.caption);
					var title = $newSelector.attr('title');
					if ($caption.length) {
						$caption.text($(title);
					}

					if (this.imageToVariation && $(this.variationsSelect).length) {
						var $select = $(this.variationsSelect).find('select').first();
						var $option;

						$select.find('option').each($.proxy(function (index, option) {
							var text = $(option).text().trim();
							text = this.parseVariationName(text);
							if (text === title) {
								$option = $(option);
							}
						}, this));

						if ($option) {
							$select.val($option.attr('value'));
						}
					} else if (this.imageToVariation && $(this.variationsRadio).length) {
						var $labels = $(this.variationsRadio).find('label');
						var $radio;

						$labels.each($.proxy(function (index, label) {
							var text = $(label).text().trim();
							text = this.parseVariationName(text);
							if (text === title) {
								$radio = $(label).find('input');
							}
						}, this));

						if ($radio) {
							$radio.prop('checked', true);
						}
					}
				}, this)
			}, config);
		},

		bindEvents: function () {
			if (this.imageToVariation && $(this.variationsSelect).length) {
				$(document).on('change', 'select', this.variationsSelect,
					$.proxy(this.onChangeSelectVariation, this));
			} else if (this.imageToVariation && $(this.variationsRadio).length) {
				$(document).on('change', 'input', this.variationsRadio,
					$.proxy(this.onChangeRadioVariation, this));
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

		parseVariationName: function (text) {
			var matches = LABEL_REGEX.exec(text);
			return matches ? matches[1] : text;
		},

		setCurrentImageByText: function (text) {
			var textWithoutPrice = this.parseVariationName(text);
			var $thumb = $(this.thumbnails).has('img[alt="' + textWithoutPrice + '"]').first();
			var index = $thumb.closest('li').index();
			window.MagicZoom.switchTo(this.currentImage.substr(1), index);
		}
	};

	$.extend(true, window, { MCF: { Images: Images }});
})(jQuery);
