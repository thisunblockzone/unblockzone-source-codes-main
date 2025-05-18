const rotationLock = {

    create: function (rotationLockType) {
        console.log('Create rotation lock called.', rotationLockType);
        this.rotationLockType = rotationLockType;

        if (rotationLockType === 'None' || application.isMobile() === false) {
            console.log('Rotation lock is not needed.');
            return;
        }

        let root = document.createElement('div');

        root.style.background = 'rgb(10, 10, 10, 0.7)';
        root.style.display = 'flex';
        root.style.position = 'fixed';
        root.style.top = '0';
        root.style.left = '0';
        root.style.width = '100%';
        root.style.height = '100%';

        root.style.webkitBackfaceVisibility = 'hidden';
        root.style.webkitPerspective = '1000';
        root.style.webkitTransform = 'translate3d(0,0,0)';
        root.style.webkitTransform = 'translateZ(0)';
        root.style.backfaceVisibility = 'hidden';
        root.style.perspective = '1000';
        root.style.transform = 'translate3d(0,0,0)';
        root.style.transform = 'translateZ(0)';
        root.style.backdropFilter = 'blur(10px)';

        let image = document.createElement('img');

        switch (rotationLockType) {
            case 'PortraitOnly': {
                image.src = 'img/portraitOnly.png';
                break;
            }
            case 'LandscapeOnly': {
                image.src = 'img/landscapeOnly.png';
                break;
            }
        }

        image.style.display = 'flex';
        image.style.width = '100px';
        image.style.height = '100px';
        image.style.margin = 'auto';
        root.appendChild(image);

        document.body.appendChild(root);
        this.root = root;

        window.addEventListener('load', this.onWindowResize.bind(this));
        window.addEventListener('resize', this.onWindowResize.bind(this));

        this.onWindowResize();
    },

    onWindowResize: function () {
        switch (this.rotationLockType) {
            case 'PortraitOnly': {

                if (window.innerHeight > window.innerWidth) {
                    this.root.style.display = 'none';
                }
                else {
                    this.root.style.display = 'flex';
                }

                break;
            }
            case 'LandscapeOnly': {

                if (window.innerHeight < window.innerWidth) {
                    this.root.style.display = 'none';
                }
                else {
                    this.root.style.display = 'flex';
                }

                break;
            }
        }
    },

};