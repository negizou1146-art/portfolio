document.addEventListener('DOMContentLoaded', () => {

    // ナビ固定
    (() => {
        const nav = document.querySelector('.center-nav');
        if (!nav) return;

        window.addEventListener('scroll', () => {
            nav.classList.toggle('is-fixed-top', window.scrollY > 50);
        });
    })();

    // page_top
    (() => {
        const pageTop = document.querySelector('.page_top');
        if (!pageTop) return;

        window.addEventListener('scroll', () => {
            pageTop.classList.toggle('is-up', window.scrollY > 100);
        });
    })();

});