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
	
	se: {
			close: 'Stäng',
			expandImage: 'Expandera bilden',
			loading: 'Laddning...',
			orderCommentSaved: 'Din kommentar har sparats.',
			updating: 'Uppdatering...',
			updatingCart: 'Uppdatering kundvagn...',
			updatingCheckout: 'Uppdatering kassa...',
			next: 'Nästa',
			previous: 'Tidigare'
	},
		
    de: {
			close: 'Schließen',
			expandImage: 'Bild vergrößern',
			loading: 'Laden...',
			orderCommentSaved: 'Auftragsbezeichnung gespeichert.',
			updating: 'Aktualisierung...',
			updatingCart: 'Aktualisierung korn...',
			updatingCheckout: 'Aktualisierung checkout...',
      		next: 'Nächste',
			previous: 'Bisherig'
    },
		
    fr: {
			close: 'Fermer',
			expandImage: 'Agrandir l\'image',
			loading: 'Chargement...',
			orderCommentSaved: 'Commentaire de commande enregistré.',
			updating: 'Mise à jour...',
			updatingCart: 'Mise à jour du panier...',
			updatingCheckout: 'Mise à jour de la caisse...',
      		next: 'Prochain',
			previous: 'Précédent'
    },
		
    es: {
			close: 'Cerrar',
			expandImage: 'Ampliar imagen',
			loading: 'Cargando...',
			orderCommentSaved: 'Ordenar comentario guardado.',
			updating: 'Actualizando...',
			updatingCart: 'Actualización de carrito...',
			updatingCheckout: 'Actualización de la caja...',
      		next: 'Siguiente',
			previous: 'Previou'
    },
		
    pt: {
			close: 'Fechar',
			expandImage: 'Expandir imagem',
			loading: 'Carregando...',
			orderCommentSaved: 'Comentário de ordem salvo.',
			updating: 'Atualizando...',
			updatingCart: 'Atualizando carrinho...',
			updatingCheckout: 'Atualizando checkout...',
      		next: 'Seguinte',
			previous: 'Prévio'
    },
		
    ru: {
			close: 'закрывать',
			expandImage: 'Развернуть изображение',
			loading: 'загрузка...',
			orderCommentSaved: 'Сохранен комментарий о заказе.',
			updating: 'обновлять...',
			updatingCart: 'Обновление корзины...',
			updatingCheckout: 'Обновление Касса...',
      		next: 'Следующее',
			previous: 'предыдущий'
    },
		
		get: function (key) {
			return this[window.MCF.locale.toLowerCase()][key];
		}
  };

	$.extend(true, window, { MCF: { Locales: Locales }});
})();
