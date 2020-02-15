class DialogsList {
    constructor() {
        this.selectedItem = null;
        this.onDialogSelect = null;
        this.onScrollBottom = null;
    }

    init() {
        $('#dialogsList').addEventListener('scroll', e => {
            if ($('#dialogsList').scrollTop === $('#dialogsList').scrollHeight - $('#dialogsList').offsetHeight) {
                this.onScrollBottom();
            }
        });
    }

    appendData(data) {
        toggle($('#leftSidebarHeader'), true, 'flex');
        toggle($('#leftLoading'), false);

        this.selectedItem = null;

        const scrollTop = $('#dialogsList').scrollTop;

        for (let i in data) {
            const div = new DialogsListItem(data[i]).container;
            div.addEventListener('click', e => this.select(e.currentTarget));
            $('#dialogsList').appendChild(div);
        }

        $('#dialogsList').scrollTo(0, scrollTop);
    }

    select(div) {
        this.onDialogSelect(Number(div.getAttribute('data-id')), div.getAttribute('data-type'));

        if (this.selectedItem) {
            this.selectedItem.classList.remove('selected');
        }
        this.selectedItem = div;
        if (this.selectedItem) {
            this.selectedItem.classList.add('selected');
        }
    }
}