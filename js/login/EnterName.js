class EnterName {
    constructor() {
        this.onName = null;
        this.photo = null;
        this.image = null;
        this.croppedImage = null;
    }

    init() {
        const fileInput = $('#enterName_fileInput');

        fileInput.addEventListener('change', e => {
            if (fileInput.files && fileInput.files[0]) {
                this.photo = URL.createObjectURL(fileInput.files[0]);
                const image = new Image();
                image.addEventListener("load", () => {
                    initImg(image.width, image.height);
                });
                image.src = this.photo;
                this.image = image;

                toggle($('#overlay'), true, 'flex');
            }
        });

        $('#enterName_button').addEventListener('click', () => {
            const firstName = $('#enterName_input').value;
            if (firstName == null || firstName === '') {
                $('#enterName_inputContainer').classList.add('error')
            } else {
                $('#enterName_button').classList.add('loading');
                this.onName({
                    firstName: firstName,
                    lastName: $('#enterName_lastNameInput').value,
                    image: this.croppedImage
                })
            }
        });

        $('#editPhoto_closeButton').addEventListener('click', () => {
            toggle($('#overlay'), false);
        });

        $('#editPhoto_okButton').addEventListener('click', () => {
            toggle($('#overlay'), false);
            this.croppedImage = cropImage();
            setBg($('.enter-avatar'), this.croppedImage);
        });

        this.isDown = false;
        this.left = 0;
        this.top = 0;
        this.dx = 0;
        this.dy = 0;
        const size = 360;

        const initImg = (imgWidth, imgHeight) => {
            const min = Math.min(imgWidth, imgHeight);
            this.mul = size / min;
            this.newWidth = imgWidth * this.mul;
            this.newHeight = imgHeight * this.mul;
            const newWidth = this.newWidth + 'px';
            const newHeight = this.newHeight + 'px';
            $('.editPhoto_img').style.width = newWidth;
            $('.editPhoto_img').style.height = newHeight;
            $('.editPhoto_img').style.backgroundSize = newWidth + ' ' + newHeight;

            this.left = (size - this.newWidth) / 2;
            this.top = (size - this.newHeight) / 2;
            $('.editPhoto_img').style.left = this.left + 'px';
            $('.editPhoto_img').style.top = this.top + 'px';

            setBg($('.editPhoto_img'), this.photo);
        };

        const cropImage = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const sx = -this.left / this.mul;
            const sy = -this.top / this.mul;
            const sw = size / this.mul;
            const sh = size / this.mul;
            ctx.drawImage(this.image, sx, sy, sw, sh, 0, 0, 160, 160);
            return canvas.toDataURL();
        };

        initImg();

        $('#editPhotoImg').addEventListener('mousedown', e => {
            this.dx = e.clientX - this.left;
            this.dy = e.clientY - this.top;
            this.isDown = true;
        });
        document.addEventListener('mousemove', e => {
            if (this.isDown) {
                this.left = e.clientX - this.dx;
                if (this.left > 0) this.left = 0;
                if (this.left + this.newWidth < size) this.left = size - this.newWidth;
                this.top = e.clientY - this.dy;
                if (this.top > 0) this.top = 0;
                if (this.top + this.newHeight < size) this.top = size - this.newHeight;
                $('.editPhoto_img').style.left = this.left + 'px';
                $('.editPhoto_img').style.top = this.top + 'px';
            }
        });
        document.addEventListener('mouseup', e => {
            this.isDown = false;
        });
    }
}