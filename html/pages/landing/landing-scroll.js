// lenis smooth scroll 

#include "../../colortheme.h"

const SECTION_HEIGHT = document.querySelector("section").offsetHeight;
const SECTION_PIN_TIME = 500;

const navbar = document.querySelector(".navbar");

const lenis = new Lenis({
    lerp: 0.03,       // Lower value = slower scroll response (0.01 - 0.2)
    smooth: true,     // Enables smooth scrolling
    direction: 'vertical',
  });

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);


// gsap
document.addEventListener('animationend', (event) => {
    if (event.animationName == "content-fade-reverse") {
        gsap.registerPlugin(ScrollToPlugin, ScrollTrigger)

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: ".avatar",
                start: "top top",
                end: `+=${SECTION_HEIGHT}`,
                scrub: 1,
                markers: false,
            }
        });
        
        const tl2 = gsap.timeline({
            scrollTrigger: {
                trigger: ".avatar",
                start: "top top",
                end: `+=${SECTION_HEIGHT}`,
                scrub: 1,
                markers: false
            }
        });
        
        const sectionHome = gsap.timeline({
            scrollTrigger: {
                pin: true,
                trigger: "#home",
                start: "top top",
                end: `+=${SECTION_PIN_TIME}`,
                scrub: 1,
                markers: false
            }
        });
        
        const sectionAbout = gsap.timeline({
            scrollTrigger: {
                pin: true,
                trigger: "#about",
                start: "top top",
                end: `+=${SECTION_PIN_TIME}`,
                scrub: 1,
                markers: false
            }
        });

        const sectionSkills = gsap.timeline({
            scrollTrigger: {
                pin: true,
                trigger: "#skills",
                start: "top top",
                end: `+=${SECTION_PIN_TIME}`,
                scrub: 1,
                markers: false
            }
        });
        
        const sectionProjects = gsap.timeline({
            scrollTrigger: {
                pin: true,
                trigger: "#projects",
                start: "top top",
                end: `+=${SECTION_PIN_TIME}`,
                scrub: 1,
                markers: false
            }
        });

        const sectionContact = gsap.timeline({
            scrollTrigger: {
                pin: false,
                trigger: "#contact",
                start: "top top",
                end: `+=${SECTION_PIN_TIME}`,
                scrub: 1,
                markers: false
            }
        });
        
        tl.to("#whoami-wrap", {
            y:+SECTION_HEIGHT+SECTION_PIN_TIME,
            duration: 1
        });
        
        tl2.to("#avatar", {
            y:+SECTION_HEIGHT+SECTION_PIN_TIME,
            duration: 1
        });
    }
});

function noseh_scrollEaser(x) {
    return -(Math.cos(Math.PI * x) - 1) / 2;
}

function noseh_s_home() {
    lenis.scrollTo(0, {easing: noseh_scrollEaser, duration: 2});
}
function noseh_s_about() {
    lenis.scrollTo((SECTION_HEIGHT + SECTION_PIN_TIME) * 1, {easing: noseh_scrollEaser, duration: 2});
}
function noseh_s_skills() {
    lenis.scrollTo((SECTION_HEIGHT + SECTION_PIN_TIME) * 2, {easing: noseh_scrollEaser, duration: 2});
}
function noseh_s_projects() {
    lenis.scrollTo((SECTION_HEIGHT + SECTION_PIN_TIME) * 3, {easing: noseh_scrollEaser, duration: 2});
}
function noseh_s_contact() {
    lenis.scrollTo((SECTION_HEIGHT + SECTION_PIN_TIME) * 4, {easing: noseh_scrollEaser, duration: 2});
}

document.addEventListener('scroll', (e) => {
    document.querySelectorAll(".navbar span").forEach((span) => {
        let span_section = Math.floor((window.scrollY + span.offsetTop + span.offsetHeight + 2) / (SECTION_HEIGHT + SECTION_PIN_TIME));
        switch(span_section) {
            case 0:
                span.style.border =`5px solid ${`SECTION_1_BG`}`;
                break;
            case 1:
                span.style.border =`5px solid ${`SECTION_2_BG`}`;
                break;
            case 2:
                span.style.border =`5px solid ${`SECTION_3_BG`}`;
                break;
            case 3:
                span.style.border =`5px solid ${`SECTION_4_BG`}`;
                break;
            case 4:
                span.style.border =`5px solid ${`SECTION_5_BG`}`;
                break;
            default:
                break;
        }
    });

    document.querySelector(".navbar").style.setProperty("--distance-scrolled", `${20 + (20*(window.scrollY / (SECTION_HEIGHT + SECTION_PIN_TIME)))}`);
})