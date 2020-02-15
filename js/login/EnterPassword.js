class EnterPassword {
    constructor() {
        this.onPassword = null;
    }

    init() {
        $('#enterPassword_showButton').addEventListener('click', () => {
            const x = $('#enterPassword_input');
            if (x.type === 'password') {
                x.type = 'text';
                $('.monkey-logo-password').classList.add('error');
                $('#enterPassword_showButton').classList.add('show');
            } else {
                x.type = 'password';
                $('.monkey-logo-password').classList.remove('error');
                $('#enterPassword_showButton').classList.remove('show');
            }
        });

        $('#enterPassword_button').addEventListener('click', () => {
            $('#enterPassword_button').classList.add('loading');
            this.onPassword($('#enterPassword_input').value);
        });
    }

    showError() {
        $('#enterPassword_button').classList.remove('loading');
        $('.monkey-logo-password').classList.add('error');
        $('#enterPassword_inputContainer').classList.add('error');
    }
}