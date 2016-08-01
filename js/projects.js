var projects = [{
		"Project name": "Android app",
		"Due date": "22-12-2016",
		"Created": "04-05-2016",
		"Members": "Valera",
		"Type": "Mobile",
		"Customer": "Tricky corp"
}, {
		"Project name": "Project 404",
		"Due date": "03-08-2016",
		"Created": "14-04-2015",
		"Members": "Valera, Dmitriy",
		"Type": "Support",
		"Customer": "Balagan LTD"
}, {
		"Project name": "Project 666",
		"Due date": "22-12-2008",
		"Created": "23-12-2016",
		"Members": "Dmitriy, Vovan",
		"Type": "Web",
		"Customer": "Feel Good inc."
}, {
		"Project name": "iPhone app",
		"Due date": "09-01-2012",
		"Created": "04-05-2016",
		"Members": "Valera, Dmitriy, Vovan",
		"Type": "Mobile",
		"Customer": "Apple Corp."
}, {
		"Project name": "Project Area-51",
		"Due date": "22-11-2016",
		"Created": "04-01-2016",
		"Members": "Cypher",
		"Type": "Desktop",
		"Customer": "Men In Black"
}, {
		"Project name": "App for desktop",
		"Due date": "22-12-2017",
		"Created": "12-05-2011",
		"Members": "A whole team",
		"Type": "Web",
		"Customer": "Random guys"
}];

(function(){
	var dashboardBody = document.getElementsByClassName('dashboard-body')[0];

	projects.forEach(function(project, index) {
		dashboardBody.appendChild(createProjectItem(project, index));
	});

	function createProjectItem(project, index) {
		var rowFragment = document.createDocumentFragment(),
            recycleCell = document.createElement('td'),
			row = document.createElement('tr');
		for (key in project) {
            row.appendChild(createProjectCell(key, project[key]));
            if (key === "Type") {
                row.appendChild(createProjectStatusCell(project["Due date"]));
            };
        };
        recycleCell.appendChild(createDeleteButton(index, 'recycle'));
        row.appendChild(recycleCell);
		rowFragment.appendChild(row);
		return rowFragment;
	};
	
	function createProjectCell(key, value) {
		var cellFragment = document.createDocumentFragment(),
			cell = document.createElement('td');
		cell.innerText = value;
		cellFragment.appendChild(cell);
		return cellFragment;
	};

	function createDeleteButton(index, style) {
		var buttonFragment = document.createDocumentFragment(),
			deleteButton = document.createElement('button');
		deleteButton.classList.add(style);
		deleteButton.dataset.index = index;
		buttonFragment.appendChild(deleteButton);
		return buttonFragment;
	};

    function createProjectStatusCell(date) {
        var currentDate = new Date(),
            dueDateRaw = date.split("-"),
            dueDate = new Date(dueDateRaw[2], dueDateRaw[1], dueDateRaw[0]),
            status,
            statusFailed = "Failed",
            statusInProcess = "In process",
            dateCell = document.createElement('td');
        if (currentDate < dueDate) {
            status = statusInProcess;
        } else {
            status = statusFailed;
        }
        dateCell.innerText = status;
        return dateCell;
    }

})();