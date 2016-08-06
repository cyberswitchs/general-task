var projects = [{
		"Project name": "Project 01",
		"Due date": "08-02-2016",
		"Created": "12-21-2015",
		"Members": "Valera",
		"Type": "Mobile",
		"Customer": "Tricky corp"
}, {
		"Project name": "Project 02",
		"Due date": "08-05-2016",
		"Created": "12-04-2015",
		"Members": "Valera, Dmitriy",
		"Type": "Support",
		"Customer": "Balagan LTD"
}, {
		"Project name": "Project 03",
		"Due date": "02-12-2008",
		"Created": "04-12-2016",
		"Members": "Dmitriy, Vovan",
		"Type": "Web",
		"Customer": "Feel Good inc."
}, {
		"Project name": "Project 04",
		"Due date": "09-01-2018",
		"Created": "04-05-2016",
		"Members": "Valera, Dmitriy, Vovan",
		"Type": "Mobile",
		"Customer": "Apple Corp."
}, {
		"Project name": "Project 05",
		"Due date": "08-11-2016",
		"Created": "04-01-2016",
		"Members": "Cypher",
		"Type": "Desktop",
		"Customer": "Men In Black"
}, {
		"Project name": "Project 06",
		"Due date": "02-22-2017",
		"Created": "12-05-2011",
		"Members": "A whole team",
		"Type": "Web",
		"Customer": "Random guys"
}, {
		"Project name": "Project 07",
		"Due date": "09-12-2016",
		"Created": "04-05-2016",
		"Members": "Valera",
		"Type": "Mobile",
		"Customer": "Tricky corp"
}, {
		"Project name": "Project 08",
		"Due date": "03-08-2016",
		"Created": "10-04-2015",
		"Members": "Valera, Dmitriy",
		"Type": "Support",
		"Customer": "Balagan LTD"
}, {
		"Project name": "Project 09",
		"Due date": "02-12-2008",
		"Created": "03-15-2016",
		"Members": "Dmitriy, Vovan",
		"Type": "Web",
		"Customer": "Feel Good inc."
}, {
		"Project name": "Project 10",
		"Due date": "09-01-2012",
		"Created": "04-05-2016",
		"Members": "Valera, Dmitriy, Vovan",
		"Type": "Mobile",
		"Customer": "Apple Corp."
}, {
		"Project name": "Project 11",
		"Due date": "12-11-2016",
		"Created": "04-01-2016",
		"Members": "Cypher",
		"Type": "Desktop",
		"Customer": "Men In Black"
}, {
		"Project name": "Project 12",
		"Due date": "02-12-2017",
		"Created": "12-05-2011",
		"Members": "A whole team",
		"Type": "Web",
		"Customer": "Random guys"
}];

(function(){
	
	var DATE_PATTERN = /^((0[1-9]|1[0-2])(\.|\-|\/)([0-2][0-9]|3[0-1])(\.|\-|\/)[0-9][0-9][0-9][0-9])/g; // MM-DD-YYYY

	var dashboardData = projects,
		dashboardHeader = document.getElementsByClassName('dashboard-header')[0];
		dashboardBody = document.getElementsByClassName('dashboard-body')[0];

	setProjectsStatus(dashboardData);
	createDashboardHeader();
	createDashboardBody();

	function createDashboardBody() {
		dashboardBody.innerHTML = '';
		dashboardData.forEach(function(project) {
			dashboardBody.appendChild(createProjectRow(project));
		});
	}

	function createProjectRow(project) {
		var projectRow = document.createElement('tr'),
			projectValues = [];
		for (key in project) {
			projectValues.push(project[key]);
		};
		projectValues.forEach(function(key) {
			projectRow.appendChild(createCell(key, false));
		});
		projectRow.appendChild(createButton('td', 'recycle', 'delete'));
		return projectRow;
	}

	function setProjectsStatus(data) {
		data.forEach(function(project) {
			project["status"] = getProjectStatus(project["Due date"], project["Created"]);
		});
	}

	function createDashboardHeader() {
		var headerKeys = Object.keys(dashboardData[0]);
		headerKeys.forEach(function(key) {
			dashboardHeader.appendChild(createCell(key, true));
		});
		dashboardHeader.appendChild(createButton('th', 'switch-right', 'right'));
	}

	function getDateObject(date) {
		var dateArray = date.split("-"),
			dateObject = new Date(dateArray[2], dateArray[0] - 1, dateArray[1]);
		return dateObject;
	}

	function getProjectStatus(dueDateString, createdDateString) {
		var dueDate = getDateObject(dueDateString),
			createdDate = getDateObject(createdDateString),
			status = '';
		status = dueDate > createdDate ? "In process" : "Completed";
		return status;
	}

	function createCell(key, headerFlag) {
		var cell = document.createElement('th');
		cell.innerText = key;
		if (headerFlag) {
			cell.dataset.key = key;
		}
		return cell;
	}

	function createButton(tag, style, action) {
		var cell = document.createElement(tag),
			button = document.createElement('button');
		button.classList.add(style);
		button.dataset.action = action;
		cell.appendChild(button);
		return cell;
	}

	dashboardHeader.addEventListener('click', function(event) {
		if (event.target.dataset.key) {
			var key = event.target.dataset.key;
			dashboardData.sort(function(project1, project2) {
				var key1 = validateStringDate(project1[key]) ? getDateObject(project1[key]) : project1[key],
					key2 = validateStringDate(project2[key]) ? getDateObject(project2[key]) : project2[key];
				if (key1 > key2) {
					return 1;
				} else if (key1 < key2) {
					return -1;
				} else {
					return 0;
				}
			});
			createDashboardBody();
		}
	});

	function validateStringDate(key) {
		return key.match(DATE_PATTERN);
	}

})();