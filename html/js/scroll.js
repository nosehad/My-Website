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

const links = [homel, aboutl, skillsl, projectsl, contactl];
const DEFAULT_MARGIN = [20, 110, 200, 286, 392];
const holder = document.getElementById("el-background");

const body_sections = document.querySelectorAll('section');

let sectionHeight = window.innerHeight * 0.50;
let currentSection = 0;
let scrolling = false;
let currentScroll = 0;
let oldScroll = 0;
let direction = false;

let loaded_section = 0;

// Add event listener for scroll event
//window.addEventListener('touchmove', () => makeScroll())
window.addEventListener('scroll', () => makeParalax());

// disable space bar scrolling
window.addEventListener("keydown", function (e) {
    if (e.code === "Space") {
        if (currentSection != 4)
            currentSection++;
        switch (currentSection) {
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
        //e.preventDefault(); /* dont prevent default hence input fields wouldnt work */
    }
});

async function makeParalax() {
    if (!scrolling) {
        let scrollToY;
        if (window.scrollY < (currentScroll)) {
            scrollToY = sectionHeight * (currentSection-- - 1);
            console.log(currentScroll + " < " + window.scrollY)
        }
        else if (window.scrollY > (currentScroll)) {
            scrollToY = sectionHeight * (currentSection++ + 1);
            console.log(currentScroll + " > " + window.scrollY)
        }
        else
            return;
        console.log("setting currentScroll to " + window.scrollY);
        currentScroll = window.scrollY; // update current scroll
        makeScroll(scrollToY);
        return;
    }
    currentScroll = window.scrollY;

    currentSection = Math.floor(window.scrollY / sectionHeight);
    switch (currentSection) {
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
}

function makeScroll(scrollToY) {
    if (scrolling)
        return;
    if (currentScroll < scrollToY)
        direction = true; /* up */
    else
        direction = false; /* down */

    document.body.style.overflowY = "hidden";
    console.log("makescroll:" + scrollToY);
    scrolling = true;
    scroll(0, scrollToY);
    setTimeout(() => {
        document.body.style.overflowY = "scroll";
        scrolling = false;
    }, 800);
}

let parallax = () => {
    //home.style.transform = `translateY(${(window.scrollY/2)}px)`;
    about.style.transform = `translateY(${-(window.scrollY)}px)`;
    skills.style.transform = `translateY(${-(window.scrollY)}px)`;
    projects.style.transform = `translateY(${-(window.scrollY)}px)`;
    contact.style.transform = `translateY(${-(window.scrollY)}px)`;
    return;
}

let moveHolder = (section) => {
    holder.style.width = `${links[section].offsetWidth - 38/* padding */ /*border*/}px`;
    holder.style.marginLeft = `${DEFAULT_MARGIN[section]}px`;
}

let load_home = () => {
    if (loaded_section == 0)
        return;
    loaded_section = 0;

    clearNavbar();
    moveHolder(loaded_section);
    homel.style.color = "#9FA4C4";
    console.log("loading home: " + direction);
    homel.style.animation = "scrollDown 0.4s ease-out";

    setTimeout(() => {
        if (loaded_section == 0)
            history.pushState(null, "Home", "/home");
    }, 400);
}

let load_about = () => {
    if (loaded_section == 1)
        return;
    loaded_section = 1;

    clearNavbar();
    moveHolder(loaded_section);
    aboutl.style.color = "#6C464F";
    aboutl.style.animation = (direction ? "scrollUp" : "scrollDown") + " 0.4s ease-out";
    homel.style.animation = ""; /* reset home animation */

    setTimeout(() => {
        if (loaded_section == 1)
            history.pushState(null, "about Nosehad", "/about");
    }, 400);
}

let load_skills = () => {
    if (loaded_section == 2)
        return;
    loaded_section = 2;

    clearNavbar();
    moveHolder(loaded_section);
    skillsl.style.color = "#B8C5D6";
    skillsl.style.animation = (direction ? "scrollUp" : "scrollDown") + " 0.4s ease-out";

    setTimeout(() => {
        if (loaded_section == 2)
            history.pushState(null, "Nosehad's Skills", "/skills");
    }, 400);
}

let load_projects = () => {
    if (loaded_section == 3)
        return;
    loaded_section = 3;

    clearNavbar();
    moveHolder(loaded_section);
    projectsl.style.color = "#95B8D1";
    projectsl.style.animation = (direction ? "scrollUp" : "scrollDown") + " 0.4s ease-out";

    contactl.style.animation = "";

    setTimeout(() => {
        if (loaded_section == 3)
            history.pushState(null, "Nosehad's Projects", "/projects");
    }, 400);
}

let contact_loaded = false;
let load_contact = () => {
    if (loaded_section == 4)
        return;
    loaded_section = 4;

    head.style.color = "#FCFCFC";
    homel.style.color = "#FCFCFC";
    homel.style.backgroundColor = "transparent";
    aboutl.style.color = "#FCFCFC";
    aboutl.style.backgroundColor = "transparent";
    skillsl.style.color = "#FCFCFC";
    skillsl.style.backgroundColor = "transparent";
    projectsl.style.color = "#FCFCFC";
    projectsl.style.backgroundColor = "transparent";
    contactl.style.color = "#272D2D";
    moveHolder(loaded_section);
    contactl.style.animation = "scrollUp 0.4s ease-out"; /* only scroll down is possible since it is the last section */
 
    if(!contact_loaded) {
        document.getElementById('footer').style.bottom = "0px";
        contact_loaded = true;
    }

    setTimeout(() => {
        if (loaded_section == 4)
            history.pushState(null, "Contact Nosehad", "/contact");
    }, 400);
}

let s_home = () => {
    makeScroll(0);
}

let s_about = () => {
    makeScroll(sectionHeight * 1);
}

let s_skills = () => {
    makeScroll(sectionHeight * 2);
}

let s_projects = () => {
    makeScroll(sectionHeight * 3);
}

let s_contact = () => {
    makeScroll(sectionHeight * 4);
}

let clearNavbar = () => {
    head.style.color = "#2a3039";
    homel.style.color = "#2a3039";
    homel.style.backgroundColor = "transparent";
    aboutl.style.color = "#2a3039";
    aboutl.style.backgroundColor = "transparent";
    skillsl.style.color = "#2a3039";
    skillsl.style.backgroundColor = "transparent";
    projectsl.style.color = "#2a3039";
    projectsl.style.backgroundColor = "transparent";
    contactl.style.color = "#2a3039";
    contactl.style.backgroundColor = "transparent";
}

// setup "router"
let load_page = () => {
    let query = window.location.search.replace('/', '');
    console.log(query);
    if (window.location.search.includes('/')) {
        switch (query) {
            case "home":
                s_home();
                break;
            case "about":
                s_about();
                break;
            case "skills":
                s_skills();
                break;
            case "projects":
                s_projects();
                break;
            case "contact":
                s_contact();
                break;
            default:
                s_home();
                break;
        }
    }
    else
        load_home();
}
load_page();
// next and previous button of browser
addEventListener('popstate', (event) => setTimeout(() => load_page(), 100));