var voeuxApp = {
	init: function (messagesArray) {

		var messagesObj = {};

		for (var i = 0; i < messagesArray.length; i++) {
			var messageElement = messagesArray[i];
			messagesObj[messageElement.name] = messageElement.messages;
		}

		new this.App(messagesObj);
	}
};

(function () {

	'use strict';

	function App(messages) {

		var that = this;

		this._messages = messages;
		this.ajaxReq = null;
		this._isSubmiting = false;
		this._submited = false;

		this._typedSelector = '#message-typed';
		this._typeMenu = new voeuxApp.TypeMenu();
		this._menu = new voeuxApp.Menu();
		this._msgSlider = new voeuxApp.MessageSlider();
		this._socialLinks = new voeuxApp.SocialLinks();

		this._formSender = $('#form-sender');
		this._iptSender = $('#ipt-sender');
		this._formReceiver = $('#form-receiver');
		this._iptReceiver = $('#ipt-receiver');
		this._iptToken = $('#ipt-token');

		this._typedContainer = $('#message-typed-container');
		this._msgReceiverZone = $('#receiver-zone');

		this._editMessageBtn = $('[data-action="edit"]');
		this._editMessageArea = $('#message-edit');

		this._createBtn = $('[data-action="create"]');
		this._restartBtn = $('[data-action="restart"]');


		this._typeMenuItems = this._typeMenu.getItems();
		this._typeMenuItems.bind('click', function (e) {
			that._onTypeSelection(e, $(this));
		});

		this._customMessageActive = false;
		this._currentId = 0;

		this._finalBlock = $('#final-block');
		this._finalLink = $('#final-link');

		this._menu.onShowMessageSection(function () {
			that._onShowMessageSection();
		});

		this._msgSlider.onChangeMessageItem(function (newId) {
			that._onChangeMessageItem(newId);
		});

		this._editMessageBtn.bind('click', function (e) {
			that._onEditMessageBtnClick(e);
		});

		this._createBtn.bind('click', function (e) {
			that._onCreateButtonClick(e);
		});

		this._restartBtn.bind('click', function (e) {
			that._onRestartButtonClick(e);
		});

		this._formSender.bind('submit', function(e) {
			that._onFalseFormSubmit(e, 'final');
			that._onCreateButtonClick(e);
			that._iptSender.blur();
			return false;
		});

		this._formReceiver.bind('submit', function(e) {
			that._onFalseFormSubmit(e, 'message');
			that._iptReceiver.blur();
			return false;
		});

	}

	App.prototype = {

		_onFalseFormSubmit : function(e, sectionToShow){
			e.preventDefault();
			e.stopPropagation();
			this._menu.showSection(sectionToShow);
		},

		_onTypeSelection: function (evt, element) {
			this._menu.showSection('receiver', this._typeMenu.getScrollDuration());
		},

		_onShowMessageSection: function () {
			this._msgReceiverZone.empty();
			this._msgReceiverZone.text(this._iptReceiver.val());
			if (!this._customMessageActive) {
				this._msgSlider.activateItem(0);
			}
		},

		_onChangeMessageItem: function (newId) {
			this.showTypedMessage(newId);
		},

		_onEditMessageBtnClick: function (evt) {
			evt.preventDefault();
			this._customMessageActive = true;
			$(this._typedSelector).typed('reset');
			this._editMessageArea.val(this._messages[ this._typeMenu.getCurrentType() ][ this._currentId ]);
			this._editMessageArea.css("display", "block");
			this._editMessageArea.focus();

		},

		_resetEditMessageArea: function () {
			if (this._customMessageActive) {
				this._editMessageArea.hide();
				this._editMessageArea.val();
				this._customMessageActive = false;
			}
		},

		_onCreateButtonClick: function (evt) {

			evt.preventDefault();

			if ( !this._menu.checkIfCanCreateCard() || this._isSubmiting || this._submited ){
				return false;
			}

			this._isSubmiting = true;

			var that = this;
			var currentType = this._typeMenu.getCurrentType();
			var card = {};

			card.token = this._iptToken.val();
			card.type = currentType;
			if (this._customMessageActive) {
				card.message = this._editMessageArea.val();
			} else {
				card.message = this._messages[ currentType ][ this._currentId ];
			}
			card.sender = this._iptSender.val();
			card.receiver = this._iptReceiver.val();

			if ( this.ajaxReq ){
				this.ajaxReq.abort();
			}

			this.ajaxReq = $.ajax({
				type: "POST",
				url: "/savePostcard",
				data: card,
				success: function (data) {
					that._onSaveCardSuccess(data);
					that._isSubmiting = false;
					that._submited = true;
				},
				error: function () {
					that._isSubmiting = false;
				}
			});

		},

		_onSaveCardSuccess: function (data) {

			var url = 'http://' + location.host + '/' + data.cardId;
			var text = 'voeuxsurlepl.at/' + data.cardId;

			this._socialLinks.setSocialLinks(data.cardId);

			this._finalLink.attr('href', url);
			this._finalLink.text(text);

			this._finalBlock.addClass('success');

			this._restartForm();

		},

		_restartForm: function () {
			this._iptSender.val('');
			this._iptReceiver.val('');
			this._menu.blockStatesAfterSend();
			this._resetEditMessageArea();
		},

		_onRestartButtonClick: function (evt) {
			evt.preventDefault();
			location.reload(true);
		},

		showTypedMessage: function (id) {
			this._currentId = id;
			this._resetEditMessageArea();
			$(this._typedSelector).typed('reset');
			$(this._typedSelector).typed({
				strings: [this._messages[ this._typeMenu.getCurrentType() ][ this._currentId ]]
			});
		}

	};

	voeuxApp.App = App;

})();

