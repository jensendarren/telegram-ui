class Select extends Input {
    constructor(div) {
        super(div);

        const items = div.querySelectorAll('.select-item');
        for (let i in items) {
            if (items.hasOwnProperty(i)) {
                const item = items[i];
                item.addEventListener('click', e => {
                    const event = new Event('itemSelect');
                    event.item = e.currentTarget;
                    div.dispatchEvent(event);
                });
                item.addEventListener('mouseover', e => {
                    const event = new Event('itemOver');
                    event.item = e.currentTarget;
                    div.dispatchEvent(event);
                });
                item.addEventListener('mouseout', e => {
                    const event = new Event('itemOut');
                    event.item = e.currentTarget;
                    div.dispatchEvent(event);
                });
            }
        }

        this.input.addEventListener('click', e => {
            e.stopImmediatePropagation();
            toggleClass(div, 'open');
        });
        document.addEventListener('click', () => div.classList.remove('open'));
    }
}