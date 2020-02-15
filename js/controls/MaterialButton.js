class MaterialButton {
    constructor(div) {
        div.addEventListener('click', e => {
            let ink = div.querySelector('.ink');

            if (ink) {
                ink.classList.remove('animate');
            } else {
                ink = document.createElement('span');
                ink.classList.add('ink');
                ink.style.width = ink.style.height = Math.max(div.offsetWidth, div.offsetHeight) + 'px';
                div.appendChild(ink);
            }

            ink.style.left = (e.offsetX - ink.offsetWidth / 2) + 'px';
            ink.style.top = (e.offsetY - ink.offsetHeight / 2) + 'px';
            ink.classList.add('animate');
        }, false);
    }
}