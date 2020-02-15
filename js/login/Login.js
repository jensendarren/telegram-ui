class Login {
    static getCode(phone) {
        let result = null;
        let maxLen = 0;
        phoneCodes.forEach(item => {
            const code = item[1];
            if (phone.startsWith('+' + code)) {
                if (code.length >= maxLen) {
                    maxLen = code.length;
                    result = item;
                }
            }
        });
        return result;
    }

    constructor() {
        this.onLogin = null;
    }

    init() {
        let i = 0;
        $('#login_countryInputContainer .select-items').innerHTML = phoneCodes.map(k => `<div class="select-item" data-id="${i++}">
            <div class="country-flag">${k[2]}</div>
            <div class="country-name">${k[0]}</div>
            <div class="country-code">+${k[1]}</div>
        </div>`).join('');

        new Select($('#login_countryInputContainer'));

        onInput($('#login_countryInput'), e => {
            const name = $('#login_countryInput').value;
            const items = $$('#login_countryInputContainer .select-item');
            for (let i in items) {
                if (items.hasOwnProperty(i)) {
                    const item = items[i];
                    toggle(item, name === '' || phoneCodes[i][0].toLowerCase().startsWith(name.toLowerCase()));
                }
            }
        });
        $('#login_countryInputContainer').addEventListener('itemOver', e => {
            const i = Number(e.item.getAttribute('data-id'));
            $('#login_countryInput').placeholder = phoneCodes[i][0]
        });

        $('#login_countryInputContainer').addEventListener('itemOut', e => {
            $('#login_countryInput').placeholder = 'Country';
        });

        $('#login_countryInputContainer').addEventListener('itemSelect', e => {
            const i = Number(e.item.getAttribute('data-id'));
            const oldPhone = $('#login_phoneInput').value;
            const oldCode = Login.getCode(oldPhone);
            const newPhone = '+' + phoneCodes[i][1] + oldPhone.substr(oldCode ? (oldCode[1].length + 1) : 0);
            $('#login_countryInput').value = phoneCodes[i][0];
            $('#login_phoneInput').value = newPhone;
            $('#login_phoneInput').focus();
        });

        onInput($('#login_phoneInput'), e => {
            const code = Login.getCode($('#login_phoneInput').value);
            $('#login_countryInput').value = code ? code[0] : '';
            this.updateButton()
        });
        this.updateButton();
        $('#login_button').addEventListener('click', () => {
            $('#login_button').classList.add('loading');
            const phone = $('#login_phoneInput').value.replace(/\s/g, '');
            this.onLogin(phone, $('#login_checkbox').checked)
        });
    }

    updateButton() {
        toggle($('#login_button'), $('#login_phoneInput').value.length > 0);
    }
}