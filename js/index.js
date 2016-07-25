(function() {
	var switchLeft = document.getElementById('switch-left'),
		switchRight = document.getElementById('switch-right'),
		menuLeft = document.getElementsByClassName('menu')[0],
		menuRight = document.getElementsByClassName('menu')[1],
		menuRightInputs = [].slice.call(menuRight.children),
		projects = document.getElementsByClassName('projects')[0];

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
				projects.classList.toggle('collapse-table');
			} else {
				menuRight.classList.remove('show-menu');
			};
		} else if (action == 'right') {
			menuRight.classList.toggle('show-menu');
		};
	});
})();