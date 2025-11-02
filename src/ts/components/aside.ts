export default class Aside {
    constructor() {
        Aside.init();
    }

    private static init(): void {
        const buttons = document.querySelectorAll('[data-js="aside"]') as NodeListOf<HTMLElement>;
        if (!buttons.length) return;

        buttons.forEach((button: HTMLElement) => {
            const target = button.getAttribute('data-target') as string;
            if (!target) return;
            const aside = document.querySelector(target) as HTMLElement | null;
            if (!aside) return;
            Aside.actionEvent(button, aside);
        });
    }


    private static actionEvent(button: HTMLElement, aside: HTMLElement): void {
        const isOpen = () => aside.classList.contains('show');

        button.addEventListener('click', () => {
            if (isOpen()) return;

            button.dispatchEvent(new CustomEvent('aside:beforeOpen', {
                detail: {element: aside},
                bubbles: true,
            }));

            Aside.show(aside);

            button.dispatchEvent(new CustomEvent('aside:afterOpen', {
                detail: {element: aside},
                bubbles: true,
            }));
        });

        const buttonsClose = aside.querySelectorAll<HTMLElement>('.close');
        buttonsClose.forEach((buttonClose) => {
            buttonClose.addEventListener('click', () => {
                if (!isOpen()) return;

                buttonClose.dispatchEvent(new CustomEvent('aside:beforeClose', {
                    detail: {element: aside},
                    bubbles: true,
                }))

                Aside.hide(aside);

                buttonClose.dispatchEvent(new CustomEvent('aside:afterClose', {
                    detail: {element: aside},
                    bubbles: true,
                }))
            });
        });
    }


    private static show(aside: HTMLElement): void {
        aside.classList.add('show');
    }


    private static hide(aside: HTMLElement): void {
        aside.classList.remove('show');
    }

}