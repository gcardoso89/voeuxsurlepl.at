$(function () {

	var submitBtn = $('input[type=submit]', $('form'));
	submitBtn.bind('click.ContactForm', function (e) {
		e.preventDefault();
		$.ajax({
			type: "POST",
			url: "/savePostcard",
			data: $('form').serialize(),
			success: function (data) {
				console.log(data);
			},
			error: function () {
				console.log("ERRO");
			}
		});
	});

	new voeuxApp.Menu();

});

var voeuxApp = {};

(function () {

	function Menu() {

		var that = this;

		this._base = $('#base');
		this._cont = $('#menu-type');
		this._items = $('a', this._cont);
		this._itemLocked = null;

		this._items.bind('click', function (e) {
			that._onItemsClick(e, $(this));
		});

		this._items.bind('mouseenter', function (e) {
			that._onItemsHover(e, $(this));
		});

		this._items.bind('mouseleave', function (e) {
			that._onItemsOut(e, $(this));
		});

	}

	Menu.prototype = {

		_onItemsClick: function (evt, element) {

			var type = element.data('type');

			evt.preventDefault();
			this._items.removeClass('sel');
			element.addClass('sel');
			this.selectBaseBackground(type);
			this._itemLocked = type;

		},

		_onItemsHover: function (evt, element) {

			this.selectBaseBackground(element.data('type'));

		},

		_onItemsOut: function (evt, element) {

			if (this._itemLocked !== null && this._itemLocked !== '') {
				this.selectBaseBackground(this._itemLocked);
			} else {
				this._base.removeAttr('class');
			}

		},

		selectBaseBackground: function (type) {

			this._base.removeAttr('class');
			this._base.addClass('bg-' + type);

		}

	};

	voeuxApp.Menu = Menu;

}());


