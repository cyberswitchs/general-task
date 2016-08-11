var module = (function(){
	"use strict"
	var DATE_PATTERN = "(0[1-9]|1[012])[-/.](0[1-9]|[12][0-9]|3[01])[-/.](19|20)\\d\\d",
		START_SORT_DIRECTION = 'Asc',
		DELETE_BUTTON_STYLE = 'recycle',
		DELETE_BUTTON_DATASET_ACTION = 'delete',
		DUE_DATE_KEY = 'Due date',
		CREATED_DATE_KEY = 'Created',
		STATUS_IN_PROCESS = 'In process',
		STATUS_COMPLETED = 'Completed',
		COMPLETED_PROJECT_STYLE = 'failed',
		NEW_PROJECT_BUTTON_STYLE = 'switch-right';

	var dashboardData = [],
		projects = [],
		headerKeys = [],
		typeData = [],
		customerData = [],
		dashboardHeader = document.getElementsByClassName('dashboard-header')[0],
		dashboardBody = document.getElementsByClassName('dashboard-body')[0],
		currentKey = 'Project name',
		currentDirection = 'Asc',
		currentId = 0,
		currentFilters = [],
		currentSearch = '';

	getData();

	function getData() {
		if (!localStorage.dashboardData) {
			var xhr = new XMLHttpRequest();
			xhr.open('GET', 'js/data.json', true);
			xhr.onreadystatechange = function() {
				if (this.readyState === 4 && this.status === 200) {
					localStorage.dashboardData = this.responseText;
					setDashboardData();
				}
			}
			xhr.send();
		} else {
			setDashboardData();
		}
	}

	function writeToLocalStorage() {
		localStorage.dashboardData = JSON.stringify(dashboardData);
	}

	function setDashboardData() {
		dashboardData = JSON.parse(localStorage.dashboardData);
		console.log(dashboardData);
		projects = dashboardData.projects;
		typeData = dashboardData.typeData;
		customerData = dashboardData.customerData;
		dashboardData.categories.forEach(function(category) {
			headerKeys.push(category.value);
		});
		renderDashboard();
	}

	function renderDashboard() {
		setStatuses(projects);
		window.data = dashboardData;
		createDashboardBody(projects);
		getCurrentId(projects);
		createDashboardHeader();
		renderDropdowns();
		setCurrentDate()
		setControls();
	}

	function setStatuses(projects) {
		projects.forEach(function(project) {
			setProjectStatus(project);
		});
	}

	function createDashboardBody(data) {
		dashboardBody.innerHTML = '';
		data.forEach(function(project) {
			dashboardBody.appendChild(createProjectRow(project));
		});
	}

	function createProjectRow(project) {
		var projectRow = document.createElement('tr');
		headerKeys.forEach(function(key) {
			if (project.hasOwnProperty(key)) {
				projectRow.appendChild(createCell('td', project[key], false));
			} else {
				projectRow.appendChild(createCell('td', '', false));
			}
		});
		if (project['Status'] === STATUS_COMPLETED) {
			projectRow.classList.add(COMPLETED_PROJECT_STYLE);
		}
		projectRow.appendChild(createButton('td', DELETE_BUTTON_STYLE, DELETE_BUTTON_DATASET_ACTION, project['id']));
		return projectRow;
	}

	function setProjectStatus(project) {
		project['Status'] = getProjectStatus(project[DUE_DATE_KEY], project[CREATED_DATE_KEY]);
	}

	function getCurrentId(projects) {
		projects.forEach(function(project) {
			if (currentId < +project["id"]) {
				currentId = +project["id"];
			};
		});
		currentId++;
	}

	function createDashboardHeader() {
		headerKeys.forEach(function(key) {
			dashboardHeader.appendChild(createCell('th', key, true));
		});
		dashboardHeader.appendChild(createButton('th', NEW_PROJECT_BUTTON_STYLE));
	}

	function getDateObject(date) {
		var dateArray = date.split('-'),
			dateObject = new Date(dateArray[2], dateArray[0] - 1, dateArray[1]);
		return dateObject;
	}

	function getProjectStatus(dueDateString, createdDateString) {
		var dueDateObject = getDateObject(dueDateString),
			createdDateObject = getDateObject(createdDateString),
			status = '';
		status = dueDateObject > createdDateObject ? STATUS_IN_PROCESS : STATUS_COMPLETED;
		return status;
	}

	function createCell(type, key, headerFlag) {
		var cell = document.createElement(type);
		cell.innerText = key;
		if (headerFlag) {
			cell.dataset.key = key;
			cell.dataset.direction = START_SORT_DIRECTION;
		}
		return cell;
	}

	function createButton(tag, style, action, id) {
		var cell = document.createElement(tag),
			button = document.createElement('button');
		button.classList.add(style);
		if (action) {
			button.dataset.action = action;
		};
		if (id) {
			button.dataset.id = id;
		};
		cell.appendChild(button);
		return cell;
	}

	dashboardHeader.addEventListener('click', function(event) {
		if (event.target.dataset.key) {
			var key = event.target.dataset.key,
				direction = event.target.dataset.direction,
				headerCells = [].slice.call(dashboardHeader.getElementsByTagName('th'));
			if (key !== currentKey) {
				headerCells.forEach(function(cell) {
					cell.classList.remove('sort-asc', 'sort-desc');
				});
			}
			currentKey = key;
			currentDirection = event.target.dataset.direction;
			createDashboardBody(filterData());
			event.target.dataset.direction = direction === 'Asc' ? 'Desc' : 'Asc';
			setStyle(event.target);
		};
	});

	function setStyle(cell) {
		switch (cell.dataset.direction) {
			case 'Asc':
				cell.classList.add('sort-asc');
				cell.classList.remove('sort-desc');
				break;
			case 'Desc':
				cell.classList.add('sort-desc');
				cell.classList.remove('sort-asc');
				break;
		}
	}

	function sortProjects(array, key, direction) {
		return array.sort(function(project1, project2) {
			var key1 = normalizeKey(project1[key]),
				key2 = normalizeKey(project2[key]),
				value;
			value = key1 > key2	? 1 : -1;
			if (direction === 'Desc') {
				value = -value;
			}
			return value;
		});
	}

	function validateStringDate(key) {
		return key.match(DATE_PATTERN);
	}

	function normalizeKey(key) {
		var sortableKey = validateStringDate(key) ? getDateObject(key) : key;
		return sortableKey;
	}

	dashboardBody.addEventListener('click', function(event) {
		if (event.target.dataset.id) {
			var id = event.target.dataset.id;
			if (confirm('Are you sure you want to delete this project?')) {
				deleteProject(id);
			}
			createDashboardBody(filterData());
		};
	});

	function deleteProject(value) {
		projects.forEach(function(project) {
			if (project['id'] === value) {
				projects.splice(projects.indexOf(project), 1);
				console.log('Project "' + project['Project name'] + '" has been deleted');
			}
		});
		writeToLocalStorage();
	}

	function renderDropdowns() {
		var listType = document.getElementsByClassName('list-type')[0],
			listCustomer = document.getElementsByClassName('list-customer')[0],
			listDate = document.getElementsByClassName('list-date')[0],
			typeField = document.getElementById('type-field'),
			customerField = document.getElementById('customer-field'),
			dateRangeField = document.getElementById('date-range-field');

		typeData.forEach(function(item) {
			listType.appendChild(createListItem(item["value"]));
		});
		customerData.forEach(function(item) {
			listCustomer.appendChild(createListItem(item["value"]));
		});

		var dateRanges = ['Due before', 'Due after', 'Created before', 'Created after'];

		dateRanges.forEach(function(item) {
			listDate.appendChild(createListItem(item));
		});

		function createListItem(value) {
			var listItem = document.createElement('li');
			listItem.innerText = value;
			listItem.dataset.value = value;
			return listItem;
		};

		listType.addEventListener('mousedown', function(event) {
			var projectType = event.target.dataset.value;
			typeField.value = projectType;
			checkSubmitButtonState();
		});

		listCustomer.addEventListener('mousedown', function(event) {
			var projectCustomer = event.target.dataset.value;
			customerField.value = projectCustomer;
			checkSubmitButtonState();
		});

		listDate.addEventListener('mousedown', function(event) {
			var dateRange = event.target.dataset.value;
			dateRangeField.value = dateRange;
		});
	};

	function setControls() {
		var switchLeft = document.getElementsByClassName('switch-left')[0],
			switchRight = document.getElementsByClassName('switch-right')[0],
			menuLeft = document.getElementsByClassName('menu-left')[0],
			menuRight = document.getElementsByClassName('menu-right')[0],
			projectsWrapper = document.getElementsByClassName('projects-wrapper')[0];

		switchLeft.addEventListener('click', function() {
			menuLeft.classList.toggle('show-menu');
			menuRight.classList.remove('show-menu');
			projectsWrapper.classList.toggle('collapse');
		});

		switchRight.addEventListener('click', function(event) {
			menuRight.classList.toggle('show-menu');
			event.stopPropagation();
		});

		menuLeft.addEventListener('click', function() {
			menuRight.classList.remove('show-menu');
		});

		projectsWrapper.addEventListener('click', function() {
			menuRight.classList.remove('show-menu');
		});
	}

	function setCurrentDate() {
		var dateFields = [].slice.call(document.getElementsByClassName('auto-kal')),
			currentDateFields = [].slice.call(document.getElementsByClassName('current-date')),
			currentDate = new Date(),
			dayRaw = currentDate.getDate(),
			monthRaw = currentDate.getMonth(),
			year = currentDate.getFullYear(),
			day,
			month = monthRaw + 1;		
		day = dayRaw < 10 ? '0' + dayRaw : dayRaw;
		if (month < 10) {
			month = '0' + month;
		};	
		currentDateFields.forEach(function(input) {
			input.value = month + '-' + day + '-' + year;
		});
		dateFields.forEach(function(input) {
			input.pattern = DATE_PATTERN;
		});
	}

	var filtersFieldset = document.getElementsByClassName('filters')[0],
		filters = [].slice.call(filtersFieldset.getElementsByTagName('input')),
		filterWeb = filters[0],
		filterDesktop = filters[1],
		filterMobile = filters[2],
		filterSupport = filters[3];

	filterWeb.dataset.filterValue = 'Web';
	filterDesktop.dataset.filterValue = 'Desktop';
	filterMobile.dataset.filterValue = 'Mobile';
	filterSupport.dataset.filterValue = 'Support';

	filtersFieldset.addEventListener('click', function(event) {
		if (event.target.dataset.filterValue) {
			var filterValue = event.target.dataset.filterValue,
				checked = event.target.checked;
			if (checked) {
				currentFilters.push(filterValue);
			} else {
				currentFilters.splice(currentFilters.indexOf(filterValue), 1);
			};
			createDashboardBody(filterData());
		};
	});

	function filterData() {
		var filteredData = [],
			newData = [];
		if (currentFilters.length) {
			currentFilters.forEach(function(filterValue) {
				var chosenProjects = projects.filter(function(item) {
					return item["Type"] === filterValue;
				});
				chosenProjects.forEach(function(project) {
					filteredData.push(project);
				});
			});
		} else {
			filteredData = projects;
		}
		filteredData.forEach(function(project) {
			Object.keys(project).forEach(function(key) {
				if (project[key].match(new RegExp(currentSearch, 'i'))) {
					newData.push(project);
				};
			});
		});
		newData = newData.filter(function(item, index, array) {
			return array.indexOf(item) === index;
		})
		return sortProjects(newData, currentKey, currentDirection);
	}

	var menuRight = document.getElementsByClassName('menu-right')[0],
		menuRightInputs = [].slice.call(menuRight.querySelectorAll('input[type="text"]')),
		projectName = document.getElementById('project-name'),
		dueDate = document.getElementById('due-date'),
		created = document.getElementById('created'),
		members = document.getElementById('members'),
		typeField = document.getElementById('type-field'),
		customerField = document.getElementById('customer-field'),
		submitButton = document.getElementsByClassName('create-project')[0];

	function checkInputs() {
		var data = [];
		menuRightInputs.forEach(function(input) {
			if (input.value) {
				data.push(input.value);
			};
		});
		window.inputs = data;
		return menuRightInputs.length === data.length;
	}

	menuRight.addEventListener('input', function() {
		checkSubmitButtonState();
	})

	menuRight.addEventListener('submit', function() {
		event.preventDefault();
		addNewProject();
		createDashboardBody(filterData());
		menuRight.classList.remove('show-menu');
		menuRightInputs.forEach(function(input) {
			input.value = '';
		});
		setCurrentDate();
	});

	function addNewProject() {
		var newProject = {
			"Project name": projectName.value,
			"Due date": dueDate.value,
			"Created": created.value,
			"Members": members.value,
			"Type": typeField.value,
			"Customer": customerField.value,
			"Status": getProjectStatus(dueDate.value, created.value),
			"id": currentId.toString()
		};
		projects.push(newProject);
		writeToLocalStorage();
	}

	function checkSubmitButtonState() {
		if (checkInputs()) {
			submitButton.removeAttribute('disabled');
		} else {
			if (!submitButton.hasAttribute('disabled')) {
				submitButton.setAttribute('disabled', true);
			};
		};
	}

	var textSearch = document.getElementById('search');
	textSearch.addEventListener('keydown', function(event) {
		if (event.keyCode === 13) {
			var searchString = event.target.value;
			console.log(searchString);
			currentSearch = searchString;
			createDashboardBody(filterData());
		};
	});

	var dateSearch = document.getElementById('date');
	dateSearch.addEventListener('keydown', function(event) {
		if (event.keyCode === 13 && validateStringDate(event.target.value)) {
			var searchString = event.target.value;
			console.log(searchString);
			currentSearch = searchString;
			createDashboardBody(filterData());
		};
	});

}());