$('#container').append('<div class="launches"></div>');

$.ajax({
	url: 'https://launchlibrary.net/1.2/launch?next=50&mode=verbose',
	data: {
		format: 'json'
	},
	success: getLaunches
});

function getLaunches(data){
	console.log(data);
	for(var i=0; i<data.launches.length; i++){
		var net = data.launches[i].net,
			rocket = data.launches[i].rocket.name;

		$('.launches').append('<div class="launch">' + rocket + ': ' + net + '</div>');
		
	}
}