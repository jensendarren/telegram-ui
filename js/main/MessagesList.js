class MessagesList {
    constructor() {
        this.messages = [];
        this.minMessageId = 0;
        this.onScrollTop = null;
    }

    init() {
        // $('#chatMenuButton').addEventListener('click', () => {
        //     toggle($('#rightSidebar'))
        // });
        toggle($('#rightSidebar'), false);

        $('#messagesList').addEventListener('scroll', e => {
            if ($('#messagesList').scrollTop === 0) {
                this.onScrollTop()
            }
        });

        this.buttonForward = htmlToElement(`<div class="btn btn-circle btn-forward"></div>`);
        this.buttonForward.style.left = '100px';
        this.buttonForward.style.top = '100px';
        new Button(this.buttonForward);
        toggle(this.buttonForward, false);
        $('#chatContainer').appendChild(this.buttonForward);
    }

    clear() {
        $('#messagesList').innerHTML = '';
        this.minMessageId = 0;
        this.scrollToBottom()
    }

    prependMessages(data, scrollToBottom) {
        const addListeners = div => {
            div.addEventListener('mouseover', e => {
                const msgDiv = e.currentTarget;
                // toggle(this.buttonForward, true);
                this.buttonForward.style.left = (msgDiv.offsetLeft + msgDiv.offsetWidth) + 'px';
                this.buttonForward.style.top = msgDiv.offsetTop + 'px';
            });
            div.addEventListener('mouseout', () => {
                // toggle(this.buttonForward, false);
            });
        };

        const scrollHeight = $('#messagesList').scrollHeight;
        this.messages = data.messages.concat(this.messages);
        this.minMessageId = data.messages.length > 0 ? data.messages[data.messages.length - 1].id : 0;

        const nowDate = new Date();

        let lastFromId = 0;
        let lastI = 0;

        for (let i = 0; i < data.messages.length; i++) {
            const msg = data.messages[i];
            if (lastFromId !== msg.from_id) {
                if (i - lastI > 1) {
                    for (let j = lastI + 1; j < i; j++) {
                        data.messages[j].isStick = true;
                    }
                }

                lastFromId = msg.from_id;
                lastI = i;
            }

            if (i < data.messages.length - 1) {
                const curDate = createDate(msg.date);
                const nextDate = createDate(data.messages[i + 1].date);

                if ((curDate.getDay() !== nextDate.getDay()) || (curDate.getMonth() !== nextDate.getMonth()) || (curDate.getFullYear() !== nextDate.getFullYear())) {
                    const needYear = nowDate.getFullYear() !== curDate.getFullYear();
                    const isToday = (nowDate.getDate() === curDate.getDate()) && (nowDate.getMonth() === curDate.getMonth()) && (nowDate.getFullYear() === curDate.getFullYear());
                    msg.prependDate = needYear ? curDate.toLocaleDateString() : (isToday ? 'Today' : MONTH_NAMES[curDate.getMonth()] + ' ' + curDate.getDate());
                }
            }
        }

        for (let i = 0; i < data.messages.length; i++) {
            const msg = data.messages[i];

            const div = new Message(msg).container;
            $('#messagesList').prepend(div);

            addListeners(div);

            if (msg.prependDate) {
                $('#messagesList').prepend(htmlToElement(`<div class="msg-container msg-center"><div class="msg-separator">${msg.prependDate}</div></div>`));
            }
        }

        $('#messagesList').scrollTo(0, scrollToBottom ? $('#messagesList').scrollHeight : ($('#messagesList').scrollHeight - scrollHeight));
    }

    scrollToBottom() {
        $('#messagesList').scrollTo(0, $('#messagesList').scrollHeight);
    }
}