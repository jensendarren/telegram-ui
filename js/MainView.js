class MainView {
    constructor() {
        this.login = new Login();
        this.enterCode = new EnterCode();
        this.enterPassword = new EnterPassword();
        this.enterName = new EnterName();

        this.dialogsList = new DialogsList();
        this.messagesList = new MessagesList();
    }

    initControls() {
        const buttons = $$('.btn');
        for (let i in buttons) {
            if (buttons.hasOwnProperty(i)) {
                new Button(buttons[i]);
            }
        }
        const inputs = $$('.input-container');
        for (let i in inputs) {
            if (inputs.hasOwnProperty(i)) {
                if (!inputs[i].classList.contains('select-container')) {
                    new Input(inputs[i]);
                }
            }
        }
    }

    init() {
        this.initControls();

        this.login.init();
        this.enterCode.init();
        this.enterPassword.init();
        this.enterName.init();
        this.enterCode.onBack = () => this.showScreen('login');
    }

    showMain() {
        this.showScreen('main');
        this.dialogsList.init();
        this.messagesList.init();
    }

    showScreen(name) {
        toggle($('#login'), name === 'login', 'flex');
        toggle($('#enterCode'), name === 'enterCode', 'flex');
        toggle($('#enterPassword'), name === 'enterPassword', 'flex');
        toggle($('#enterName'), name === 'enterName', 'flex');
        toggle($('#main'), name === 'main', 'flex');
    }
}
