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

	voeuxApp.init();

});

var voeuxApp = {
	init: function () {
		new this.App();
	}
};

(function () {

	'use strict';

	function App() {

		var that = this;

		this._messages = {
			'client': [
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sed leo tellus. Praesent interdum, mauris at dictum vehicula, lacus sapien consequat ipsum, et sollicitudin ante mi sit amet enim.',
				'Aliquam erat volutpat. Aliquam lacinia congue magna sit amet hendrerit.',
				'Proin vehicula auctor lectus, vel posuere est venenatis eu. Integer leo felis'
			],
			'agence': [
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sed leo tellus. Praesent interdum, mauris at dictum vehicula, lacus sapien consequat ipsum, et sollicitudin ante mi sit amet enim.',
				'Aliquam erat volutpat. Aliquam lacinia congue magna sit amet hendrerit.',
				'Proin vehicula auctor lectus, vel posuere est venenatis eu. Integer leo felis'
			],
			'prospect': [
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sed leo tellus. Praesent interdum, mauris at dictum vehicula, lacus sapien consequat ipsum, et sollicitudin ante mi sit amet enim.',
				'Aliquam erat volutpat. Aliquam lacinia congue magna sit amet hendrerit.',
				'Proin vehicula auctor lectus, vel posuere est venenatis eu. Integer leo felis'
			],
			'boss': [
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sed leo tellus. Praesent interdum, mauris at dictum vehicula, lacus sapien consequat ipsum, et sollicitudin ante mi sit amet enim.',
				'Aliquam erat volutpat. Aliquam lacinia congue magna sit amet hendrerit.',
				'Proin vehicula auctor lectus, vel posuere est venenatis eu. Integer leo felis'
			],
			'comptable-banquier': [
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sed leo tellus. Praesent interdum, mauris at dictum vehicula, lacus sapien consequat ipsum, et sollicitudin ante mi sit amet enim.',
				'Aliquam erat volutpat. Aliquam lacinia congue magna sit amet hendrerit.',
				'Proin vehicula auctor lectus, vel posuere est venenatis eu. Integer leo felis'
			],
			'famille': [
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sed leo tellus. Praesent interdum, mauris at dictum vehicula, lacus sapien consequat ipsum, et sollicitudin ante mi sit amet enim.',
				'Aliquam erat volutpat. Aliquam lacinia congue magna sit amet hendrerit.',
				'Proin vehicula auctor lectus, vel posuere est venenatis eu. Integer leo felis'
			],
			'enfants': [
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sed leo tellus. Praesent interdum, mauris at dictum vehicula, lacus sapien consequat ipsum, et sollicitudin ante mi sit amet enim.',
				'Aliquam erat volutpat. Aliquam lacinia congue magna sit amet hendrerit.',
				'Proin vehicula auctor lectus, vel posuere est venenatis eu. Integer leo felis'
			],
			'belle-famille': [
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sed leo tellus. Praesent interdum, mauris at dictum vehicula, lacus sapien consequat ipsum, et sollicitudin ante mi sit amet enim.',
				'Aliquam erat volutpat. Aliquam lacinia congue magna sit amet hendrerit.',
				'Proin vehicula auctor lectus, vel posuere est venenatis eu. Integer leo felis'
			],
			'cible-amoureuse': [
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sed leo tellus. Praesent interdum, mauris at dictum vehicula, lacus sapien consequat ipsum, et sollicitudin ante mi sit amet enim.',
				'Aliquam erat volutpat. Aliquam lacinia congue magna sit amet hendrerit.',
				'Proin vehicula auctor lectus, vel posuere est venenatis eu. Integer leo felis'
			],
			'ex': [
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sed leo tellus. Praesent interdum, mauris at dictum vehicula, lacus sapien consequat ipsum, et sollicitudin ante mi sit amet enim.',
				'Aliquam erat volutpat. Aliquam lacinia congue magna sit amet hendrerit.',
				'Proin vehicula auctor lectus, vel posuere est venenatis eu. Integer leo felis'
			]
		};

		this._typedSelector = '#message-typed';
		this._typeMenu = new voeuxApp.TypeMenu();
		this._menu = new voeuxApp.Menu();
		this._msgSlider = new voeuxApp.MessageSlider();

		this._iptSender = $('#ipt-sender');
		this._iptReceiver = $('#ipt-receiver');

		this._msgReceiverZone = $('#receiver-zone');

		this._typeMenuItems = this._typeMenu.getItems();
		this._typeMenuItems.bind('click', function (e) {
			that._onTypeSelection(e, $(this));
		});

		this._menu.onShowMessageSection(function () {
			that._onShowMessageSection();
		});

		this._msgSlider.onChangeMessageItem(function(newId){
			that._onChangeMessageItem(newId);
		});

	}

	App.prototype = {

		_onTypeSelection: function (evt, element) {
			this._menu.goToItem(0);
		},

		_onShowMessageSection: function () {
			this._msgReceiverZone.empty();
			this._msgSlider.activateItem(0);
			this._msgReceiverZone.text(this._iptReceiver.val());
		},

		_onChangeMessageItem : function(newId){
			this.showTypedMessage(newId);
		},

		showTypedMessage : function(id){
			var currentType = this._typeMenu.getCurrentType();
			$(this._typedSelector).typed('reset');
			$(this._typedSelector).typed({
				strings: [this._messages[currentType][id]]
			});
		}

	};

	voeuxApp.App = App;

})();

