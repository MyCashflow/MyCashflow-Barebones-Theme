/**
 * MyCashflow Default Theme
 * Copyright (c) 2015 Pulse247 Oy
 * MIT License <http://opensource.org/licenses/MIT>
 */
$(document).ready(function () {
	'use strict';

	$.ajaxSetup({
		cache: false
	});

	$.Finger = {
		flickDuration: 150,
		motionThreshold: 5
	};

	$.each([
		'Drawers',
		'Loaders',
		'Navigations',
		'Notifications',
		'Spinners',
		'Tabs'
	], function (index, name) {
		var plugin = MCF[name];
		if (plugin) {
			plugin.init();
		}
	});

	new MCF.Search({
		$searchForm: $('#LiveSearch'),

		beforeUpdate: function ($elem) {
			MCF.Loaders.show($elem);
		},

		afterUpdate: function ($elem) {
			MCF.Loaders.hide($elem);
		}
	});

	MCF.Theme.init({
		updateCarts: function () {
			return $.when([
				this.updateFullCart(),
				this.updateMiniCarts()
			]);
		},

		updateFullCart: function () {
			var $fullCart = $('.FullCart').first();
			if (!$fullCart.length) {
				return;
			}
			var $products = $fullCart.find('.Product');
			if ($products.length) {
				MCF.Loaders.show($fullCart);
			} else {
				$fullCart.remove();
				return;
			}
			return $.get('/interface/Helper?file=helpers/full-cart')
				.then(function (html) {
					$fullCart.html(html);
					MCF.Spinners.wrapInputs($fullCart);
					MCF.Loaders.hide($fullCart);
				});
		},

		updateMiniCarts: function () {
			var $miniCarts = $('.MiniCart');
			if (!$miniCarts.length) {
				return;
			}
			$miniCarts.each(function () {
				var $cart = $(this);
				var $drawer = $cart.closest('.Drawer');
				if ($cart.is(':visible') && !$drawer.length) {
					MCF.Loaders.show($cart);
				}
			});
			return $.get('/interface/Helper?file=helpers/mini-cart')
				.then(function (html) {
					$miniCarts.each(function () {
						var $cart = $(this);
						$cart.children(':not(.Loader)').remove();
						$cart.append(html);
						MCF.Loaders.hide($cart);
					});
				});
		},

		skipNotifications: function (ajaxSettings) {
			// Skip spam when filling checkout address information.
			var $focused = $('#CheckoutBillingAddress, #CheckoutShippingAddress').find(':focus');
			if (ajaxSettings.url === '/checkout/' && $focused.length) {
				return true;
			}
		}
	});

	MCF.Cart.init({
		beforeUpdate: function ($cart) {
			MCF.Loaders.show($cart);
		},

		afterUpdate: function ($cart) {
			MCF.Loaders.hide($cart);
			MCF.Theme.updateCarts();
		},

		beforeAddProduct: function ($buyForm) {
			MCF.Loaders.show($buyForm);
		},

		afterAddProduct: function ($buyForm) {
			MCF.Loaders.hide($buyForm);
			MCF.Theme.updateMiniCarts()
				.then(function () {
					MCF.Drawers.toggleByName('cart');
				});
		},

		beforeRemoveProduct: function ($removeLink) {
			var $product = $removeLink.closest('.Product');
			$product.fadeOut('fast');
		},

		afterRemoveProduct: function () {
			MCF.Theme.updateCarts();
		}
	});

	MCF.Checkout.init({
		afterUpdate: function () {
			MCF.Theme.updateMiniCarts();
		},

		beforeUpdatePart: function ($part) {
			MCF.Loaders.show($part);
		},

		afterUpdatePart: function ($part) {
			MCF.Loaders.hide($part);
		}
	});

	MCF.KlarnaCheckout.init({
		beforeUpdate: function ($element) {
			MCF.Loaders.show($element);
		},

		afterUpdate: function ($element) {
			MCF.Loaders.hide($element);
			MCF.Theme.updateMiniCarts();

			if ($element.is('#CheckoutSubmitOrderComment')) {
				MCF.Notifications.success(MCF.Locales.get('orderCommentSaved'));
			}
		}
	});

	MCF.Modals.init({
		tClose: MCF.Locales.get('close'),
		tLoading: MCF.Locales.get('loading'),
		gallery: {
			tPrev: MCF.Locales.get('previous'),
			tNext: MCF.Locales.get('next')
		}
	});

	MCF.Images.init({
		transitionEffect: false,
		textClickZoomHint: MCF.Locales.get('expandImage'),
		textHoverZoomHint: MCF.Locales.get('expandImage'),
		textExpandHint: MCF.Locales.get('expandImage'),
		textBtnClose: MCF.Locales.get('close'),
		textBtnPrev: MCF.Locales.get('previous'),
		textBtnNext: MCF.Locales.get('next')
	});

	MCF.Sliders.init({
		'default': {
			adaptiveHeight: false,
			arrows: true,
			dots: false,
			easing: 'swing',
			swipeToSlide: true,
			prevArrow:
				'<button class="Button slick-prev">' +
					'<span class="fa fa-angle-left"></span>' +
				'</button>',
			nextArrow:
				'<button class="Button slick-next">' +
					'<span class="fa fa-angle-right"></span>' +
				'</button>'
		},
		'banners-wide': {
			autoplay: true,
			autoplaySpeed: 5000,
			slidesToShow: 1
		},
		'banners-side': {
			autoplay: true,
			autoplaySpeed: 5000,
			slidesToShow: 1
		},
		'grid-list': {
			slidesToShow: 5,
			responsive: [
				{ breakpoint: MCF.Theme.breakpoints['desktop'] + 1, settings: { slidesToShow: 4 } },
				{ breakpoint: MCF.Theme.breakpoints['mobile-wide'] + 1, settings: { slidesToShow: 3 } },
				{ breakpoint: MCF.Theme.breakpoints['mobile'] + 1, settings: { slidesToShow: 2 } }
			]
		},
		'grid-list-narrow': {
			slidesToShow: 4,
			responsive: [
				{ breakpoint: MCF.Theme.breakpoints['mobile-wide'] + 1, settings: { slidesToShow: 3 } },
				{ breakpoint: MCF.Theme.breakpoints['mobile'] + 1, settings: { slidesToShow: 2 } }
			]
		},
		'grid-list-wide': {
			slidesToShow: 6,
			responsive: [
				{ breakpoint: MCF.Theme.breakpoints['desktop'] + 1, settings: { slidesToShow: 4 } },
				{ breakpoint: MCF.Theme.breakpoints['mobile-wide'] + 1, settings: { slidesToShow: 3 } },
				{ breakpoint: MCF.Theme.breakpoints['mobile'] + 1, settings: { slidesToShow: 2 } }
			]
		}
	});

	MCF.Variations.init({
		selectText: MCF.Locales.get('choose')
	});

	$(document).on('click', '[href="/terms/"]', function () {
		MCF.Drawers.toggleByName('terms');
		return false;
	});

	$(document).on('click', '.Drawer .GiftCardDetails', function () {
		MCF.Drawers.toggleByName('gift-cards');
		return false;
	});

	$(document).on('change', '[data-auto-submit]', function (evt) {
		$(evt.currentTarget).closest('form').submit();
	});

	$(document).on('ajaxSuccess', function (evt, xhr, settings) {
		if (MCF.Theme.skipNotifications(settings)) {
			return;
		}
		var json;
		try {
			json = $.parseJSON(xhr.responseText);
		} catch (e) {
			MCF.Notifications.createFromHtml(xhr.responseText);
		}
		if (json && json.notifications) {
			MCF.Notifications.createFromJson(json);
		}
	});

	$('#StickyNavigation').hcSticky({
		stickTo: document
	});

	$('#StickyCart').hcSticky({
		stickTo: '.SiteBody',
		top: 80,
		bottomEnd: 80
	});
});
