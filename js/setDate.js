(function() {	
	var date = document.getElementById('date'),
		created = document.getElementById('created'),
		currentDate = new Date(),
		day,
		month = currentDate.getMonth() + 1;

	if (currentDate.getDate() < 10) {
		day = '0' + currentDate.getDate();
	} else {
		day = currentDate.getDate();
	};

	if (currentDate.getMonth() < 10) {
		month = '0' + month;
	};
	
	date.value = day + '-' + month + '-' + currentDate.getFullYear();
	created.value = day + '-' + month + '-' + currentDate.getFullYear();
})();