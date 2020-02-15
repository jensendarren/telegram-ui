class Input {
    constructor(div) {
        this.input = div.querySelector('input');
        this.label = div.querySelector('label');
        const update = () => toggle(this.label, (this.input.value != null) && (this.input.value !== ''));
        onInput(div, update);
        update();
    }
}