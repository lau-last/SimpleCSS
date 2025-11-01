export default class Aside {
    constructor() {
        Aside.init();
    }
    static init() {
        const buttons = document.querySelectorAll('[data-js="aside"]');
        if (!buttons.length)
            return;
        buttons.forEach((button) => {
            const target = button.getAttribute('data-target');
            if (!target)
                return;
            const aside = document.querySelector(target);
            if (!aside)
                return;
            Aside.actionEvent(button, aside);
        });
    }
    static actionEvent(button, aside) {
        const isOpen = () => aside.classList.contains('show');
        button.addEventListener('click', () => {
            if (isOpen())
                return;
            button.dispatchEvent(new CustomEvent('aside:beforeOpen', {
                detail: { element: aside },
                bubbles: true,
            }));
            Aside.show(aside);
            button.dispatchEvent(new CustomEvent('aside:afterOpen', {
                detail: { element: aside },
                bubbles: true,
            }));
        });
        const buttonsClose = aside.querySelectorAll('.close');
        buttonsClose.forEach((buttonClose) => {
            buttonClose.addEventListener('click', () => {
                if (!isOpen())
                    return;
                buttonClose.dispatchEvent(new CustomEvent('aside:beforeClose', {
                    detail: { element: aside },
                    bubbles: true,
                }));
                Aside.hide(aside);
                buttonClose.dispatchEvent(new CustomEvent('aside:afterClose', {
                    detail: { element: aside },
                    bubbles: true,
                }));
            });
        });
    }
    static show(aside) {
        aside.classList.add('show');
    }
    static hide(aside) {
        aside.classList.remove('show');
    }
}
