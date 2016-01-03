var voeuxCard = {};

voeuxCard.init = function(data){

	new voeuxCard.Card(data);

};

(function(){

	'use strict';

	function Card(data){

		var that = this;

		this._data = data;
		this._firstStep = $('#first-step');
		this._secondStep = $('#second-step');
		this._btnFirstStep = $('.btn', this._firstStep);

		this._greetingsTitle = $('#greetings-title');
		this._greetingsMessage = $('#greetings-message');

		this._firstBtnBlocked = false;

		this._btnFirstStep.bind('click', function(e){
			that._onBtnFirstStepClick(e);
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

			var that = this;

			this._greetingsTitle.typed({
				startDelay : 1000,
				strings : [this._data['receiver']],
				callback : function(){

					setTimeout(function(){
						that._greetingsTitle.parent().addClass('go-up');
						that._greetingsMessage.typed({
							startDelay : 1000,
							strings : [that._data['message']]
						})
					}, 500);

				}
			});

		}

	};

	voeuxCard.Card = Card;

})();