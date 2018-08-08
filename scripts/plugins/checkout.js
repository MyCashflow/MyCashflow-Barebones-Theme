/**
 * MyCashflow Default Theme
 * Copyright (c) 2016 Pulse247 Oy
 * MIT License <http://opensource.org/licenses/MIT>
 */
;(function ($) {
	'use strict';

	var CHECK_INPUTS = ':checkbox, :radio, select';

	var Checkout = {
		formSelector: '#CheckoutForm',
		typingDelay: 3000,
		changeDelay: 100,
		autoFillDebounceDelay: 100,
		blurCheckDelay: 50,

		dependencies: {
			'ShippingAddress': ['ShippingMethods', 'PaymentMethods'],
			'BillingAddress': ['ShippingMethods', 'PaymentMethods'],
			'ShippingMethods': ['PaymentMethods'],
			'PaymentMethods': []
		},

		afterInit: function () {},
		beforeUpdate: function () {},
		afterUpdate: function () {},
		beforeUpdatePart: function () {},
		afterUpdatePart: function () {},

		init: function (config) {
			$.extend(true, this, config);
			this.$form = $(this.formSelector);
			this.bindEvents();
			this.runToggles();
			this.afterInit(this.$form);
		},

		bindEvents: function () {
			this.$form.on('animationstart', '[data-checkout-part]', $.proxy(this.onAutoFill, this));
			this.$form.on('change', '[data-checkout-part]', $.proxy(this.onChange, this));
			this.$form.on('keypress', '[data-checkout-part]', $.proxy(this.onKeyPress, this));
			this.$form.on('blur', '[data-checkout-part]', $.proxy(this.onBlur, this));
			this.$form.on('change', '[data-checkout-toggle]', $.proxy(this.onToggle, this));
			this.$form.on('click', '[data-checkout-clear]', $.proxy(this.onClear, this));
			this.$form.on('change', '.DefineShippingMethod, .DefinePaymentMethod', $.proxy(this.onDefineMethod, this));
		},

		onAutoFill: function(evt) {
			var $part = $(evt.currentTarget);

			$(document).one('click', $.proxy(function () {
				this.requestSubmit($part, this.autoFillDebounceDelay);
			}, this));
		},

		onChange: function (evt) {
			var $part = $(evt.currentTarget);
			var $input = $(evt.target);
			if ($input.is(CHECK_INPUTS)) {
				this.requestSubmit($part, this.changeDelay);
			}
		},

		onKeyPress: function (evt) {
			var $part = $(evt.currentTarget);
			var $input = $(evt.target);
			if (!$input.is(CHECK_INPUTS)) {
				this.requestSubmit($part, this.typingDelay);
			}
		},

		onBlur: function (evt) {
			var $part = $(evt.currentTarget);
			var $input = $(evt.target);
			setTimeout($.proxy(function () {
				var hasFocus = $part.find(':focus').length;
				if (!hasFocus && !$input.is(CHECK_INPUTS)) {
					this.requestSubmit($part, this.changeDelay);
				}
			}, this), this.blurCheckDelay);
		},

		onToggle: function (evt) {
			var $toggle = $(evt.currentTarget);
			var $target = $($toggle.attr('data-checkout-toggle'));
			$target.toggle($toggle.is(':checked'));
		},

		onClear: function (evt) {
			evt.preventDefault();
			var $button = $(evt.currentTarget);
			var $target = $($button.attr('data-checkout-clear'));
			var $toggle = $('[data-checkout-toggle="' + $button.attr('data-checkout-clear') + '"]');
			$toggle.prop('checked', false);
			$target.hide().find(':input:not([type="hidden"])').val('').trigger('change');
		},

		onDefineMethod: function (evt) {
			var $target = $(evt.currentTarget);
			var $input = $target.prev('label').find('> [type="radio"]');
			if ($input.length) {
				$input.prop('checked', true);
			}
		},

		requestSubmit: function ($part, delay) {
			clearTimeout($part.data('changeTimeout'));
			$part.data('changeTimeout', setTimeout($.proxy(function () {
				this.submitPart($part);
			}, this), delay));
		},

		submitPart: function ($part) {
			if (this.deferred) {
				return this.deferred
					.then($.proxy(function () {
						this.submitPart($part);
					}, this));
			}
			this.beforeUpdate(this.$form);
			this.deferred = $.post('/checkout/', this.getPartData($part))
				.then($.proxy(function () {
					var $parts = $part.add(this.getPartDependencies($part));
					this.updateParts($parts);
				}, this))
				.then($.proxy(function () {
					this.afterUpdate(this.$form);
					this.deferred = null;
				}, this));
			return this.deferred;
		},

		updateParts: function ($parts) {
			return $.when($.map($parts, $.proxy(function (part) {
				return this.updatePart($(part));
			}, this)));
		},

		updatePart: function ($part) {
			var $focused = $part.has(':focus');
			if (!$focused.length) {
				this.beforeUpdatePart($part);
				return $.get('/interface/' + this.getPartResponseParams($part))
					.then($.proxy(function (response) {
						$part.html(response);
						this.afterUpdatePart($part);
					}, this));
			}
		},

		getPartData: function ($part) {
			return $part.find(':input').serializeArray().concat([
				{ name: 'ajax', value: '1' },
				{ name: 'response_type', value: 'json' }
			]);
		},

		getPartDependencies: function ($part) {
			var name = $part.attr('data-checkout-part');
			var deps = this.dependencies[name];
			return $.map(deps, function (part) {
				return $('[data-checkout-part="' + part + '"]:first');
			});
		},

		getPartResponseParams: function ($part) {
			var $responseTag = $part.find('[name="response_tag"]');
			if (!$responseTag.length) {
				var tag = 'Checkout' + $part.attr('data-checkout-part');
				return tag + '?ajax=1';
			}
			return $responseTag.val()
				.replace(/\(/g, '?')
				.replace(/\:/g, '=')
				.replace(/\,/g, '&')
				.replace(/\'|\)|#039;/g, '');
		},

		runToggles: function () {
			$('[data-checkout-toggle]').each($.proxy(function (index, elem) {
				var $toggle = $(elem);
				var $target = $($toggle.attr('data-checkout-toggle'));
				var hasValues = this.hasValues($target);
				$toggle.prop('checked', hasValues);
				$target.toggle(hasValues);
			}, this));
		},

		hasValues: function ($elem) {
			var valueInputs = ':input:not(select):not(:hidden)';
			return !!$elem.find(valueInputs).filter(function () {
				return !!$(this).val();
			}).length;
		}
	};

	$.extend(true, window, { MCF: { Checkout: Checkout }});
})(jQuery);
