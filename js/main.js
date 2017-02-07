String.prototype.indexOfEnd = function(string) {
    var io = this.indexOf(string);
    return io == -1 ? -1 : io + string.length;
}

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
	var launchString;
	for(var i=0; i<data.launches.length; i++){
		//Define Variables from Launch Library data
		var currentYear = new Date().getFullYear().toString(),
			agency,
			webcast,
			id = data.launches[i].id,
			net = data.launches[i].net,
			date = net.substring(0, net.indexOfEnd(currentYear)),
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

		//Format Webcast Link
		if(data.launches[i].vidURLs.length){
			webcast = '<a href="' + data.launches[i].vidURLs[0] + '" target="_blank">Watch Webcast</a>';
		}else {
			webcast = 'Webcast Unavailable';
		}

		
		var localTimeStart = new Date(data.launches[i].westamp * 1000);
		var hr = localTimeStart.getHours();
		var min = localTimeStart.getMinutes();
		if(min<10) {
			min='0'+min
		}

		function window(hr, min){
			if(data.launches[i].westamp === 0){
				return 'TBD';
			}else{
				if(hr<12){
					if(hr === 0){
						console.log(hr);
						return (hr+12) + ':' + min + ' am';
					}else{
						return hr + ':' + min + ' am';
					}
				}else {
					return (hr-12) + ':' + min + ' pm';
				}
			}
		}
		// window(hr, min);

		// if(data.launches[i].westamp > 0){
		// 	console.log(hr + ':' + min);
		// }else{
		// 	console.log('net');
		// }

		//Compile and append launch info
		$('.launches').append('<div id="' + id + '" class="launch net ' + agency.toLowerCase() + '"><div class="top-info"><p class="agency">'
			+ agency + '</p><p class="webcast tar">' + webcast + '</p></div><h3 class="rocket">' + rocket + '</h3><h3 class="mission tar">'
			+ mission + '</h3><p class="date">' + date + '</p><p class="time tar">' + window(hr, min) + '</p><p class="pad">' + pad + '</p></div>');
		

		// launchString += '<div class="launch net">';
		// launchString += '<div class="top-info"><p class="agency">' + agency + '</p></div>';
		// launchString += '<h3 class="rocket">' + rocket + '</h3>';
		// launchString += '<h3 class="mission">' + mission + '</h3>';
		// launchString += '<p class="date">' + net + '</p>';
		// launchString += '</div>';
		
	}
	//$('.launches').append(launchString);
}
