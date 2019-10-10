/**
 * MyCashflow Default Theme
 * Copyright (c) 2016 Pulse247 Oy
 * MIT License <http://opensource.org/licenses/MIT>
 */
;(function ($) {
	'use strict';

	var Filters = {
		init: function () {
			this.markActiveGroups();

			// Toggle filter lists open when clicking the label.
			$(document).on('click', '.FilterGroupName', function (evt) {
				var $targetGroup = $(this).parent('.FilterGroup');
				$targetGroup.siblings('.FilterGroup').removeClass('Navigable');
				$targetGroup.toggleClass('Navigable');
				return false;
			});

			// Prevent filter lists from closing when clicking inside them.
			$(document).on('click', '.FilterGroup', function (evt) {
				evt.stopPropagation();
			});

			// Close filter lists when clicking outside them.
			$(document).on('click', function (evt) {
				$('.FilterGroup.Navigable').removeClass('Navigable');				
			});
		},

		markActiveGroups: function () {
			$('.FilterGroup:has(.RemoveFilter)').addClass('ActiveGroup');
		}
	};

	$.extend(true, window, { MCF: { Filters: Filters }});
})(jQuery);
