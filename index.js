const centered = document.querySelectorAll(".center");

for (let i = 0; i < centered.length; i++) {
  centered[i].style.marginTop = `${(centered[i].parentElement.offsetHeight/2)-(centered[i].offsetHeight/2)}px`;
}