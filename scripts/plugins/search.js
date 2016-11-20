/**
 * MyCashflow Default Theme
 * Copyright (c) 2016 Pulse247 Oy
 * MIT License <http://opensource.org/licenses/MIT>
 */
;(function($) {
	'use strict';

	var ENTER_KEY = 13;
	var UP_KEY = 38;
	var DOWN_KEY = 40;

	var Search = function (config) {
		$.extend(true, this, Search.defaults, config);
		this.resultsCache = {};
		this.$search.addClass('LiveSearch');
		this.$liveResults.addClass('LiveSearchResults');
		this.$searchInput.attr('autocomplete', 'off');
		if (!this.$liveResults || !this.$liveResults.length) {
			this.$liveResults = $('<div class="LiveSearchResults"/>').prependTo(this.$search);
		}
		this.bindEvents();
	};

	Search.defaults = {
		beforeUpdate: function () {},
		afterUpdate: function () {},
		$search: $('#LiveSearch'),
		$searchInput: $('#LiveSearch [type="search"]'),
		$liveResults: $('#LiveSearchResults'),
		$fullResults: $('#SearchResults'),
		suggestions: '.SearchSuggestions li',
		helperLiveResults: 'helpers/live-search',
		helperFullResults: 'helpers/search-results',
		keyCodeUp: UP_KEY,
		keyCodeDown: DOWN_KEY
	};

	Search.prototype.bindEvents = function () {
		$(window).on('popstate', $.proxy(this.onPopState, this));
		this.$searchInput.on('focus', $.proxy(this.onSearchInputFocus, this));
		this.$searchInput.on('blur', $.proxy(this.onSearchInputBlur, this));
		this.$searchInput.on('keydown', $.proxy(this.onSearchInputKeyDown, this));
		this.$searchInput.on('keyup', $.proxy(this.onSearchInputKeyUp, this));
		this.$fullResults.on('click', '.SearchFilter a, .SearchSuggestions a', $.proxy(this.onSearchFilterClick, this));
	};

	Search.prototype.onPopState = function () {
		this.getFullResults(window.location.search);
	};

	Search.prototype.onSearchInputFocus = function () {
		this.$searchForm.addClass('Active');
	};

	Search.prototype.onSearchInputBlur = function () {
		window.setTimeout($.proxy(function () {
			this.$searchForm.removeClass('Active');
		}, this), 250);
	};

	Search.prototype.onSearchInputKeyDown = function (evt) {
		var upOrDown = this.isKeyUpOrDown(evt.which);
		if (!upOrDown || !this.$suggestions) {
			return;
		}

		evt.preventDefault();

		if (this.$activeSuggestion) {
			var nextOrPrev = upOrDown === 'down' ? 'next' : 'prev';
			this.$activeSuggestion = this.$activeSuggestion[nextOrPrev]();
		}
		// Could not find an active suggestion, fall back to first/last.
		if (!this.$activeSuggestion || !this.$activeSuggestion.length) {
			var firstOrLast = upOrDown === 'down' ? 'first' : 'last';
			this.$activeSuggestion = this.$suggestions[firstOrLast]();
		}

		this.$suggestions.removeClass('Active');
		this.$activeSuggestion.addClass('Active');

		var searchQuery = $('a', this.$activeSuggestion).first().text();
		this.$searchInput.val(searchQuery);
	};

	Search.prototype.onSearchInputKeyUp = function (evt) {
		clearTimeout(this.typingTimeout);
		if (!this.isKeyUpOrDown(evt.which) && evt.which !== ENTER_KEY) {
			var term = $.trim(this.$searchInput.val());
			this.typingTimeout = setTimeout($.proxy(function() {
				this.getLiveResults(term);
			}, this), 500);
		}
	};

	Search.prototype.onSearchFilterClick = function (evt) {
		evt.preventDefault();

		var href = $(evt.currentTarget).attr('href');
		var q = href.substr(href.lastIndexOf('?'));
		this.getFullResults(q);

		if (window.history) {
			window.history.pushState(null, null, q);
		}
	};

	Search.prototype.isKeyUpOrDown = function (keyCode) {
		if (keyCode === this.keyCodeUp) {
			return 'up';
		} else if (keyCode === this.keyCodeDown) {
			return 'down';
		}
		return false;
	};

	Search.prototype.cacheResults = function (query) {
		var deferred = this.resultsCache[query];
		if (!deferred) {
			deferred = $.get('/interface/Helper' + query);
			this.resultsCache[query] = deferred;
		}
		return deferred;
	};

	Search.prototype.getLiveResults = function (term) {
		var query = '/search/?q=' + term + '&file=' + this.helperLiveResults;
		this.beforeUpdate(this.$liveResults);
		return $.when(this.cacheResults(query))
			.done($.proxy(function (results) {
				this.$searchForm.addClass('Initiated');
				this.$liveResults.html(results);
				this.$suggestions = this.$searchForm.find(this.suggestions);
				this.$activeSuggestion = null;
				this.afterUpdate(this.$liveResults);
			}, this));
	};

	Search.prototype.getFullResults = function (term) {
		var query = '/search/' + term + '&file=' + this.helperFullResults;
		this.beforeUpdate(this.$fullResults);
		return $.when(this.cacheResults(query))
			.done($.proxy(function (results) {
				this.$fullResults.html(results);
				this.afterUpdate(this.$fullResults);
			}, this));
	};

	$.extend(true, window, { MCF: { Search: Search }});
})(jQuery);