(function () {

	'use strict';

	function TypeMenu() {

		var that = this;

		this._scrollToDuration = null;
		this._base = $('#base');
		this._cont = $('#menu-type');
		this._main = $('main');
		this._items = $('a', this._cont);
		this._itemLocked = null;
		this._scrollable = $('html,body');
		this._win = $(window);

		this._items.bind('click', function (e) {
			that._onItemsClick(e, $(this));
		});

		this._items.bind('mouseenter', function (e) {
			that._onItemsHover(e, $(this));
		});

		this._items.bind('mouseleave', function (e) {
			that._onItemsOut(e, $(this));
		});

		this._win.bind('resize', function(){
			that._resizeHandler();
		});

		this._resizeHandler();

	}

	TypeMenu.prototype = {

		_onItemsClick: function (evt, element) {

			var type = element.data('type');

			evt.preventDefault();
			this._items.removeClass('sel');
			element.addClass('sel');
			this.selectBaseBackground(type);
			this._itemLocked = type;
			this._resizeHandler();
			if ( this._win.width() < 750 ){
				this._scrollable.stop(true, false);
				this._scrollable.animate({scrollTop : this._main.offset().top }, this._scrollToDuration);
			}

		},

		_resizeHandler : function(){
			if (this._win.width() < 750 && this._itemLocked){
				this._main.addClass('show');
				this._scrollToDuration = 1200;
			} else {
				this._scrollToDuration = null;
			}
		},

		_onItemsHover: function (evt, element) {

			//this.selectBaseBackground(element.data('type'));

		},

		_onItemsOut: function (evt, element) {

			/*if (this._itemLocked !== null && this._itemLocked !== '') {
				this.selectBaseBackground(this._itemLocked);
			} else {
				this._base.removeAttr('class');
			}*/

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
		},

		getScrollDuration: function(){
			return this._scrollToDuration;
		}

	};

	voeuxApp.TypeMenu = TypeMenu;

}());

