(function() {
	var switchLeft = document.getElementsByClassName('switch-left')[0],
		switchRight = document.getElementsByClassName('switch-right')[0],
		menuLeft = document.getElementsByClassName('menu-left')[0],
		menuRight = document.getElementsByClassName('menu-right')[0],
		menuRightInputs = [].slice.call(menuRight.getElementsByTagName('input')),
		projectsWrapper = document.getElementsByClassName('projects-wrapper')[0];

	switchLeft.dataset.action = 'left';
	switchRight.dataset.action = 'right';
	menuRightInputs.forEach(function(input) {
		input.dataset.target = 'menu-right';
	});
	menuRight.dataset.target = 'menu-right';
	
	window.addEventListener('click', function(event) {
	var action = event.target.dataset.action,
		target = event.target.dataset.target;

	if (action !== 'right' && target !== 'menu-right') {
		if (action == 'left' && target !== 'menu-right') {
			menuLeft.classList.toggle('show-menu');
			projectsWrapper.classList.toggle('collapse');
		} else {
			menuRight.classList.remove('show-menu');
		};
	} else if (action == 'right') {
		menuRight.classList.toggle('show-menu');
	};
	
	});
})();