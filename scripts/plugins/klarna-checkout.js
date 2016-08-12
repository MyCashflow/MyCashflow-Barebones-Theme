/**
 * MyCashflow Default Theme
 * Copyright (c) 2016 Pulse247 Oy
 * MIT License <http://opensource.org/licenses/MIT>
 */
;(function ($) {
	'use strict';

	var KlarnaCheckout = {
		$klarnaFrame: $('#KlarnaCheckout'),
		$checkout: $('#Checkout'),
		$shippingInformation: $('#CheckoutShippingInformation'),
		$paymentMethods: $('#CheckoutPaymentMethods'),
		$orderComment: $('#CheckoutSubmitOrderComment'),
		$campaignCode: $('#CheckoutSubmitCampaignCode'),
		$marketingPermissions: $('#CheckoutMarketingPermissions'),

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
		},

		bindEvents: function () {
			this.$checkout.on('click change', '[data-toggle]', $.proxy(this.onToggle, this));
			this.$shippingInformation.on('change', $.proxy(this.onChangeShippingInformation, this));
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
				if ($elem.is('.Active')) {
					$target.show();
				} else {
					$target.hide();
				}
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

		submitShippingInformation: function () {
			this.beforeUpdate(this.$shippingInformation);
			var data = this.serialize(this.$shippingInformation, 'html');

			return $.post('/checkout/klarna/', data)
				.then($.proxy(function (html) {
					this.$shippingInformation.html(html);
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
					this.$klarnaFrame.html(res);
				}, this));
		}
	};

	$.extend(true, window, { MCF: { KlarnaCheckout: KlarnaCheckout }});
})(jQuery);
