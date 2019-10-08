/**
 * MyCashflow Default Theme
 * Copyright (c) 2016 Pulse247 Oy
 * MIT License <http://opensource.org/licenses/MIT>
 */
;(function ($) {
	'use strict';

	$.fn.activeFilterGroups = function() {
		var active = 'ActiveGroup';

		$(this).each(function() {
			var filterGroup = $(this);
			var filterOptions = filterGroup.find('li');
			if (filterOptions.find(':not(.ApplyFilter)').length !== 0) {
				filterGroup.addClass(active);
			}
		});
	};
	$('.FilterGroup').activeFilterGroups();

	$.fn.clearSelected = function() {
		var active = 'Selected';
		$(this).each(function() {
			var filterGroup = $(this);
			$('li', filterGroup).removeClass(active);
		});
	};

	$(document).on('click', '.FilterGroupName', function (evt) {
		evt.preventDefault();
		var filterGroup = $(this).parent('.FilterGroup'),
		filterList = $(this).next('.FilterList');
		filterGroup.toggleClass('Navigable');
		filterList.focus();
	});

	$(document).on('click', '.FilterList a', function (evt) {
		evt.preventDefault();
		$(this).closest('li').toggleClass('Selected');
		location.href = $(this).attr('href');
	});

	$('.FilterList').on({
		focusout: function () {
			$(this).data('timer', setTimeout(function () {
				$(this).parent('.FilterGroup').removeClass('Navigable').clearSelected();
			}.bind(this), 0));
		},
		focusin: function () {
			clearTimeout($(this).data('timer'));
		}
	});

	$('.FilterGroupName').on({
		focusout: function () {
			$(this.hash).data('timer', setTimeout(function () {
				$(this).parent('.FilterGroup').removeClass('Navigable');
			}.bind(this.hash), 0));
		},
		focusin: function () {
			clearTimeout($(this.hash).data('timer'));
		}
	});
})(jQuery);
