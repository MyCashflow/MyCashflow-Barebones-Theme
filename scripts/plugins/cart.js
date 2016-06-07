/**
 * MyCashflow Default Theme
 * Copyright (c) 2016 Pulse247 Oy
 * MIT License <http://opensource.org/licenses/MIT>
 */
;(function ($) {
	'use strict';

	var Cart = {
		updateDelay: 500,

		init: function (config) {
			$.extend(true, this, config);
			this.bindEvents();
		},

		bindEvents: function () {
			$(document).on('submit', '.BuyForm[action="/cart/"]', $.proxy(this.onAddProduct, this));
			$(document).on('change', '[action="/cart/update/"]', $.proxy(this.onUpdate, this));
			$(document).on('click', 'a[href^="/cart/delete/"]', $.proxy(this.onRemoveProduct, this));
		},

		onAddProduct: function (evt) {
			var $buyForm = $(evt.currentTarget);
			var $fileInputs = $buyForm.find('input[type="file"]');
			if ($fileInputs.length) {
				return true;
			}
			evt.preventDefault();
			this.addProduct($buyForm);
		},

		onUpdate: function (evt) {
			clearTimeout(this.updateTimeout);
			this.updateTimeout = setTimeout($.proxy(function () {
				evt.preventDefault();
				this.updateCart($(evt.currentTarget));
			}, this), this.updateDelay);
		},

		onRemoveProduct: function (evt) {
			evt.preventDefault();
			this.removeProduct($(evt.currentTarget));
		},

		updateCart: function ($cart) {
			if (this.beforeUpdate) {
				this.beforeUpdate($cart);
			}
			return $.post($cart.attr('action'), $cart.serializeArray())
				.then($.proxy(function () {
					if (this.afterUpdate) {
						this.afterUpdate($cart);
					}
				}, this));
		},

		addProduct: function ($buyForm) {
			if (this.beforeAddProduct) {
				this.beforeAddProduct($buyForm);
			}
			var data = $buyForm.serializeArray().concat([
				{ name: 'ajax', value: 1 },
				{ name: 'response_type', value: 'json' }
			]);
			return $.post($buyForm.attr('action'), data)
				.then($.proxy(function () {
					if (this.afterAddProduct) {
						this.afterAddProduct($buyForm);
					}
				}, this));
		},

		removeProduct: function ($removeLink) {
			if (this.beforeRemoveProduct) {
				this.beforeRemoveProduct($removeLink);
			}
			return $.get($removeLink.attr('href') + '?ajax=1')
				.then($.proxy(function () {
					if (this.afterRemoveProduct) {
						this.afterRemoveProduct($removeLink);
					}
				}, this));
		}
	};

	$.extend(true, window, { MCF: { Cart: Cart }});
})(jQuery);
