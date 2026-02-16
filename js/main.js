document.addEventListener('DOMContentLoaded', () => {

    // ナビ固定
    (() => {
        const nav = document.querySelector('.center-nav');
        if (!nav) return;

        window.addEventListener('scroll', () => {
            nav.classList.toggle('is-fixed-top', window.scrollY > 50);
        });
    })();

    // page_top 表示制御
    (() => {
        const pageTop = document.querySelector('.page_top');
        if (!pageTop) return;

        window.addEventListener('scroll', () => {
            pageTop.classList.toggle('is-up', window.scrollY > 100);
        });
    })();

    // 無限サムネスクロール
    const loop  = document.querySelector('.thumb-loop');
    const track = document.querySelector('.thumb-track');
    if (!loop || !track) return;

        let speed = 0.5;
        let x = 0;
        let singleWidth = 0;
        let resumeTimer = null;

        window.addEventListener('load', () => {
            singleWidth = track.scrollWidth / 2;
        });

        function infiniteScroll() {
            x -= speed;

            if (Math.abs(x) >= singleWidth) {
                x = 0;
            }

            track.style.transform = `translateX(${x}px)`;
            requestAnimationFrame(infiniteScroll);
        }

        loop.addEventListener('mouseenter', () => speed = 0);
        loop.addEventListener('mouseleave', () => speed = 0.5);

        infiniteScroll();

    // サムネ強調処理
    const setActiveById = (id) => {
        document.querySelectorAll('.thumb-track img').forEach(img => img.classList.remove('active'));
        document.querySelectorAll(`.thumb-track img[data-target="${id}"]`).forEach(img => img.classList.add('active'));
    };

    // work-area2内のコンテンツをID順で管理
    const workArea2 = document.querySelector('.work-area2');
    const workItems = Array.from(workArea2.children); // .w-wrap 要素
        let currentIndex = 0;

    // サムネクリック処理
    document.querySelectorAll('.thumb-track img').forEach(thumb => {
        thumb.addEventListener('click', () => {
            speed = 0;
            clearTimeout(resumeTimer);

            const id = thumb.dataset.target;

            // currentIndex をクリックしたIDに合わせる
            const index = workItems.findIndex(w => w.id === id);
            if (index >= 0) currentIndex = index;

            setActiveById(id);

            const target = document.getElementById(id);
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });

            resumeTimer = setTimeout(() => { speed = 0.5; }, 3000);
        });
    });

    // 左右ボタン処理
    const btnLeft = document.querySelector('.scroll-left');
    const btnRight = document.querySelector('.scroll-right');

        btnLeft.addEventListener('click', () => {
            if (currentIndex > 0) currentIndex--;
            const id = workItems[currentIndex].id;

            setActiveById(id);

            const target = document.getElementById(id);
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
        });

        btnRight.addEventListener('click', () => {
            if (currentIndex < workItems.length - 1) currentIndex++;
            const id = workItems[currentIndex].id;

            setActiveById(id);

            const target = document.getElementById(id);
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
        });

    // 画像モーダル
    const modal = document.getElementById('img-modal');
    const modalImg = document.getElementById('modal-img');
    const closeBtn = document.querySelector('.img-modal .close');

        // work-area2 内の画像だけモーダルを開く
        document.querySelectorAll('.work-area2 img').forEach(img => {
            img.addEventListener('click', () => {
                modal.style.display = 'flex';

                // 大画像があればそれ、なければ通常
                modalImg.src = img.dataset.large || img.src;

                // 今開いた画像のindexを合わせる
                const wrap = img.closest('.w-wrap');
                if (!wrap) return;

                const index = workItems.findIndex(w => w.id === wrap.id);
                if (index >= 0) currentIndex = index;

                setActiveById(wrap.id);
            });
        });

        // 背景クリックで閉じる
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });

        // キーボード操作
        document.addEventListener('keydown', (e) => {

            // モーダルが開いていなければ何もしない
            if (modal.style.display !== 'flex') return;

            // Escで閉じる
            if (e.key === 'Escape') {
                e.preventDefault();
                modal.style.display = 'none';
                return;
            }

            // → 次へ
            if (e.key === 'ArrowRight') {
                e.preventDefault();

                if (currentIndex < workItems.length - 1) currentIndex++;

                const id = workItems[currentIndex].id;
                setActiveById(id);

                const targetImg = document.querySelector(`#${id} img`);
                if (targetImg) modalImg.src = targetImg.dataset.large || targetImg.src;
            }

            // ← 前へ
            if (e.key === 'ArrowLeft') {
                e.preventDefault();

                if (currentIndex > 0) currentIndex--;

                const id = workItems[currentIndex].id;
                setActiveById(id);

                const targetImg = document.querySelector(`#${id} img`);
                if (targetImg) modalImg.src = targetImg.dataset.large || targetImg.src;
            }
        });

    // モーダルここまで

});
