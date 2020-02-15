class MessageTextFormat {

    static format(message, entities) {
        const container = document.createElement('span');

        if (!entities || entities.length === 0) {
            container.innerText = message;
            return container;
        }

        const arr = [];
        let offset = 0;

        entities.forEach(e => {
            arr.push({offset: offset, length: e.offset - offset, _: ''});
            arr.push(e);
            offset = e.offset + e.length;
        });
        arr.push({offset: offset, length: message.length - offset, _: ''});

        arr.forEach(e => {
            if (e.length > 0) {
                const s = message.substr(e.offset, e.length);
                switch (e._) {
                    case 'messageEntityUrl':
                        const a = document.createElement('a');
                        a.href = getHref(s);
                        a.innerText = s;
                        a.target = '_blank';
                        container.appendChild(a);
                        break;
                    case 'messageEntityBold':
                        container.appendChild(createElement('b', null, s));
                        break;
                    case 'messageEntityItalic':
                        container.appendChild(createElement('i', null, s));
                        break;
                    case 'messageEntityCode':
                        container.appendChild(createElement('code', null, s));
                        break;
                    case '':
                    case 'messageEntityPre':
                    case 'messageEntityUnknown':
                    case 'messageEntityMention':
                    case 'messageEntityHashtag':
                    case 'messageEntityBotCommand':
                    case 'messageEntityEmail':
                    case 'messageEntityTextUrl':
                    case 'messageEntityMentionName':
                    case 'inputMessageEntityMentionName':
                    case 'messageEntityPhone':
                    case 'messageEntityCashtag':
                    case 'messageEntityUnderline':
                    case 'messageEntityStrike':
                    case 'messageEntityBlockquote':
                        container.appendChild(createElement('span', null, s));
                        break;
                }
            }
        });

        return container;
    }

}