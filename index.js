let sectionHeight = parseInt(document.body.scrollHeight/5);

let home = 0;
let about = sectionHeight;
let skills = sectionHeight*2;
let projects = sectionHeight*3;
let contact = sectionHeight*4;

let nav_home = document.getElementById('nav-home');
let nav_about = document.getElementById('nav-about');
let nav_skills = document.getElementById('nav-skills');
let nav_projects = document.getElementById('nav-projects');
let nav_contact = document.getElementById('nav-contact');
let nav_name = document.getElementById('name');
let body = document.getElementById('body');

let welcome_h = document.getElementById('welcome_txt');

let current = 0;

let scrolling = false;
let welcome_txt = ["//Performance Developer", "//student", "//perfectionist", "//Mountain Biker", "//Software Engineer", "//self-taught"];

let previous = 0;

init();

function init()
{

    if(window.location.href.endsWith('home'))
    {
        set_p(0, true);
    }
    else if(window.location.href.endsWith('about'))
    {
        set_p(1, true);
    }
    else if(window.location.href.endsWith('skills'))
    {
        set_p(2, true);
    }
    else if(window.location.href.endsWith('projects'))
    {
        set_p(3, true);
    }
    else if(window.location.href.endsWith('contact'))
    {
        set_p(4, true);
    }
    else {
        set_p(0, true);
    }
}

document.addEventListener('scroll', function(e) {
    if(window.scrollY == previous)
    {
        return;
    }
    if(!scrolling) 
    {
        console.log(1)
        d_scroll(window.scrollY > previous);
    }
    previous = window.scrollY;
})

addEventListener('resize', function(e) {
    sectionHeight = parseInt(document.body.scrollHeight/5);
    home = 0;
    about = sectionHeight;
    skills = sectionHeight*2;
    projects = sectionHeight*3;
    contact = sectionHeight*4;
    this.document.getElementById
});

function d_scroll(down)
{
    current = (down && current != 4) ? current +1 : (down && current == 4) ? current : current -1; 
    set_p(current, false);
}

async function set_p(page, click)
{
    if(scrolling)
    {
        return;
    }
    current = page;
    body.style.overflow = "hidden";
    scrolling = true;
    switch(current)
    {
        case 0:
            setHome();
            break;
        case 1:
            setAbout();
            break;
        case 2:
            setSkills();
            break;
        case 3:
            setProjects();
            break;
        case 4:
            setContact();
            break;            
    } 
    await new Promise(r => setTimeout(r, click ? 1000 : 1000));
    scrolling = false;
    body.style.overflow = "auto";
}

function setContact()
{
    nav_home.style.color = "#fff";
    nav_home.style.backgroundColor = "transparent";

    nav_about.style.color = "#fff";
    nav_about.style.backgroundColor = "transparent";

    nav_skills.style.color = "#fff";
    nav_skills.style.backgroundColor = "transparent";

    nav_projects.style.color = "#fff";
    nav_projects.style.backgroundColor = "transparent";

    nav_contact.style.color = "#343c47";
    nav_contact.style.backgroundColor = "#d5005a";

    nav_name.style.color = "#fff";
    scroll({
        top: contact,
        behavior: 'smooth'
      });
}

function setProjects()
{
    nav_home.style.color = "#343c47";
    nav_home.style.backgroundColor = "transparent";

    nav_about.style.color = "#343c47";
    nav_about.style.backgroundColor = "transparent";

    nav_skills.style.color = "#343c47";
    nav_skills.style.backgroundColor = "transparent";

    nav_projects.style.color = "#fff";
    nav_projects.style.backgroundColor = "#d5005a";

    nav_contact.style.color = "#343c47";
    nav_contact.style.backgroundColor = "transparent";

    nav_name.style.color = "#343c47";
    scroll({
        top: projects,
        behavior: 'smooth'
      });
}

function setSkills()
{
    nav_home.style.color = "#343c47";
    nav_home.style.backgroundColor = "transparent";

    nav_about.style.color = "#343c47";
    nav_about.style.backgroundColor = "transparent";

    nav_skills.style.color = "#f5f8fb";
    nav_skills.style.backgroundColor = "#d5005a";

    nav_projects.style.color = "#343c47";
    nav_projects.style.backgroundColor = "transparent";

    nav_contact.style.color = "#343c47";
    nav_contact.style.backgroundColor = "transparent";

    nav_name.style.color = "#343c47";

    document.getElementById('cpp_bar').style.animation = "cpp 2s ease-out 0s 1 alternate";
    document.getElementById('java_bar').style.animation = "java 2s ease-out 0s 1 alternate";
    document.getElementById('python_bar').style.animation = "python 2s ease-out 0s 1 alternate";
    document.getElementById('web_bar').style.animation = "web 2s ease-out 0s 1 alternate";

    scroll({
        top: skills,
        behavior: 'smooth'
      });
}

function setAbout()
{
    nav_home.style.color = "#343c47";
    nav_home.style.backgroundColor = "transparent";

    nav_about.style.color = "#fff";
    nav_about.style.backgroundColor = "#d5005a";

    nav_skills.style.color = "#343c47";
    nav_skills.style.backgroundColor = "transparent";

    nav_projects.style.color = "#343c47";
    nav_projects.style.backgroundColor = "transparent";

    nav_contact.style.color = "#343c47";
    nav_contact.style.backgroundColor = "transparent";

    nav_name.style.color = "#343c47";
    scroll({
        top: about,
        behavior: 'smooth'
      });
}

function setHome()
{
    nav_home.style.color = "#343c47";
    nav_home.style.backgroundColor = "#d5005a";

    nav_about.style.color = "#fff";
    nav_about.style.backgroundColor = "transparent";

    nav_skills.style.color = "#fff";
    nav_skills.style.backgroundColor = "transparent";

    nav_projects.style.color = "#fff";
    nav_projects.style.backgroundColor = "transparent";

    nav_contact.style.color = "#fff";
    nav_contact.style.backgroundColor = "transparent";

    nav_name.style.color = "#fff";
    scroll({
        top: home,
        behavior: 'smooth'
      });
}

function carousel()
{
    let backend = document.getElementById('backend');
    let web = document.getElementById('web')
    let t = backend.innerHTML;
    backend.innerHTML = web.innerHTML;
    web.innerHTML = t;
}