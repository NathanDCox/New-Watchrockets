//custom method
String.prototype.indexOfEnd = function(string) {
    var io = this.indexOf(string);
    return io == -1 ? -1 : io + string.length;
}

$.ajax({
	url: 'https://launchlibrary.net/1.2/launch?next=150&mode=verbose',
	data: {
		format: 'json'
	},
	success: getLaunches
});

function getLaunches(data){
	console.log(data);
	var launchString;
	for(var i=0; i<data.launches.length; i++){
		//Define Variables from Launch Library data
		var agency,
			webcast,
			status,
			id = data.launches[i].id,
			net = data.launches[i].net,
			isonet = (data.launches[i].isonet).substring(0, 4),
			date = net.substring(0, net.indexOfEnd(isonet)),
			name = data.launches[i].name,
			missionname = name.split(" | ");
			rocket = missionname[0].replace(/Full Thrust/g, 'FT'),
			mission = missionname[1],
			pad = data.launches[i].location.pads[0].name;
		


		//Format Launch Agency
		if(data.launches[i].rocket.agencies.length){
			if(data.launches[i].rocket.agencies[0].name === 'Lockheed Martin'){
				agency = 'ULA';
			}else if(data.launches[i].rocket.agencies[0].name === 'United Launch Alliance'){
				agency = 'ULA';
			}else if(data.launches[i].rocket.agencies[0].name === 'Orbital Sciences Corporation'){
				agency = 'Orbital ATK';
			}else if(data.launches[i].rocket.agencies[0].name === 'Khrunichev State Research and Production Space Center'){
				agency = 'Russia';
			}else if(data.launches[i].rocket.agencies[0].name === 'EADS Astrium Space Transportation'){
				agency = 'Arianespace';
			}else if(data.launches[i].rocket.agencies[0].name === 'Avio S.p.A'){
				agency = 'Arianespace';
			}else if(data.launches[i].rocket.agencies[0].name === 'Indian Space Research Organization'){
				agency = 'India (ISRO)';
			}else if(data.launches[i].rocket.agencies[0].name === 'China Academy of Space Technology'){
				agency = 'China';
			}else{
				agency = data.launches[i].rocket.agencies[0].name;
			}
		}else if(rocket.indexOf('Long March') >= 0){
			agency = 'China';
		}else if(rocket.indexOf('Soyuz-FG') >= 0){
			agency = 'ISS';
		}else if(rocket.indexOf('Soyuz') >= 0 || rocket.indexOf('Proton') >= 0){
			agency = 'Russia';
		}else if(rocket.indexOf('Rokot') >= 0){
			agency = 'Eurokot';
		}else if(rocket.indexOf('GSLV') >= 0){
			agency = 'India (ISRO)';
		}else if(rocket.indexOf('Electron') >= 0){
			agency = 'Rocket Lab';
		}else if(rocket.indexOf('SLS') >= 0){
			agency = 'NASA';
		}else if(rocket.indexOf('New Shepard') >= 0){
			agency = 'Blue Origin';
		}else{
			agency = '';
		}

		//format agency for className
		var agencyClass;
		if(agency.indexOf(' ') === -1){
			agencyClass = agency;
		}else{
			agencyClass = agency.substring(0, agency.indexOf(' '));
		}

		//Format Webcast Link
		if(data.launches[i].vidURLs.length){
			webcast = '<p class="webcast tar"><a href="' + data.launches[i].vidURLs[0] + '" target="_blank"><img src="img/rocket.svg">Watch Webcast</a></p>';
		}else {
			webcast = '<p class="webcast tar noVid">Webcast Unavailable</p>';
		}

		//define variables for time, formatted in user's timezone
		var localTimeStart = new Date(data.launches[i].westamp * 1000);
		var hr = localTimeStart.getHours();
		var min = localTimeStart.getMinutes();
		if(min<10) {
			min='0'+min
		}

		//format launch window time
		function window(hr, min){
			if(data.launches[i].westamp === 0){
				return 'TBD';
			}else{
				if(hr<12){
					if(hr === 0){
						return (hr+12) + ':' + min + ' am';
					}else{
						return hr + ':' + min + ' am';
					}
				}else {
					return (hr-12) + ':' + min + ' pm';
				}
			}
		}

		function statusCheck(){
			if(data.launches[i].westamp === 0){
				status = 'net';
			}else {
				status = 'confirmed';
			}
		}statusCheck();

		//Compile and append launch info
		$('.launches').append('<section id="' + id + '" class="launch ' + status + ' ' + agencyClass.toLowerCase() + '"><div class="top-info"><p class="agency">'
			+ agency + '</p>' + webcast + '</div><h3 class="rocket">' + rocket + '</h3><h3 class="mission tar">'
			+ mission + '</h3><p class="date">' + date + '</p><p class="time tar">' + window(hr, min) + '</p><p class="pad">' + pad + '</p></section>');	
	}

	//called after all launches displayed
	sortLaunches();
}

//Sort launches by toggle buttons
function sortLaunches(){
	//Define Buttons
	var all = $('#all'),
		confirmed = $('#confirmed'),
		spacex = $('#spacex'),
		ula = $('#ula'),
		ariane = $('#arianespace'),
		orbital = $('#orbital'),
		russia = $('#russia'),
		china = $('#china'),
		india = $('#india'),
		nasa = $('#nasa'),
		iss = $('#iss'),
		rocketlab = $('#rocketlab'),
		eurokot =  $('#eurokot');

	//Only show launches for the button thats clicked. Add on class to highlight selected provider
	$('.sort-button').click(function(){
		var clicked = $(this).attr('id');
		$('.sort-button').removeClass('on');
		$(this).addClass('on');
		$('.launch').show();
		$('.launch').not('.' + clicked).toggle();
	});
	
	//All button shows all launches 
	$('#all').click(function(){
		$('.launch').show();
	});

}

