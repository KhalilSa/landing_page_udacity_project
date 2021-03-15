/**
 * 
 * Manipulating the DOM exercise.
 * Exercise programmatically builds navigation,
 * scrolls to anchors from navigation,
 * and highlights section in viewport upon scrolling.
 * 
 * Dependencies: None
 * 
 * JS Version: ES2015/ES6
 * 
 * JS Standard: ESlint
 * 
 */

/**
 * Define Global Variables
 * 
 */
const sections = document.getElementsByTagName('section');
const navList = document.getElementById('navbar__list');
const scrollLink = document.getElementById('scroll-link');
const header = document.getElementsByClassName('page__header')[0];
// Using Fragment for performance reasons
const fragment = document.createDocumentFragment();

/**
 * End Global Variables
 * Scroll to top and hide elem when not in view
 * 
 */
// document.body.scrollTop for Safari 
// document.documentElement.scrollTop for Chrome, Internet Explorer, Firefox, and Opera 
window.addEventListener('scroll', () => {
    if (document.body.scrollTop > 450 || document.documentElement.scrollTop > 450) {
        scrollLink.style.display = 'block';
    } else {
        scrollLink.style.display = 'none';
    }
});

/**
 * Dynamically highlight current active section item in navbar
 * first we calculate the position of each section 
 * using the getboundingclientrect function at each scroll event
 * second we'll add an active state class if the calculated value is in the range of (-200px; 150px)
 * remove the class otherwise
 */

window.addEventListener('scroll', () => {
    let boundries = [];
    for (const sect of sections) {
        boundries.push([sect.getBoundingClientRect().y, sect.id]);
    }
    for (let boundry of boundries) {
        if (boundry[0] > -200 && boundry[0] < 150) {
            let elms = document.querySelectorAll('a[href*=section]');
            let activeItem = document.querySelector('.active');
            if (activeItem) {
                activeItem.className = activeItem.className.replace("active", "");
            }
            for (let elm of elms) {
                if (elm.href.endsWith(boundry[1])) {
                    elm.parentElement.className += "active";
                }
            }
        }
    }
});

// smooth scrolling for the 'to the top' link
scrollLink.addEventListener('click', () => {
    window.scroll({
        top: 0,
        behavior: 'smooth'
    });
});
/**
 * Hide navbar is the user stopped scrolling
 * 
 */

let timer = null;
const hideDuration = 1000000;

window.addEventListener('scroll', () => {
    if (timer != null) {
        clearTimeout(timer);
        header.display = 'block';
        header.animate([
            { transform: 'translateY(-100px)' },
            { transform: 'translateY(0px)' },
            { easing: 'ease-in' }
        ], { duration: 700 });
        header.style.transform = 'none';
    }
    timer = setTimeout(() => {
        header.animate([
            { transform: 'translateY(0px)' },
            { transform: 'translateY(-100px)' },
            { easing: 'ease-out' }
        ], { duration: 700 });
        header.style.transform = 'translateY(-100px)';
        header.display = 'none';
    }, hideDuration);
});

/**
 * build the nav
 * looping through the sections and creating new list elem then adding to the fragment
 * finally adding the fragment to the DOM
 * the counter is for setting the href of the anchor element
 */
document.addEventListener('DOMContentLoaded', () => {
    counter = 1
    for (let section of sections) {
        let li = document.createElement('li');
        let a = document.createElement('a');
        let href = '#section' + String(counter);
        a.setAttribute('href', href);
        a.innerText = section.firstElementChild.firstElementChild.innerText;
        li.appendChild(a);
        /**
         * The following event listener will
         * highlight current active nav item
         * when a li elem is clicked then active class will be added to its class list
         * and removes active class from the previous active item
         */
        li.addEventListener('click', function(e) {
            let activeItem = document.querySelector('.active');
            if (activeItem) {
                activeItem.className = activeItem.className.replace("active", "");
            }
            this.className += "active";
            /** 
             * smooth scrolling behavior
             */
            e.preventDefault();
            document.querySelector(href).scrollIntoView({ behavior: "smooth" });
        });
        fragment.appendChild(li);
        counter++;
    }
    navList.appendChild(fragment);
});