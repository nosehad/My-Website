let head = document.getElementById('head');

// Get the sections
let home = document.getElementById('home');
let about = document.getElementById('about');
let skills = document.getElementById('skills');
let projects = document.getElementById('projects');
let contact = document.getElementById('contact');

let homel = document.getElementById('homel');
let aboutl = document.getElementById('aboutl');
let skillsl = document.getElementById('skillsl');
let projectsl = document.getElementById('projectsl');
let contactl = document.getElementById('contactl');

const body_sections = document.querySelectorAll('section');

let sectionHeight = window.innerHeight*0.50;
let currentSection = 0;
let scrolling = false;
let currentScroll = 0;
let oldScroll = 0;
let direction;

// Add event listener for scroll event
//window.addEventListener('touchmove', () => makeScroll())
window.addEventListener('scroll', () => makeScroll());

// disable space bar scrolling
window.addEventListener("keydown", function (e) {
    if (e.code === "Space") 
    {
        if(currentSection != 4)
            currentSection++;
        switch(currentSection)
        {
            case 0:
                s_home();
                break;
            case 1:
                s_about();
                break;
            case 2:
                s_skills();
                break;
            case 3:
                s_projects();
                break;
            case 4:
                s_contact();
                break;
        }
        e.preventDefault();
    }
});

async function makeScroll()
{
    /*if((window.pageYOffset % sectionHeight) < (window.innerHeight/10) && Math.floor(window.pageYOffset/sectionHeight) != currentSection)
    {
        body.style.overflowY = "hidden";
        setTimeout(() => {
            document.body.style.overflowY = "scroll";
        }, 1000);
    }*/
    currentSection = Math.floor(window.pageYOffset/sectionHeight);
    switch(currentSection)
    {
        case 0:
            load_home();
            break;
        case 1:
            load_about();
            break;
        case 2:
            load_skills();
            break;
        case 3:
            load_projects();
            break;
        case 4:
            load_contact();
            break;
    }
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

let load_home = () =>
{
    clearNavbar();
    homel.style.backgroundColor = "#557a4c";
    homel.style.color = "#ECC8AF";
}

let load_about = () =>
{
    clearNavbar();
    aboutl.style.backgroundColor = "#557a4c";
    aboutl.style.color = "#E7AD99";
}

let load_skills = () =>
{
    clearNavbar();
    skillsl.style.backgroundColor = "#557a4c";
    skillsl.style.color = "#CE796B";
}

let load_projects = () =>
{
    clearNavbar();
    projectsl.style.backgroundColor = "#557a4c"; 
    projectsl.style.color = "#C18C5D";
}

let load_contact = () =>
{
    head.style.color = "#fff";
    homel.style.color = "#fff";
    homel.style.backgroundColor = "transparent";
    aboutl.style.color = "#fff";
    aboutl.style.backgroundColor = "transparent";
    skillsl.style.color = "#fff";
    skillsl.style.backgroundColor = "transparent";
    projectsl.style.color = "#fff";
    projectsl.style.backgroundColor = "transparent";
    contactl.style.color = "#495867";
    contactl.style.backgroundColor = "#557a4c";
}

let s_home = () =>
{
    scroll(0, 0)
}

let s_about = () =>
{
    scroll(0, sectionHeight*1)
}

let s_skills = () =>
{
    scroll(0, sectionHeight*2)
}

let s_projects = () =>
{
    scroll(0, sectionHeight*3)
}

let s_contact = () =>
{
    scroll(0, sectionHeight*4)
}

let clearNavbar = () =>
{
    head.style.color = "#0A0908";
    homel.style.color = "#0A0908";
    homel.style.backgroundColor = "transparent";
    aboutl.style.color = "#0A0908";
    aboutl.style.backgroundColor = "transparent";
    skillsl.style.color = "#0A0908";
    skillsl.style.backgroundColor = "transparent";
    projectsl.style.color = "#0A0908";
    projectsl.style.backgroundColor = "transparent";
    contactl.style.color = "#0A0908";
    contactl.style.backgroundColor = "transparent";
}