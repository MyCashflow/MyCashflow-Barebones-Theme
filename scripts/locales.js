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
			return this[window.MCF.locale.toLowerCase()][key];
		}
  };

	$.extend(true, window, { MCF: { Locales: Locales }});
})();
