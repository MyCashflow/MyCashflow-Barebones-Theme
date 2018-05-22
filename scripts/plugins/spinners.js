/**
 * MyCashflow Default Theme
 * Copyright (c) 2016 Pulse247 Oy
 * MIT License <http://opensource.org/licenses/MIT>
 */
;(function ($) {
	'use strict';

	var incrTmpl = ['<div class="SpinnerControl">',
			'<button class="SpinnerButton SpinnerButtonInc" type="button"></button>',
		'</div>'].join('');

	var decrTmpl = ['<div class="SpinnerControl">',
			'<button class="SpinnerButton SpinnerButtonDec" type="button"></button>',
		'</div>'].join('');

	var Spinners = {
		init: function () {
			this.wrapInputs($(document.body));
			this.bindEvents();
		},

		bindEvents: function () {
			$(document).on('click.spinner', '.SpinnerButton', this.handleClick);
		},

		unbindEvents: function () {
			$(document).off('.spinner');
		},

		wrapInputs: function ($root) {
			$('[type=number]', $root).each($.proxy(function (index, el) {
				this.wrapInput($(el));
			}, this));
		},

		wrapInput: function ($input) {
			var $newInput = $('<input type="text" name="' + $input.attr('name') + '"/>"');
			$input.replaceWith($newInput);
			$newInput.val($input.val())
				.wrap($('<div class="Spinner"></div>'))
				.before(decrTmpl)
				.after(incrTmpl)
				.wrap($('<div class="SpinnerInput"></div>'));

			if ($input.attr('max')) {
				$newInput.attr('data-max', $input.attr('max'));
			}
		},

		handleClick: function () {
			var $input = $(this).closest('.Spinner').find('input');
			var max = parseInt($input.attr('data-max')) || null;
			var value = parseInt($input.val()) || 0;
			value = $(this).is('.SpinnerButtonInc') ? value + 1 : value - 1;
			value = value <= 0 ? 0 : value;
			value = !!max && value > max ? max : value;
			$input.val(value).trigger('change');
		}
	};

	$.extend(true, window, { MCF: { Spinners: Spinners }});
})(jQuery);
