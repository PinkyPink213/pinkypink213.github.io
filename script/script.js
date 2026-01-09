var scrollToTopBtn = document.getElementById('up-button');
var rootElement = document.documentElement;

function scrollToTop() {
	// Scroll to top logic
	rootElement.scrollTo({
		top: 0,
		behavior: 'smooth',
	});
}
scrollToTopBtn.addEventListener('click', scrollToTop);

scrollToTopBtn.style.display = 'none'; //by default should be hidden
document.querySelector('body').onscroll = function () {
	//whenever they scroll
	if (window.scrollY > 150)
		//if scroll is 150px from top
		scrollToTopBtn.style.display = 'block'; //if they scroll down, show
	else scrollToTopBtn.style.display = 'none'; //if they scroll up, hide
};

const reveals = document.querySelectorAll('.reveal');

const revealOnScroll = () => {
	for (let i = 0; i < reveals.length; i++) {
		const windowHeight = window.innerHeight;
		const elementTop = reveals[i].getBoundingClientRect().top;
		const visiblePoint = 80;

		if (elementTop < windowHeight - visiblePoint) {
			reveals[i].classList.add('active');
		}
	}
};

window.addEventListener('scroll', revealOnScroll);
revealOnScroll();
