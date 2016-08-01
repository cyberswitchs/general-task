var typeData = [{
		"value": "Web"
}, {
		"value": "Desktop"
}, {
		"value": "Mobile"
}, {
		"value": "Support"
}];

var customerData = [{
		"value": "Smooth guys inc."
}, {
		"value": "Great Pulp LTD"
}, {
		"value": "Apple Corp."
}];


var listType = document.getElementsByClassName('list-type')[0],
	listCustomer = document.getElementsByClassName('list-customer')[0],
	typeField = document.getElementById('type-field'),
	typeLabel = document.getElementById('type-label'),
	customerField = document.getElementById('customer-field'),
	customerLabel = document.getElementById('customer-label');

(function() {	   
	typeData.forEach(function(item){
		listType.appendChild(createListItem(item));
	});
	customerData.forEach(function(item){
		listCustomer.appendChild(createListItem(item));
});

	function createListItem(item) {
		var listFragment = document.createDocumentFragment(),
			listItem = document.createElement('li');
		listItem.innerText = item["value"];
		listItem.dataset.value = item["value"];
        listItem.dataset.target = 'menu-right';
		listFragment.appendChild(listItem);
		return listFragment;
	};
})();

listType.addEventListener('mousedown', function(event) {
	var projectType = event.target.dataset.value;
	typeField.value = projectType;
});

listCustomer.addEventListener('mousedown', function(event) {
	var projectCustomer = event.target.dataset.value;
	customerField.value = projectCustomer;
});