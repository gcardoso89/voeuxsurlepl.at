$(function(){

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

});
