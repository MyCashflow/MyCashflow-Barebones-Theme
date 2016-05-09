/**
 * MyCashflow Default Theme
 * Copyright (c) 2016 Pulse247 Oy
 * MIT License <http://opensource.org/licenses/MIT>
 */
;(function ($) {
	'use strict';

	var Navigations = {
		navigations: '.DrawerNavigation',
		expandables: '.HasSubCategories',

		init: function () {
			this.addExpanders(this.navigations);
			this.expandCurrent(this.navigations);
			this.bindEvents();
		},

		bindEvents: function () {
			$(document).on('click', '.NavigationExpander', this.expand);
		},

		addExpanders: function (navSelectors) {
			$(this.expandables, navSelectors).find('> a').each($.proxy(function (index, el) {
				this.addExpander($(el));
			}, this));
		},

		addExpander: function ($navItem) {
			var toggleHtml = '<span class="NavigationExpander"></span>';
			$navItem.append(toggleHtml);
		},

		expand: function (evt) {
			evt.preventDefault();
			var $expander = $(evt.target);
			$expander.add($expander.closest('.HasSubCategories')).toggleClass('Open');
		},

		expandCurrent: function (navSelectors) {
			var $navItems = $('.Current', navSelectors);
			$navItems.add($navItems.find('> a > .NavigationExpander')).addClass('Open');
		}
	};

	$.extend(true, window, { MCF: { Navigations: Navigations }});
})(jQuery);
