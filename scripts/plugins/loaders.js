/**
 * MyCashflow Default Theme
 * Copyright (c) 2016 Pulse247 Oy
 * MIT License <http://opensource.org/licenses/MIT>
 */
;(function ($) {
	'use strict';

	var LOADER_TMPL = [
		'<div class="Loader">',
			'<div class="LoaderSpinner"></div>',
		'</div>'
	].join('');

	function Loader($target, text) {
		this.$target = $target.data('loader', this);
		this.$elem = $(LOADER_TMPL).data('loader', this);

		var appendInside = ['relative', 'static'].indexOf($target.css('position')) === -1;
		this.$elem.appendTo(appendInside ? this.$target : document.body);

		if (!appendInside) {
			this.$elem.css(this.getStyles());
			this.sizeWatch = setInterval($.proxy(function () {
				this.$elem.css(this.getStyles());
			}, this), 25);
		}

		// Fade in only if target's visible.
		if (this.$target.is(':visible')) {
			this.$elem.fadeIn('fast');
		}

		// Create a loading notification.
		if (text && MCF.Notifications) {
			this.notification = MCF.Notifications.loading(text);
		}
	}

	Loader.prototype.hide = function () {
		if (this.notification) {
			setTimeout($.proxy(function () {
				this.notification.hide();
			}, this), 250);
		}
		return this.$elem.fadeOut('fast').promise()
			.then($.proxy(function () {
				this.$target.data('loader', null);
				this.$elem.remove();
			}, this));
	};

	Loader.prototype.getStyles = function () {
		return {
			top: this.$target.offset().top,
			left: this.$target.offset().left,
			width: this.$target.outerWidth(),
			height: this.$target.outerHeight()
		};
	};

	Loader.prototype.update = function () {
		return this.$elem.css(this.getStyles());
	};

	var Loaders = {
		init: function () {},

		show: function ($target, text) {
			if ($target.data('loader')) return this;
			new Loader($target, text);
			return this;
		},

		hide: function ($target) {
			var loader = $target && $target.data('loader');
			if (loader) loader.hide();
			return this;
		}
	};

	$.extend(true, window, { MCF: { Loaders: Loaders }});
})(jQuery);
