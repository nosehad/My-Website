// Get the sections
let home = document.getElementById('home');
let about = document.getElementById('about');
let skills = document.getElementById('skills');
let projects = document.getElementById('projects');
let contact = document.getElementById('contact');

const body_sections = document.querySelectorAll('section');

let sectionHeight = window.innerHeight*0.55;
let currentSection = 0;
let scrolling = false;
let currentScroll = 0;
let oldScroll = 0;
let direction;

// Add event listener for scroll event
//window.addEventListener('touchmove', () => makeScroll())
window.addEventListener('scroll', () => makeScroll());

async function makeScroll()
{
    if((window.pageYOffset % sectionHeight) < (window.innerHeight/10) && Math.floor(window.pageYOffset/sectionHeight) != currentSection)
    {
        body.style.overflowY = "hidden";
        setTimeout(() => {
            document.body.style.overflowY = "scroll";
        }, 1000);
    }
    currentSection = Math.floor(window.pageYOffset/sectionHeight);
    parallax();
    return;
    if(scrolling)
    {
        parallax();
        return;
    }
    scrolling = true;
    document.body.style.overflowY = "hidden";
    if(window.pageYOffset > oldScroll)
    {
        currentScroll+=sectionHeight;
        direction = 1; // down
    }
    else
    {
        currentScroll-=sectionHeight;
        direction = 0; // up
    }
    oldScroll = currentScroll;
    scroll(0, currentScroll);
    setTimeout(() => {
        scrolling = false;
        document.body.style.overflowY = "scroll";
    }, 1000);
}

let parallax = () => 
{
    //home.style.transform = `translateY(${(window.pageYOffset/2)}px)`;
    about.style.transform = `translateY(${-(window.pageYOffset)}px)`;
    skills.style.transform = `translateY(${-(window.pageYOffset)}px)`;
    projects.style.transform = `translateY(${-(window.pageYOffset)}px)`;
    contact.style.transform = `translateY(${-(window.pageYOffset)}px)`;
        return;
}