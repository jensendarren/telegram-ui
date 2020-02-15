const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function $(name) {
    return document.querySelector(name);
}

function $$(name) {
    return document.querySelectorAll(name);
}

function htmlToElement(html) {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.firstChild;
}

function onInput(input, handler) {
    input.addEventListener('change', handler);
    input.addEventListener('input', handler);
    input.addEventListener('cut', handler);
    input.addEventListener('paste', handler);
}

function toggle(div, visible, display) {
    if (visible === undefined) {
        visible = (div.style.display === 'none');
    }

    div.style.display = visible ? (display || 'block') : 'none';
}

function toggleClass(div, className, visible) {
    if (visible === undefined) {
        visible = !div.classList.contains(className);
    }

    if (visible) {
        div.classList.add(className);
    } else {
        div.classList.remove(className);
    }
}

function createElement(tagName, clazz, innerText) {
    const result = document.createElement(tagName);
    if (clazz) result.classList.add(clazz);
    if (innerText) result.innerText = innerText;
    return result;
}

const muted_icon = '<div class="muted"></div>';
const verified_icon = '<div class="verified"></div>';
const check_icon = '<div class="check"></div>';
const check_icon_white = '<div class="check white"></div>';
const check_one_icon = '<div class="check one"></div>';
const check_one_icon_white = '<div class="check one white"></div>';
const views_icon = '<div class="views"></div>';

function doubleNumber(n) {
    if (n < 10) return '0' + n;
    return n;
}

function isToday(date) {
    const now = new Date();
    return (date.getDate() === now.getDate()) && (date.getMonth() === now.getMonth()) && (date.getFullYear() === now.getFullYear());
}

function createDate(timestamp) {
    return new Date(timestamp * 1000);
}

function formatTime(date) {
    return doubleNumber(date.getHours()) + ':' + doubleNumber(date.getMinutes());
}

function formatDate(date) {
    let s = date.getDate() + '.' + doubleNumber(date.getMonth());
    const now = new Date();
    if (now.getFullYear() !== date.getFullYear()) {
        s += '.' + date.getFullYear();
    }
    return s;
}

function formatName(user) {
    if (!user.last_name) {
        return user.first_name;
    }
    return user.first_name + ' ' + user.last_name;
}

function formatSize(size) {
    if (size < 1024) return size + ' B';
    if (size < 1024 * 1024) return Math.ceil(size / 1024) + ' KB';
    if (size < 1024 * 1024 * 1024) return Math.ceil(size / 1024 / 1024) + ' MB';
    if (size < 1024 * 1024 * 1024 * 1024) return Math.ceil(size / 1024 / 1024 / 1024) + ' GB';
}

function setBg(div, url) {
    div.style.backgroundImage = 'url("' + url + '")';
}

function getHref(url) {
    if (url.startsWith('https://') || url.startsWith('http://')) {
        return url;
    }
    return 'https://' + url;
}

function bytesToUrl(bytes, mimeType) {
    if (!mimeType) mimeType = 'image/jpg';

    return "data:" + mimeType + ";base64," + btoa(
        new Uint8Array(bytes).reduce(function (data, byte) {
            return data + String.fromCharCode(byte);
        }, '')
    );
}

function downloadURI(uri, name) {
    const link = document.createElement("a");
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function getChecksCount(msg, dialog) {
    if (dialog.isMy) {
        return 2;
    }
    if (msg && msg.isMy) {
        if (dialog.read_outbox_max_id >= msg.id) {
            return 2;
        } else {
            return 1;
        }
    }
    return 0;
}

function getChecksIcon(checksCount, isWhite) {
    if (checksCount === 2) {
        return isWhite ? check_icon_white : check_icon;
    } else if (checksCount === 1) {
        return isWhite ? check_one_icon_white : check_one_icon;
    }
    return '';
}