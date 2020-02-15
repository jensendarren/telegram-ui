class EnterCode {
    constructor() {
        this.onCode = null;
        this.onBack = null;
    }

    init() {
        onInput($('#enterCode_input'), e => {
            if ($('#enterCode_input').value.length === 5) {
                $('#enterCode_inputContainer').classList.add('loading');
                this.onCode($('#enterCode_input').value);
            } else {
                this.hideError();
            }
        });

        $('#enterCode_backButton').addEventListener('click', () => this.onBack());
    }

    showError() {
        $('#enterCode_inputContainer').classList.remove('loading');
        $('.monkey-logo').classList.add('error');
        $('#enterCode_inputContainer').classList.add('error');
    }

    hideError() {
        $('.monkey-logo').classList.remove('error');
        $('#enterCode_inputContainer').classList.remove('error');
    }
}