class MessageContent {

    static findAttr(attrs, name) {
        for (let a of attrs) {
            if (a._ === name) return a;
        }
        return null;
    };

    constructor(data) {
        const getMessage = id => {
            return telegram.api.getHistory(telegram.currentPeer.id, telegram.currentPeer._, telegram.currentPeer.access_hash, id + 1, 1);
        };

        const isGroup = data.peerType !== 'user';

        const container = createElement('div', 'msg');
        this.container = container;
        this.cornerContainer = container;
        this.isCornerWhite = false;

        if (data.reply_to_msg_id) {
            container.classList.add('msg-reply');
            const replyContainer = createElement('div', 'reply');
            replyContainer.classList.add('lined');
            const replyName = createElement('div', 'reply-name', 'Loading..');
            replyContainer.appendChild(replyName);
            const replyText = createElement('div', 'reply-text', 'Loading..');
            replyContainer.appendChild(replyText);
            container.appendChild(replyContainer);

            getMessage(data.reply_to_msg_id).then(replyData => {
                replyName.innerText = formatName(replyData.users[0]);
                replyText.innerText = replyData.messages[0].message;
            });

        } else if (data.fwd_from) {

            const user = telegram.state.users[data.fwd_from.user_id];
            const name = user ? formatName(user) : '';

            container.classList.add('msg-forward');
            container.appendChild(createElement('div', 'forwarded-title', 'Forwarded message'));

            const forwardContainer = createElement('div', 'forward');
            forwardContainer.classList.add('lined');
            const forwardName = createElement('div', 'forward-name', name);
            forwardContainer.appendChild(forwardName);
            const forwardText = createElement('span', 'forward-text', data.message);
            forwardContainer.appendChild(forwardText);
            container.appendChild(forwardContainer);
            this.cornerContainer = forwardContainer;

        } else if (data.media) {

            switch (data.media._) {
                case 'messageMediaPhoto':
                    container.classList.add('msg-img');
                    const size = data.media.photo.sizes[2];
                    const maxWidth = 360;
                    const mul = maxWidth / size.w;
                    container.style.height = (size.h * mul) + 'px';
                    telegram.fileManager.getFile(size.location)
                        .then(url => setBg(container, url))
                        .catch(e => console.error(e));
                    this.isCornerWhite = true;
                    break;

                case 'messageMediaContact':
                    container.classList.add('msg-file');

                    const contactIcon = createElement('div', 'contact-icon');
                    container.appendChild(contactIcon);
                    const contactUser = telegram.state.users[data.media.user_id];
                    if (contactUser && contactUser.photo && contactUser.photo.photo_small) {
                        telegram.fileManager.getFile(contactUser.photo.photo_small).then(url => {
                            setBg(contactIcon, url);
                        }).catch(e => console.error(e));
                    }

                    const contactInfo = createElement('div', 'contact-info');
                    container.appendChild(contactInfo);
                    const contactNameDiv = createElement('div', 'contact-name', formatName(data.media));
                    contactInfo.appendChild(contactNameDiv);
                    const filePhoneDiv = createElement('span', 'contact-phone', '+' + data.media.phone_number);
                    contactInfo.appendChild(filePhoneDiv);

                    this.cornerContainer = contactInfo;
                    break;

                case 'messageMediaDocument':
                    let downloadIcon = null;
                    this.documentData = null;
                    this.mimeType = data.media.document.mime_type;

                    const videoAttr = MessageContent.findAttr(data.media.document.attributes, 'documentAttributeVideo');
                    if (videoAttr) {
                        container.classList.add('msg-video');
                        const maxWidth = 360;
                        const mul = maxWidth / videoAttr.w;
                        container.style.height = (videoAttr.h * mul) + 'px';

                        if (data.media.document.thumb) {
                            telegram.fileManager.getFile(data.media.document.thumb.location)
                                .then(url => setBg(container, url))
                                .catch(e => console.error(e));
                        }

                        downloadIcon = createElement('div', 'download');
                        container.appendChild(downloadIcon);
                        this.isCornerWhite = true;

                    } else {
                        container.classList.add('msg-file');
                        let name = '';
                        if (data.media.document.attributes) {
                            const attr = MessageContent.findAttr(data.media.document.attributes, 'documentAttributeFilename');
                            if (attr) {
                                name = attr.file_name;
                            }
                        }

                        const fileIcon = createElement('div', 'file-icon');
                        container.appendChild(fileIcon);
                        downloadIcon = createElement('div', 'download');
                        fileIcon.appendChild(downloadIcon);

                        const fileInfo = createElement('div', 'file-info');
                        container.appendChild(fileInfo);
                        const fileNameDiv = createElement('div', 'file-name', name);
                        fileInfo.appendChild(fileNameDiv);
                        const fileSizeDiv = createElement('span', 'file-size', formatSize(data.media.document.size));
                        fileInfo.appendChild(fileSizeDiv);

                        this.cornerContainer = fileInfo;
                    }

                    container.addEventListener('click', () => {
                        downloadIcon.classList.add('process');
                        if (data.media.document.size > 1024 * 1024) {
                            alert('Sorry, files smaller than megabyte are now supported');
                        }
                        telegram.api.getDocumentFile(data.media.document).then(res => {
                            try {
                                this.documentData = res.bytes;
                                const url = bytesToUrl(res.bytes, this.mimeType);
                                downloadURI(url, 'name');
                                downloadIcon.classList.remove('process');
                                downloadIcon.classList.add('done');
                                console.log('RES', res);
                            } catch (e) {
                                console.error(e);
                            }
                        })
                    });

                    break;

                case 'messageMediaWebPage':
                    container.classList.add('msg-webpage');

                    const webpageDiv = createElement('div', 'webpage');
                    container.appendChild(webpageDiv);
                    if (data.media.webpage.photo) {
                        const webpageImg = createElement('div', 'webpage-img');
                        webpageDiv.appendChild(webpageImg);
                        telegram.fileManager.getFile(data.media.webpage.photo.sizes[2].location)
                            .then(url => setBg(webpageImg, url))
                            .catch(e => console.error(e));
                    }
                    if (data.media.webpage.site_name) {
                        const webpageSite = createElement('div', 'webpage-site', data.media.webpage.site_name);
                        webpageDiv.appendChild(webpageSite);
                    }
                    if (data.media.webpage.title) {
                        const webpageTitle = createElement('div', 'webpage-title', data.media.webpage.title);
                        webpageDiv.appendChild(webpageTitle);
                    }
                    if (data.media.webpage.description) {
                        const webpageText = createElement('span', 'webpage-text', data.media.webpage.description);
                        webpageDiv.appendChild(webpageText);
                    }

                    this.cornerContainer = webpageDiv;
                    break;

                case 'messageMediaUnsupported':
                default:
                    container.appendChild(createElement('span', null, 'Unsupported message'));
            }
        }

        // sender name & avatar

        if (isGroup && !data.isMy) {
            const user = telegram.state.users[data.from_id];
            if (user) {
                const needSenderName = !(data.media && data.media._ === 'messageMediaPhoto');

                if (needSenderName) {
                    container.prepend(createElement('div', 'msg-name', formatName(user)));
                }

                const avatar = createElement('div', 'msg-avatar');
                if (user.photo && user.photo.photo_small) {
                    telegram.fileManager.getFile(user.photo.photo_small).then(url => {
                        setBg(avatar, url);
                    }).catch(e => console.error(e));
                }
                container.append(avatar);
            }
        }

        // message

        const needMessage = data.message && !data.fwd_from;

        if (needMessage) {
            const text = MessageTextFormat.format(data.message, data.entities);
            const needPrependMessage = data.media && data.media._ === 'messageMediaWebPage';
            if (needPrependMessage) {
                container.prepend(text);
            } else {
                container.appendChild(text);
            }
        }
    }
}