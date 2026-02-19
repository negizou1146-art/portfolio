document.addEventListener('DOMContentLoaded', () => {

    // ナビ固定 + page_top
    const nav = document.querySelector('.center-nav');
    const pageTop = document.querySelector('.page_top');

    window.addEventListener('scroll', () => {
        if (nav) {
            nav.classList.toggle('is-fixed-top', window.scrollY > 50);
        }
        if (pageTop) {
            pageTop.classList.toggle('is-up', window.scrollY > 100);
        }
    });


    // work-area2 基本取得
    const workArea2 = document.querySelector('.work-area2');
    if (!workArea2) return;

    const workItems = Array.from(workArea2.children);
    let currentIndex = 0;


    const setActiveById = (id) => {
        document.querySelectorAll('.thumb-track img')
            .forEach(img => img.classList.remove('active'));

        document.querySelectorAll(`.thumb-track img[data-target="${id}"]`)
            .forEach(img => img.classList.add('active'));
    };

    const moveToCurrent = () => {
        const id = workItems[currentIndex].id;
        setActiveById(id);

        const target = document.getElementById(id);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'start'
            });
        }
    };


    // サムネクリック制御
    document.querySelectorAll('.thumb-track img').forEach(thumb => {
        thumb.addEventListener('click', () => {

            const id = thumb.dataset.target;
            if (!id) return;

            const index = workItems.findIndex(w => w.id === id);
            if (index >= 0) currentIndex = index;

            setActiveById(id);

            const target = document.getElementById(id);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'start'
                });
            }
        });
    });


    // 左右ボタン
    const btnLeft  = document.querySelector('.scroll-left');
    const btnRight = document.querySelector('.scroll-right');

    if (btnLeft) {
        btnLeft.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + workItems.length) % workItems.length;
            moveToCurrent();
        });
    }

    if (btnRight) {
        btnRight.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % workItems.length;
            moveToCurrent();
        });
    }


    // モーダル制御
    const modal = document.getElementById('img-modal');
    const modalImg = document.getElementById('modal-img');
    if (!modal || !modalImg) return;

        const openModal = () => {
            modal.classList.add('is-open');
            document.body.style.overflow = 'hidden';
        };

        const closeModal = () => {
            modal.classList.remove('is-open');
            document.body.style.overflow = '';
        };

    // モーダルクリック制御
    document.querySelectorAll('.work-area2 img').forEach(img => {
        img.addEventListener('click', () => {

            // 大きな画像があればモーダル表示。なければ通常画像。
            openModal();
            modalImg.src = img.dataset.large || img.src;

            const wrap = img.closest('.w-wrap');
            if (!wrap) return;

            const index = workItems.findIndex(w => w.id === wrap.id);
            if (index >= 0) currentIndex = index;

            setActiveById(wrap.id);
        });
    });

    // 背景をクリックでもどる
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // モーダル中のキーボード制御
    document.addEventListener('keydown', (e) => {

        if (!modal.classList.contains('is-open')) return;

        // ESCキーでもどる
        if (e.key === 'Escape') {
            e.preventDefault();
            closeModal();
            return;
        }

        // 右キー
        if (e.key === 'ArrowRight') {
            e.preventDefault();
            currentIndex = (currentIndex + 1) % workItems.length;
            updateModalImage();
        }

        // 左キー
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            currentIndex = (currentIndex - 1 + workItems.length) % workItems.length;
            updateModalImage();
        }
    });


    // SPのスワイプ制御

    let touchStartX = 0;
    let touchEndX = 0;

        modal.addEventListener('touchstart', (e) => {
            if (!modal.classList.contains('is-open')) return;
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        modal.addEventListener('touchend', (e) => {
            if (!modal.classList.contains('is-open')) return;
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });

    function handleSwipe() {
        const swipeDistance = touchEndX - touchStartX;
        const threshold = 50;

        if (swipeDistance < -threshold) {
            currentIndex = (currentIndex + 1) % workItems.length;
            updateModalImage();
        }

        if (swipeDistance > threshold) {
            currentIndex = (currentIndex - 1 + workItems.length) % workItems.length;
            updateModalImage();
        }
    }

    // 画像更新を共通化
    function updateModalImage() {
        const id = workItems[currentIndex].id;
        setActiveById(id);

        const targetImg = document.querySelector(`#${id} img`);
        if (targetImg) {
            modalImg.src = targetImg.dataset.large || targetImg.src;
        }
    }

});
