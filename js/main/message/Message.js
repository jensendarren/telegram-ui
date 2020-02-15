class Message {
    constructor(data) {
        const container = createElement('div', 'msg-container');
        container.setAttribute('data-id', data.id);
        container.classList.add(data.isMy ? 'msg-right' : 'msg-left');
        this.container = container;

        const content = new MessageContent(data);
        container.appendChild(content.container);

        const isChannel = (telegram.currentPeer._ === 'channel') && (!telegram.currentPeer.megagroup);
        if (isChannel) {
            content.container.style.maxWidth = '698px';
        } else {
            if (data.isStick) content.container.classList.add('msg-stick');
        }

        const corner = createElement('div', 'msg-corner');
        this.statusContainer = createElement('div', 'msg-status');
        corner.appendChild(this.statusContainer);
        corner.appendChild(createElement('div', 'msg-date', formatTime(createDate(data.date))));
        if (isChannel) {
            corner.appendChild(htmlToElement('<span class="msg-views">' + data.views + ' views</span>'));
        }
        content.cornerContainer.appendChild(corner);

        this.statusContainer.innerHTML = getChecksIcon(data.checksCount, content.isCornerWhite);
    }
}