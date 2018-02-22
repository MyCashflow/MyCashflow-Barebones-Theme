/**
 * MyCashflow Default Theme
 * Copyright (c) 2016 Pulse247 Oy
 * MIT License <http://opensource.org/licenses/MIT>
 */
;(function ($) {
	'use strict';

	var KlarnaCheckout = {
		$klarnaFrameWrap: $('#KlarnaCheckoutWrap'),
		$klarnaFrame: $('#KlarnaCheckout'),
		$checkout: $('#Checkout'),
		$shippingInformation: $('#CheckoutShippingInformation'),
		$paymentMethods: $('#CheckoutPaymentMethods'),
		$orderComment: $('#CheckoutSubmitOrderComment'),
		$campaignCode: $('#CheckoutSubmitCampaignCode'),
		$marketingPermissions: $('#CheckoutMarketingPermissions'),

		typingDelay: 3500,

		beforeUpdate: function () {},
		afterUpdate: function () {},

		init: function (config) {
			$.extend(true, this, config);
			if (!this.$klarnaFrame.length) {
				return false;
			}
			this.bindEvents();
			this.runToggles();
			this.reloadKlarnaFrame();

			if (this.$klarnaFrame.length) {
				this.insertSavePostalCodeButton();
			}
		},

		bindEvents: function () {
			this.$checkout.on('click change', '[data-toggle]', $.proxy(this.onToggle, this));
			this.$shippingInformation.on('keydown', 'input', $.proxy(this.onKeyDownShippingInformation, this));
			this.$shippingInformation.on('change', 'select', $.proxy(this.onChangeShippingInformation, this));
			this.$shippingInformation.on('click', 'button.Submit', $.proxy(this.onSubmitShippingInformation, this));
			this.$orderComment.on('change', $.proxy(this.onChangeOrderComments, this));
			this.$campaignCode.on('submit', $.proxy(this.onSubmitCampaignCode, this));
			this.$marketingPermissions.on('change', $.proxy(this.onChangeMarketingPermissions, this));
		},

		onToggle: function (evt) {
			var $input = $(evt.target);
			var $target = $($input.attr('data-toggle'));

			if ($input.is(':checkbox')) {
				$target.toggle($input.is(':checked'));
			} else if ($input.is('a')) {
				evt.preventDefault();
				$target.toggle();
			}

			$input.toggleClass('Active', $target.is(':visible'));
		},

		onKeyDownShippingInformation: function (evt) {
			clearTimeout(this._submitShippingInformation);
			this._submitShippingInformation = setTimeout($.proxy(function () {
				this.submitShippingInformation();
			}, this), this.typingDelay);
		},

		onSubmitShippingInformation: function () {
			clearTimeout(this._submitShippingInformation);
			this.submitShippingInformation();
		},

		onChangeShippingInformation: function () {
			this.submitShippingInformation();
		},

		onChangeOrderComments: function () {
			this.submitOrderComments();
		},

		onSubmitCampaignCode: function (evt) {
			evt.preventDefault();
			this.submitCampaignCode();
		},

		onChangeMarketingPermissions: function (evt) {
			this.submitMarketingPermission($(evt.target));
		},

		runToggles: function () {
			var $commentToggle = $('[data-toggle="#' + this.$orderComment.attr('id') + '"]');
			var hasComment = !!$.trim(this.$orderComment.find('textarea').val());
			this.$orderComment.toggle(hasComment);
			$commentToggle.prop('checked', hasComment);

			var $campaignCodeToggle = $('[data-toggle="#' + this.$campaignCode.attr('id') + '"]');
			var hasCampaignCode = !!$.trim(this.$campaignCode.find('[type="text"]').val());
			this.$campaignCode.toggle(hasCampaignCode);
			$campaignCodeToggle.prop('checked', hasCampaignCode);

			$('a[data-toggle]').each(function (index, elem) {
				var $elem = $(elem);
				var $target = $($elem.attr('data-toggle'));
				$target.toggle($elem.is('.Active'));
			});
		},

		serialize: function ($elem, responseType) {
			if (!responseType) {
				responseType = 'json';
			}
			return $elem.find(':input').serializeArray().concat([
				{ name: 'ajax', value: 1 },
				{ name: 'response_type', value: responseType }
			]);
		},

		insertSavePostalCodeButton: function () {
			var $input = this.$shippingInformation.find('input#postal_code');
			$('<button />')
				.addClass('Button Button-Primary Submit')
				.text(MCF.Locales.get('save'))
				.insertAfter($input);
		},

		submitShippingInformation: function () {
			this.beforeUpdate(this.$shippingInformation);
			var data = this.serialize(this.$shippingInformation, 'html');

			return $.post('/checkout/klarna/', data)
				.then($.proxy(function (html) {
					this.$shippingInformation.html(html);
					this.insertSavePostalCodeButton();
					this.updatePaymentMethods();
					this.reloadKlarnaFrame();
				}, this))
				.always($.proxy(function () {
					this.afterUpdate(this.$shippingInformation);
				}, this));
		},

		submitOrderComments: function () {
			var data = this.serialize(this.$orderComment);
			this.beforeUpdate(this.$orderComment);

			return $.post('/checkout/', data)
				.always($.proxy(function () {
					this.afterUpdate(this.$orderComment);
				}, this));
		},

		submitCampaignCode: function () {
			var $form = this.$campaignCode.find('form');
			var data = this.serialize($form);
			this.beforeUpdate(this.$campaignCode);

			return $.post($form.attr('action'), data)
				.then($.proxy(function (res) {
					$form.html(res.content);
					this.reloadKlarnaFrame();
				}, this))
				.always($.proxy(function () {
					this.afterUpdate(this.$campaignCode);
				}, this));
		},

		submitMarketingPermission: function ($permission) {
			var $form = this.$marketingPermissions.find('form');
			$form.find('[name="action"]').val($permission.attr('name'));

			var data = this.serialize(this.$marketingPermissions);
			this.beforeUpdate(this.$marketingPermissions);

			return $.post($form.attr('action'), data)
				.always($.proxy(function () {
					this.afterUpdate(this.$marketingPermissions);
				}, this));
		},

		updatePaymentMethods: function () {
			var data = { ajax: 1, exclude: 'current' };
			this.beforeUpdate(this.$paymentMethods);

			return $.get('/interface/CheckoutPaymentMethods', data)
				.then($.proxy(function (html) {
					this.$paymentMethods.html(html);
				}, this))
				.always($.proxy(function () {
					this.afterUpdate(this.$paymentMethods);
				}, this));
		},

		reloadKlarnaFrame: function () {
			return $.get('/interface/KlarnaCheckout')
				.then($.proxy(function (res) {
					this.$klarnaFrameWrap.html(res);
					this.$klarnaFrame = $('#KlarnaCheckout');
				}, this));
		}
	};

	$.extend(true, window, { MCF: { KlarnaCheckout: KlarnaCheckout }});
})(jQuery);
