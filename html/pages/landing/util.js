document.querySelectorAll('span[characters]').forEach(el => {
    el.style.setProperty('--char-len', el.getAttribute('characters'));
});