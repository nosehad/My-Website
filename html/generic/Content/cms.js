#include "../../../properties.h"

let cms_pages = C_PRELOAD_CONST_PAGES;

let cms_ov_responseText;
let cms_ov_modifyer;
let cms_init_body;
let cms_current_location;
let cms_document_cache = new Map();
let cms_startup_cache = new Map();
let cms_loaded_scripts = new Map();
let cms_queries;

/* basically used to optaion the static path for a dynamic styled route */
function cms_getPageFile(route) {
    const page = cms_pages.find((page) => page['route'] === route);
    if (page) {
        page['pre_load_scripts'].forEach(script => {
            cms_loadScript(script);
        });
        return page['static'];
    }
    return SRV_404_ROUTE;
}

function cms_loadScript(uri) {
    if (cms_loaded_scripts.get(uri)) /* prevent script redeclaration */
        return;

    cms_loaded_scripts.set(uri, true);

    let scriptElement = document.createElement('script');
    scriptElement.src = uri;
    scriptElement.setAttribute("charset", 'UTF-8');
    document.head.appendChild(scriptElement);
}

function cms_runOnStartup(func) {
    let startup_handlers = cms_startup_cache.get(cms_current_location);

    if (startup_handlers == undefined) {
        startup_handlers = new Set();
        cms_startup_cache.set(cms_current_location, startup_handlers);
    }

    startup_handlers.add(func); /* add startup handler for ducment */

    func(); /* call function */
}

function cms_pushContent() {

    if (cms_init_body == undefined)
        cms_init_body = document.body.cloneNode(true);

    cms_ov_modifyer = () => {
        console.log("setup overlay");
        head_nodes = new Set();
        [...document.head.querySelectorAll('link, script, style')]
        .forEach(el => head_nodes.add(el.cloneNode(true)));

        document.open();
        document.write(cms_ov_responseText);

        head_nodes.forEach((old) => {
            document.head.appendChild(old)
        });

        const overlay = document.createElement('div');
        overlay.classList.add('loader-overlay');
        document.body.insertAdjacentElement("afterbegin", overlay);

        //document.head.replaceWith(old_head);

        /* register popstate after document.write */
        window.addEventListener('popstate', function (event) {
            redirect(window.location.pathname, true, false);
        });

        if (cms_document_cache.get(cms_current_location) == undefined)
            cms_document_cache.set(cms_current_location, cms_ov_responseText);

        /* call startup handlers */
        let handlers = cms_startup_cache.get(cms_current_location);
        if (handlers != undefined) {
            handlers.forEach(handler => {
                handler();
            });
        }

        cms_ov_modifyer = undefined;
        cms_ov_responseText = undefined;
    }
    if (cms_ov_responseText != undefined)
        cms_ov_modifyer();
}

function cms_getAndPopQueryValue(queryKey) {
    const value = cms_queries.get(queryKey)
    if(value != undefined)
        cms_queries.delete(queryKey);
    
    return value;
}

function redirect(rlocation, r = true /* reset document */, ps = true /* push to history stack */, params/*=[key, value]*/) {
    if (r)
        document.documentElement.replaceWith(cms_init_body);

    if (ps)
        history.pushState(null, '', rlocation);
    if(params != undefined) 
        cms_queries.set(params[0], params[1])

    cms_current_location = rlocation;

    document.addEventListener('animationend', (event) => {
        if (event.animationName == "content-fade") {
            cms_pushContent()
        }
    });

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            cms_ov_responseText = xhttp.responseText;
            if (cms_ov_modifyer != undefined)
                cms_ov_modifyer();
        }
    }

    cms_ov_responseText = cms_document_cache.get(rlocation);

    if (cms_ov_responseText != undefined)
        return;
    
    xhttp.open("GET", cms_getPageFile(rlocation), true);
    xhttp.send();
}

/* optain extern queries */
const queryString = window.location.search;
if(cms_queries == undefined)
    cms_queries = new URLSearchParams(queryString);

redirect(window.location.pathname, false);

