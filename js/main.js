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

            // ここが肝：半分まで行ったら裏で戻す
            if (Math.abs(x) >= singleWidth) {
                x = 0;
            }

            track.style.transform = `translateX(${x}px)`;
            requestAnimationFrame(infiniteScroll);
        }

    // hover 停止
    loop.addEventListener('mouseenter', () => speed = 0);
    loop.addEventListener('mouseleave', () => speed = 0.5);

    infiniteScroll();

    // サムネクリックでスクロール
    document.querySelectorAll('.thumb-track img').forEach(thumb => {
        thumb.addEventListener('click', () => {
            speed = 0;
            clearTimeout(resumeTimer);

            const target = document.getElementById(thumb.dataset.target);
            if (!target) return;

            target.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'start'
            });

            resumeTimer = setTimeout(() => {
                speed = 0.5;
            }, 3000);
        });
    });

});