(function () {

	'use strict';

	function Menu() {

		var that = this;

		this._callbacks = [];
		this._menuState = {
			'receiver': 1,
			'message': 0,
			'sender': 0,
			'final': 0
		};
		this._cont = $('main');
		this._navCont = $('#head-nav');
		this._items = $('a[data-target]', this._navCont);
		this._btns = $('.btn[data-target]', this._cont);
		this._sections = $('section[data-section]', this._cont);

		this._iptReceiver = $('#ipt-receiver');

		this._items.bind('click', function (e) {
			that._onItemsClick(e, $(this));
		});

		this._btns.bind('click', function (e) {
			that._onItemsClick(e, $(this));
		});

		this._iptReceiver.bind('keyup', function (e) {
			that._onIptReceiverKeyUp($(this));
		});

		this._processStates();

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
			evt.preventDefault();
			var sectionToShow = element.data('target');
			this.showSection(sectionToShow);
		},

		_onIptReceiverKeyUp: function (element) {
			if (element.val() !== '') {
				this.changeMenuState('message', 1);
			} else {
				this.changeMenuState('message', 0);
			}
		},

		_processStates : function(){

			for (var i = 0; i < this._items.length; i++) {
				var item = this._items.eq(i);
				var section = item.data('target');
				if ( this._menuState[section] ){
					item.removeClass('inactive');
				} else {
					item.addClass('inactive');
				}
			}

		},

		checkIfCanCreateCard : function(){
			return !!this._menuState['final'];
		},

		blockStatesAfterSend : function(){
			this._menuState['message'] = 0;
			this._menuState['sender'] = 0;
			this._menuState['receiver'] = 0;
			this._processStates();
		},

		changeMenuState: function (section, state) {
			if (this._menuState.hasOwnProperty(section)) {
				this._menuState[section] = state;
				if ( section === 'message' && state === 0 ){
					this._menuState['sender'] = 0;
					this._menuState['final'] = 0;
				}
				this._processStates();
			}
		},

		showSection: function (sectionToShow, waitToFocus) {

			if (!this._menuState[sectionToShow]) {
				return false;
			}

			if ( sectionToShow === 'message' ){
				this.changeMenuState('sender',1);
			} else if (sectionToShow === 'sender'){
				this.changeMenuState('final',1);
			}

			this._items.removeClass('sel');
			this._items.filter('[data-target="' + sectionToShow + '"]').addClass('sel');
			this._sections.removeClass('show');
			var section = this._sections.filter('[data-section="' + sectionToShow + '"]');
			section.stop(true, false);
			section.addClass('show');

			if (sectionToShow === 'receiver' || sectionToShow === 'sender') {
				if ( waitToFocus ){
					setTimeout(function(){
						$('input[type="text"]', section).focus();
					}, waitToFocus)
				} else {
					$('input[type="text"]', section).focus();
				}
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

(function () {

	'use strict';

	function MessageSlider() {

		var that = this;

		this._callbacks = [];

		this._previousId = null;
		this._currentId = null;
		this._cont = $('#message-container');
		this._msgCont = $('.msg-cont', this._cont);
		this._navCont = $('.msg-nav', this._cont);
		this._slideLeft = $('#message-left');
		this._slideRight = $('#message-right');
		this._items = $('a', this._navCont);

		this._items.bind('click', function (e) {
			that._onItemsClick(e, $(this));
		});

		this._cont.swipe({

			swipe : function(event, direction, distance, duration, fingerCount, fingerData) {
				if ( direction == 'left'){
					that._slideCount(null, 1);
				} else if ( direction == 'right') {
					that._slideCount(null, -1);
				}
			}

		});

		this._slideLeft.bind('click', function(e){
			that._slideCount(e, -1);
		});

		this._slideRight.bind('click', function(e){
			that._slideCount(e, 1);
		});

	}

	MessageSlider.prototype = {

		_slideCount : function(e, count){
			if ( e ) e.preventDefault();
			var totalItems = this._items.length;
			if ( this._currentId + count === totalItems ){
				this.activateItem(0)
			} else if ( this._currentId + count < 0 ){
				this.activateItem(totalItems-1);
			} else {
				this.activateItem(this._currentId+count);
			}

		},

		_callOnChangeMessageItem: function (newId) {
			for (var i = 0; i < this._callbacks.length; i++) {
				this._callbacks[i](newId);
			}
		},

		_onItemsClick: function (evt, element) {
			evt.preventDefault();
			this.activateItem(element.closest('li').index());
		},

		activateItem: function (newId) {
			this._previousId = this._currentId;
			this._currentId = newId;
			this._items.removeClass('active');
			this._items.eq(newId).addClass('active');
			this._callOnChangeMessageItem(newId);
		},

		getPreviousId: function () {
			return this._previousId;
		},

		getCurrentId: function () {
			return this._currentId;
		},

		onChangeMessageItem: function (callback) {
			this._callbacks.push(callback);
		}

	};

	voeuxApp.MessageSlider = MessageSlider;

})();


(function(){

	'use strict';

	function SocialLinks(){

		this._shareUrl = null;
		this._baseUrl = 'http://' + location.host + '/';

		this._twitter = $('#social-twitter');
		this._facebook = $('#social-facebook');
		this._mail = $('#social-mail');
		this._tumblr = $('#social-tumblr');
		this._gplus = $('#social-gplus');

	}

	SocialLinks.prototype = {

		_setTwitterLink : function(){

			/*var width = 575,
				height = 400,
				left = ($(window).width() - width) / 2,
				top = ($(window).height() - height) / 2,
				opts = 'status=1' +
					',width=' + width +
					',height=' + height +
					',top=' + top +
					',left=' + left;

			window.open(url, 'twitter', opts);*/


			var baseUrl = 'https://twitter.com/intent/tweet';
			var shareUrl = encodeURIComponent(this._shareUrl);
			baseUrl += '?url=' + shareUrl;
			baseUrl += "&text=" + encodeURIComponent("Teste");

			this._twitter.bind('click', function(e){

				e.preventDefault();

				var width = 575,
					height = 400,
					left = ($(window).width() - width) / 2,
					top = ($(window).height() - height) / 2,
					opts = 'status=1' +
						',width=' + width +
						',height=' + height +
						',top=' + top +
						',left=' + left;

				window.open(baseUrl, 'twitter', opts);

				return false;

			});

		},

		_setFacebookLink : function(){

			var that = this;

			this._facebook.bind('click', function(e){

				e.preventDefault();

				FB.ui({
					method: 'share',
					href: that._shareUrl
				}, function(response){

				});

			});

		},

		_setMailLink : function(){
			this._mail.attr('href','mailto:?subject=Voeux&body=' + this._shareUrl );
		},

		_setGPlusLink : function(){

			var baseUrl = 'https://plus.google.com/share';
			var shareUrl = encodeURIComponent(this._shareUrl);
			baseUrl += '?url=' + shareUrl;

			this._gplus.bind('click', function(e){

				e.preventDefault();

				var width = 600,
					height = 600,
					left = ($(window).width() - width) / 2,
					top = ($(window).height() - height) / 2,
					opts = 'status=1' +
						',width=' + width +
						',height=' + height +
						',top=' + top +
						',left=' + left;

				window.open(baseUrl, 'Google Plus', opts);

				return false;

			});

		},

		_setTumblrLink : function(){

			var baseUrl = 'https://www.tumblr.com/widgets/share/tool';
			var shareUrl = encodeURIComponent(this._shareUrl);
			baseUrl += '?shareSource=legacy';
			baseUrl += '&canonicalUrl=';
			baseUrl += '&url=' + shareUrl;
			baseUrl += '&posttype=link';
			baseUrl += '&content=' + shareUrl;

			this._tumblr.bind('click', function(e){

				e.preventDefault();

				var width = 540,
					height = 600,
					left = ($(window).width() - width) / 2,
					top = ($(window).height() - height) / 2,
					opts = 'status=1' +
						',width=' + width +
						',height=' + height +
						',top=' + top +
						',left=' + left;

				window.open(baseUrl, 'Tumblr', opts);

				return false;

			});

		},

		setSocialLinks : function(shareId){
			this._shareUrl = this._baseUrl + shareId;
			this._setTwitterLink();
			this._setFacebookLink();
			this._setMailLink();
			this._setGPlusLink();
			this._setTumblrLink();
		}

	}

	voeuxApp.SocialLinks = SocialLinks;

})();




