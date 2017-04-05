//custom method
String.prototype.indexOfEnd = function(string) {
    var io = this.indexOf(string);
    return io == -1 ? -1 : io + string.length;
}
var datestamp = new Date(), 
	dd = datestamp.getDate(),
	mm = datestamp.getMonth() + 1,
	yyyy = datestamp.getFullYear();

	if(dd<10) {
    dd='0'+dd
	} 

	if(mm<10) {
	    mm='0'+mm
	}
	var today = yyyy + '-' + mm + '-' + dd;
	var lastYear = (yyyy-1) + '-' + mm + '-' + dd;

	var url = 'https://launchlibrary.net/1.2/launch?startdate=' + lastYear + '&enddate=' + today +'&limit=100&mode=verbose';
	console.log(url);
$.ajax({
	url: url,
	data: {
		format: 'json'
	},
	success: getLaunches
});

function getLaunches(data){
	data.launches.sort(function(a,b) {
		return new Date(b.netstamp) - new Date(a.netstamp);
	});
	console.log(data);
	for(var i=0; i<data.launches.length; i++){
		//Define Variables from Launch Library data
		var agency,
			webcast,
			status,
			id = data.launches[i].id,
			net = data.launches[i].net,
			isonet = (data.launches[i].isonet).substring(0, 4),
			netDate = net.substring(0, net.indexOfEnd(isonet)),
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

		//define variables for time, formatted in user's timezone
		var localTimeStart = new Date(data.launches[i].wsstamp * 1000);
		var localTimeEnd = new Date(data.launches[i].westamp * 1000);
		var starthr = localTimeStart.getHours();
		var startmin = localTimeStart.getMinutes();
		var endhr = localTimeEnd.getHours();
		var endmin = localTimeEnd.getMinutes();
		var confDate = localTimeStart.getDate();
		var monthArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

		
		//Configure launch date if confirmed, or show NET date
		function date() {
			if(data.launches[i].wsstamp === 0) {
				return 'NET ' + netDate;
			}else {
				var month = localTimeStart.getMonth();
				var day = localTimeStart.getDate();
				var year = localTimeStart.getFullYear();

				return monthArray[month] + ' ' + day + ', ' + year;
			}
		}

		function window() {
			if(startmin<10) {
				startmin='0'+startmin;
			}
			if(endmin<10) {
				endmin='0'+endmin;
			}
			var openWindow, 
				closeWindow;
			
			//determine openWindow value
			if(starthr<12){
				if(starthr === 0){
					openWindow = (starthr+12) + ':' + startmin + ' am';
				}else{
					openWindow = starthr + ':' + startmin + ' am';
				}
			}else {
				starthr = starthr-12;
				if(starthr === 0) {
					openWindow = '12' + ':' + startmin + ' pm';
				}else {
					openWindow = starthr + ':' + startmin + ' pm';
				}
			}

			//determine closeWindow value
			if(endhr<12){
				if(endhr === 0){
					closeWindow = (endhr+12) + ':' + endmin + ' am';
				}else{
					closeWindow = endhr + ':' + endmin + ' am';
				}
			}else {
				endhr = endhr-12;
				if(endhr === 0) {
					closeWindow = '12' + ':' + endmin + ' pm';
				}else {
					closeWindow = endhr + ':' + endmin + ' pm';
				}
			}

			if(data.launches[i].wsstamp === 0){
				return 'TBD';
			}else if(data.launches[i].wsstamp === data.launches[i].westamp) {
				return 'Instantaneous: ' + openWindow;
			}else {
				return 'Window: ' + openWindow + ' - ' + closeWindow;
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
			+ agency + '</p></div><h3 class="rocket">' + rocket + '</h3><h3 class="mission tar">'
			+ mission + '</h3><p class="date">' + date() + '</p><p class="time tar">' + window() + '</p><p class="pad">' + pad + '</p></section>');	
	}

	//called after all launches displayed
	sortLaunches();
}

//Sort launches by toggle buttons
function sortLaunches(){

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

