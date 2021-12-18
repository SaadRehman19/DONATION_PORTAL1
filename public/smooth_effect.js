const effect = document.querySelector('.landing-content');

window.addEventListener('scroll', scrollEffect);

function scrollEffect() {
    if (window.scrollY >= 80) {
        effect.style.opacity = 1;
        effect.style.transition = '0.8s ease-in';
        effect.style.transform = 'translateX(-50%)';
        // effect.style.transform='translateX(50%)';
        // effect.style.textalign='center';
    } else {
        effect.style.opacity = 0;
    }
}

scrollEffect();