(function () {

	'use strict';

	function TypeMenu() {

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

	TypeMenu.prototype = {

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

		},

		getItems: function () {
			return this._items;
		},

		getCurrentType: function () {
			return this._itemLocked;
		}

	};

	voeuxApp.TypeMenu = TypeMenu;

}());

(function () {

	'use strict';

	function Menu() {

		var that = this;

		this._callbacks = [];
		this._cont = $('main');
		this._navCont = $('#head-nav');
		this._items = $('a[data-target]', this._navCont);
		this._sections = $('section[data-section]', this._cont);

		this._items.bind('click', function (e) {
			that._onItemsClick(e, $(this));
		});

	}

	Menu.prototype = {

		_callOnShowMessageSectionCallbacks: function () {
			for (var i = 0; i < this._callbacks.length; i++) {
				this._callbacks[i]();
			}
		},

		onShowMessageSection: function (callback) {
			this._callbacks.push(callback);
		},

		_onItemsClick: function (evt, element) {
			this._items.removeClass('sel');
			element.addClass('sel');
			var sectionToShow = element.data('target');
			this.showSection(sectionToShow);

		},

		showSection: function (sectionToShow) {
			this._sections.removeClass('show');
			var section = this._sections.filter('[data-section="' + sectionToShow + '"]');
			section.stop(true, false);
			section.addClass('show');

			if (sectionToShow === 'receiver' || sectionToShow === 'sender') {
				$('input[type="text"]', section).focus();
			} else if (sectionToShow === 'message') {
				this._callOnShowMessageSectionCallbacks();
			}

		},

		goToItem: function (index) {
			this._items.eq(index).trigger('click');
		}

	}

	voeuxApp.Menu = Menu;

})();

(function(){

	'use strict';

	function MessageSlider(){

		var that = this;

		this._callbacks = [];

		this._previousId = null;
		this._currentId = null;
		this._cont = $('#message-container');
		this._navCont = $('.msg-nav', this._cont);
		this._items = $('a', this._navCont);

		this._items.bind('click', function(e){
			that._onItemsClick(e, $(this));
		})

	}

	MessageSlider.prototype = {

		_callOnChangeMessageItem : function(newId){
			for (var i = 0; i < this._callbacks.length; i++) {
				this._callbacks[i](newId);
			}
		},

		_onItemsClick : function(evt, element){
			this.activateItem(element.closest('li').index());
		},

		activateItem : function(newId){
			this._previousId = this._currentId;
			this._currentId = newId;
			this._items.removeClass('active');
			this._items.eq(newId).addClass('active');
			this._callOnChangeMessageItem(newId);
		},

		getPreviousId : function(){
			return this._previousId;
		},

		getCurrentId : function(){
			return this._currentId;
		},

		onChangeMessageItem : function(callback){
			this._callbacks.push(callback);
		}

	};

	voeuxApp.MessageSlider = MessageSlider;

})();




