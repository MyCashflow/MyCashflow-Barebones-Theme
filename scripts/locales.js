/**
 * MyCashflow Default Theme
 * Copyright (c) 2015 Pulse247 Oy
 * MIT License <http://opensource.org/licenses/MIT>
 */
;(function () {
	'use strict';

	var Locales = {
		en: {
			close: 'Close',
			expandImage: 'Expand image',
			loading: 'Loading...',
			orderCommentSaved: 'Order comment saved.',
			updating: 'Updating...',
			updatingCart: 'Updating cart...',
			updatingCheckout: 'Updating checkout...',
			next: 'Next',
			previous: 'Previous'
		},

		fi: {
			close: 'Sulje',
			expandImage: 'Näytä suurempana',
			loading: 'Ladataan...',
			orderCommentSaved: 'Kommenttisi on tallennettu.',
			updating: 'Päivitetään...',
			updatingCart: 'Ostoskoria päivitetään...',
			updatingCheckout: 'Kassaa päivitetään...',
			next: 'Seuraava',
			previous: 'Edellinen'
		},

		get: function (key) {
			var locale = window.MCF.locale.toLowerCase();
			if (!!this[locale] && !!this[locale][key]) {
				return this[locale][key];
			}
			else if (!!window.MCF.dictionary && !!window.MCF.dictionary[key]) {
				return window.MCF.dictionary[key];
			}
			return this.en[key] || key;
		}
	};

	$.extend(true, window, { MCF: { Locales: Locales }});
})();
