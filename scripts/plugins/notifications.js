/**
 * MyCashflow Default Theme
 * Copyright (c) 2016 Pulse247 Oy
 * MIT License <http://opensource.org/licenses/MIT>
 */
;(function ($) {
	'use strict';

	var NOTIFICATION_TTL = 5000;

	function Notification(type, html) {
		this.$elem = $('<div class="Notification"/>')
			.data('notification', this)
			.html(html)
			.appendTo('.NotificationCenter')
			.hide()
			.addClass(type)
			.slideDown('fast');

		this.hideTimeout = setTimeout($.proxy(function () {
			this.hide();
		}, this), NOTIFICATION_TTL);
	}

	Notification.prototype.hide = function () {
		clearTimeout(this.hideTimeout);
		this.$elem.slideUp('fast', $.proxy(function () {
			this.$elem.remove();
		}, this));
	};

	var Notifications = {
		init: function () {
			var $notificationCenters = $('.NotificationCenter');
			if (!$notificationCenters.length) {
				$('<div class="NotificationCenter"/>').appendTo(document.body);
			}
		},

		createFromElements: function ($notifications) {
			$notifications.each($.proxy(function (index, notification) {
				this.createFromElement($(notification));
			}, this));
		},

		createFromElement: function ($notification) {
			if ($notification.is('.Success')) {
				this.success($notification.html());
			} else if ($notification.is('.Error')) {
				this.error($notification.html());
			}
		},

		createFromHtml: function (html) {
			var $notifications = $('<div/>').html(html).find('.Notification');
			this.createFromElements($notifications);
		},

		createFromJson: function (json) {
			this.createFromElements($(json.notifications));
		},

		create: function (type, html) {
			return new Notification(type, html);
		},

		success: function (html) {
			return this.create('Success', html);
		},

		error: function (html) {
			return this.create('Error', html);
		},

		loading: function (html) {
			return this.create('Loading', html);
		},

		message: function (html) {
			return this.create(undefined, html);
		}
	};

	$.extend(true, window, { MCF: { Notifications: Notifications }});
})(jQuery);
