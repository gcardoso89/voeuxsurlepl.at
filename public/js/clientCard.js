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

		this._firstBtnBlocked = false;
		this._creditsOpened = false;

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
				strings : [this._data['receiver']],
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
						that._footer.addClass('show');
					}, 500);
				}
			});

		}

	};

	voeuxCard.Card = Card;

})();