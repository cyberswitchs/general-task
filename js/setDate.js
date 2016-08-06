(function() {	
	var currentDateFields = [].slice.call(document.getElementsByClassName('current-date')),
		currentDate = new Date(),
		dayRaw = currentDate.getDate(),
		day,
		monthRaw = currentDate.getMonth(),
		month = monthRaw + 1,
		year = currentDate.getFullYear();
	day = dayRaw < 10 ? '0' + dayRaw : dayRaw;
	if (month < 10) {
		month = '0' + month;
	};	
	currentDateFields.forEach(function(input) {
		input.value = month + '-' + day + '-' + year;
	});
})();