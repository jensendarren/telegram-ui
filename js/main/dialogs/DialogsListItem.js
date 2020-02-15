class DialogsListItem extends MaterialButton {
    constructor(item) {
        let id = 0;
        let type = '';
        let name = '';
        let isOnline = false;
        let isVerified = false;
        let photo = null;

        if (item.peer._ === 'peerUser') {
            const user = telegram.state.users[item.peer.user_id];
            id = user.id;
            name = item.isMy ? 'Saved Messages' : formatName(user);
            isOnline = user.status && (user.status._ === 'userStatusOnline');
            isVerified = user.verified;
            photo = user.photo;
            type = 'user';
        } else if (item.peer._ === 'peerChannel') {
            const chat = telegram.state.chats[item.peer.channel_id];
            id = chat.id;
            name = chat.title;
            isVerified = chat.verified;
            photo = chat.photo;
            type = 'channel';
        } else if (item.peer._ === 'peerChat') {
            const chat = telegram.state.chats[item.peer.chat_id];
            id = chat.id;
            name = chat.title;
            isVerified = chat.verified;
            photo = chat.photo;
            type = 'chat';
        }

        const msg = telegram.state.messages[item.top_message];
        const date = msg ? createDate(msg.date) : null;
        const dateText = msg ? (isToday(date) ? formatTime(date) : formatDate(date)) : '';
        const muted = item.notify_settings.mute_until * 1000 >= new Date().getTime();
        const unreaded = item.unread_count ? `<div class="dialogsList-item-unreaded ${muted ? 'grey' : ''}">` + item.unread_count + '</div>' : '';

        let messageText = msg ? (msg.message || 'Media') : '';
        if ((item.peer._ === 'peerChannel') && msg) {
            const user = telegram.state.users[msg.from_id];
            if (user) {
                messageText = '<span style="color: #000">' + (user.self ? 'You' : user.first_name) + ': </span>' + messageText;
            }
        }
        const checksCount = getChecksCount(msg, item);
        const checkIcon = getChecksIcon(checksCount, false);

        const div = htmlToElement(`<div class="dialogsList-item" data-id="${id}" data-type="${type}">
                <div class="dialogsList-item-avatar">
                    ${isOnline ? '<div class="dialogsList-item-online"></div>' : ''}
                </div>
                <div class="dialogsList-item-head">
                    <div class="dialogsList-item-title">${name}${isVerified ? verified_icon : ''}${muted ? muted_icon : ''}</div>
                    <div class="dialogsList-item-right">
                        <div class="dialogsList-item-time">${dateText}</div>
                        ${checkIcon}
                    </div>          
                </div>      
                
                <div class="dialogsList-item-body">
                    <div class="dialogsList-item-text">${messageText}</div>
                    ${unreaded}
                </div>
            </div>`);

        if (photo && photo.photo_small) {
            telegram.fileManager.getFile(photo.photo_small).then(url => {
                setBg(div.querySelector('.dialogsList-item-avatar'), url);
            }).catch(e => console.error(e));
        }

        super(div);

        this.container = div;
    }
}