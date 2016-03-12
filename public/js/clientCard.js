var voeuxCard = {};

voeuxCard.init = function(data){

	new voeuxCard.Card(data);

};

(function(){

	'use strict';

	function Card(data){

		var that = this;

		this._data = data;
		this._footer = $('#footer');
		this._body = $('body');
		this._firstStep = $('#first-step');
		this._secondStep = $('#second-step');
		this._btnFirstStep = $('.btn', this._firstStep);
		this._4aoutLk = $('#credits-lk');

		this._greetingsTitle = $('#greetings-title');
		this._greetingsMessage = $('#greetings-message');
		this._greetingsWebsite = $('#greetings-website');
		this._greetingsShare = $('#greetings-share');

		this._firstBtnBlocked = false;
		this._creditsOpened = false;

		this._socialLinks = new voeuxCard.SocialLinks();
		this._socialLinks.setSocialLinks(this._data.cardid, this._data.sender, this._data.receiver);

		function bodyCreditsClick(){
			if ( that._creditsOpened ){
				that._4aoutLk.removeClass('show');
				that._creditsOpened = false;
				$(this).unbind('click.credits');
			}
		}

		this._btnFirstStep.bind('click', function(e){
			that._onBtnFirstStepClick(e);
		});


		this._4aoutLk.bind('click', function(e){
			e.preventDefault();
			if ( !that._creditsOpened ) {
				that._4aoutLk.addClass('show');
				that._creditsOpened = true;
				setTimeout(function(){
					that._body.bind('click.credits', bodyCreditsClick);
				},0);
			}
		});

	}

	Card.prototype = {

		_onBtnFirstStepClick : function(e){
			e.preventDefault();
			if (!this._firstBtnBlocked){
				this._firstStep.addClass('hide');
				this._startCardAnimation();
				this._firstBtnBlocked = true;
			}
		},

		_startCardAnimation : function(){

			this._firstStep.css('z-index', 1);
			this._secondStep.css('z-index', 2);

			this._showGreetingsTitle();

		},

		_showGreetingsTitle : function(){

			var that = this;

			this._greetingsTitle.typed({
				startDelay : 1000,
				strings : [this._data['receiver'] + ","],
				callback : function(){

					setTimeout(function(){
						that._greetingsTitle.parent().addClass('go-up');
						that._showGreetingsMessage();
					}, 500);

				}
			});

		},

		_showGreetingsMessage : function(){

			var that = this;

			this._greetingsMessage.typed({
				startDelay : 1000,
				strings : [this._data['message']],
				typeSpeed: -5,
				callback : function(){

					setTimeout(function(){
						that._greetingsMessage.addClass('hide-cursor');
						that._showGreetingsWebsite();
					}, 500);

				}

			});

		},

		_showGreetingsWebsite : function(){

			var that = this;

			this._greetingsWebsite.addClass('go-up');
			this._greetingsWebsite.typed({
				startDelay : 1000,
				strings : [ this._data['website'] ],
				typeSpeed: -10,
				callback : function(){

					setTimeout(function(){
						that._greetingsWebsite.addClass('hide-cursor');
						that._showGreetingsShare();
					}, 400);
				}
			});

		},

		_showGreetingsShare : function(){
			var that = this;
			this._greetingsShare.addClass('show');
			setTimeout(function(){
				that._greetingsShare.addClass('go-down');
			},100);
		}

	};

	voeuxCard.Card = Card;

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

		_setTwitterLink : function(receiver){

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
			baseUrl += "&text=" + encodeURIComponent("Voici un petit message de ma part pour " + receiver + " - " + receiver + " > ");

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

		_setMailLink : function(sender, receiver){

			var subject = sender + '%20vous%20souhaite%20ses%20meilleurs%20voeux';

			var bodyText = 'Bonjour%20' + receiver + ',%0D%0A%0D%0A';
			bodyText += 'Voici%20mes%20voeux%20pour%20la%20nouvelle%20année.%0D%0A';
			bodyText += 'Ils%20sont%20disponibles%20ici%20:%20' + this._shareUrl + '%0D%0A%0D%0A';
			bodyText += sender;

			this._mail.attr('href','mailto:?subject=' + subject + '&body=' + bodyText );
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

		setSocialLinks : function(shareId, sender, receiver){
			this._shareUrl = this._baseUrl + shareId;
			this._setTwitterLink(receiver);
			this._setFacebookLink();
			this._setMailLink(sender, receiver);
			this._setGPlusLink();
			this._setTumblrLink();
		}

	}

	voeuxCard.SocialLinks = SocialLinks;

})();