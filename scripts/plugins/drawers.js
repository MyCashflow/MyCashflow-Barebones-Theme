/**
 * MyCashflow Default Theme
 * Copyright (c) 2016 Pulse247 Oy
 * MIT License <http://opensource.org/licenses/MIT>
 */
;(function ($) {
	'use strict';

	var Drawers = {
		init: function () {
			this.$container = $(document.body).addClass('DrawerContainer');
			this.$overlay = $('<div class="DrawerOverlay"/>').appendTo(this.$container);
			this.$current = null;
			this.bindEvents();
		},

		bindEvents: function () {
			$(document).on('flick', $.proxy(this.onFlick, this));
			$(document).on('tap', $.proxy(this.onClose, this));
			$(document).on('tap', '.Drawer', $.proxy(this.preventClose, this));
			$(document).on('tap', '[data-drawer-toggle]', $.proxy(this.onToggle, this));
		},

		onFlick: function (evt) {
			if (!this.$current) {
				return;
			}
			var side = this.$current.attr('data-drawer-side');
			if (evt.orientation === 'horizontal' &&
					(side === 'left' && evt.direction === -1 ||
					side === 'right' && evt.direction === 1)) {
					this.close();
			} else if (evt.orientation === 'vertical' &&
					(side === 'top' && evt.direction === -1 ||
					side === 'bottom' && evt.direction === 1)) {
					this.close();
			}
		},

		onClose: function () {
			this.close();
		},

		onToggle: function (evt) {
			this.toggleByName($(evt.currentTarget).attr('data-drawer-toggle'));
			return false;
		},

		preventClose: function (evt) {
			evt.stopPropagation();
		},

		toggleByName: function (name) {
			var $drawer = $('[data-drawer="' + name + '"]');
			if ($drawer.length) {
				this.toggle($drawer);
			}
		},

		toggle: function ($drawer) {
			if (!this.$current) {
				this.open($drawer);
			} else {
				this.close();
			}
		},

		open: function ($drawer) {
			this.$current = $drawer;
			this.$overlay.addClass('Visible');
			this.$container.attr('data-drawer-open', $drawer.attr('data-drawer-side'));
			this.$current.addClass('Open').siblings().removeClass('Open');
		},

		close: function () {
			if (!this.$current) {
				return;
			}
			this.$overlay.removeClass('Visible');
			this.$container.removeAttr('data-drawer-open');
			this.$current.removeClass('Open');
			this.$current = null;
		},

		refresh: function (name) {
			var $drawer = $('[data-drawer="' + name + '"]');
			if (!$drawer.length) {
				return;
			}
			return $.get('/interface/Helper?file=/helpers/drawers/' + name)
				.then(function (html) {
					$drawer.replaceWith(html);
					var deferred = $.Deferred();
					setTimeout(deferred.resolve, 25);
					return deferred;
				});
		}
	};

	$.extend(true, window, { MCF: { Drawers: Drawers }});
})(jQuery);
