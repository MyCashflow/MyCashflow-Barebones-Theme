/**
 * MyCashflow Default Theme
 * Copyright (c) 2018 Pulse247 Oy
 * MIT License <http://opensource.org/licenses/MIT>
 */
(function($) {
	'use strict';

	var PRICE_REGEX = /,\W([\d\Wa-z]+)$/;
	var uniqId = 1;

	var Variations = {
		selectText: 'Choose',

		init: function(config) {
			$.extend(this, config);
			this.run($('.BuyForm'));
		},

		run: function($forms) {
			var self = this;

			$forms.each(function(index, form) {
				var $form = $(form);
				if ($form.data('variations')) {
					return;
				}

				var $original = $form.find('[class*=BuyFormVariation]');
				$original.hide().after(self.render(self.parse($form)));
				$form.data('variations', true);
			});
		},

		render: function(formData, state) {
			state = state || [];
			var self = this;
			var $items = $('<div class="FormItem Variations" />');

			formData.selections.forEach(function(selection, index) {
				var $item = $('<div class="FormItem" />');
				var $select = $('<select />');
				var statePath = state.slice(0, index);

				var visibleOptions = selection.options.filter(function(option) {
					var optionPath = option.path.slice(0, index);
					return optionPath.join('.') === statePath.join('.');
				});

				if (!visibleOptions.length) {
					return;
				}

				$('<label />')
					.text(selection.attribute)
					.attr('for', selection.id)
					.appendTo($item);

				$select
					.attr('id', selection.id)
					.data('index', index)
					.appendTo($item);

				$('<option />')
					.text(self.selectText)
					.val('')
					.appendTo($select);

				visibleOptions.forEach(function(option) {
					var price = option.price ? '(' + option.price + ')' : null;

					$('<option />')
						.text([option.value, price].join(' '))
						.val(option.value)
						.appendTo($select);
				});

				$select.val(state[index]);
				$item.appendTo($items);

				return $items;
			});

			$items.on('change', 'select', function(evt) {
				var nextState = $items
					.find('select')
					.toArray()
					.slice(0, $(evt.target).data('index') + 1)
					.map(function(select) {
						return $(select).val();
					})
					.filter(function(value) {
						return !!value;
					});

				$items.replaceWith(self.render(formData, nextState));
			});

			var selected = formData.variations.find(function(variation) {
				return variation.path.join('.') === state.join('.');
			});

			formData.submitButton
				.text(formData.submitButtonText)
				.prop('disabled', !selected);

			formData.variations.forEach(function(variation) {
				variation.input.prop('checked', false);
			});

			if (selected) {
				selected.input.prop('checked', true);
			}

			if (selected && (selected.price || selected.availability)) {
				var $availability =
					selected.availability && $('<span />').text(selected.availability);

				$('<div class="FormItem" />')
					.append($availability)
					.appendTo($items);
			}

			return $items;
		},

		parse: function($form) {
			var $variations = $form.find('[class*=BuyFormVariation] label');
			if (!$variations) {
				return null;
			}

			var variations = this.parseVariations($variations);
			var selections = this.variationsToSelections(variations);
			var $submitButton = $form.find('.AddToCart');

			return {
				variations: variations,
				selections: this.variationsToSelections(variations),
				submitButton: $submitButton,
				submitButtonText: $submitButton.text()
			};
		},

		parseVariations: function($variations) {
			var self = this;

			return $variations.toArray().map(function(variation) {
				return self.parseVariation($(variation));
			});
		},

		parseVariation: function($variation) {
			var variation = {
				input: this.parseVariationInput($variation),
				price: this.parseVariationPrice($variation),
				attributes: this.parseVariationAttributes($variation),
				availability: this.parseVariationAvailability($variation)
			};

			variation.path = variation.attributes.map(function(attribute) {
				return attribute.value;
			});

			return variation;
		},

		parseVariationInput: function($variation) {
			return $variation.find('> input');
		},

		parseVariationPrice: function($variation) {
			var match = $.trim($variation.text()).match(PRICE_REGEX);
			return match ? match[1] : undefined;
		},

		parseVariationAttributes: function($variation) {
			return $.trim($variation.text().replace(PRICE_REGEX, ''))
				.split('|')
				.map(function(descriptor) {
					const parts = descriptor.split(':');

					return {
						name: $.trim(parts[0]),
						value: $.trim(parts[1])
					};
				});
		},

		parseVariationAvailability: function($variation) {
			var $availability = $variation.next('.FormHelp');
			return $availability.length ? $.trim($availability.text()) : undefined;
		},

		variationsToSelections: function(variations) {
			return variations.reduce(function(selections, variation) {
				variation.attributes.forEach(function(attribute, index) {
					var selection = selections.find(function(other) {
						return other.attribute === attribute.name;
					});

					if (!selection) {
						var id = 'variations-' + uniqId++;
						selection = { id: id, attribute: attribute.name, options: [] };
						selections.push(selection);
					}

					var path = variation.attributes.slice(0, index).map(function(part) {
						return part.value;
					});

					var option = selection.options.find(function(other) {
						return (
							other.value === attribute.value &&
							other.path.join('.') === path.join('.')
						);
					});

					if (!option) {
						option = { value: attribute.value, path: path };
						selection.options.push(option);
					}

					if (index === variation.attributes.length - 1) {
						option.price = variation.price;
					}
				});

				return selections;
			}, []);
		}
	};

	$.extend(true, window, { MCF: { Variations: Variations } });
})(jQuery);
