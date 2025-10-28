export default class Dropdown {

    constructor() {
        this.init();
    }

    private init(): void {
        const buttons = document.querySelectorAll('[data-js="dropdown"]') as NodeListOf<HTMLElement>;
        if (!buttons.length) return;

        buttons.forEach((button: HTMLElement) => {
            const dropdown = button.closest('.dropdown') as HTMLElement | null;
            if (!dropdown) return;

            const content = dropdown.querySelector('.dropdown-content') as HTMLElement | null;
            if (!content) return;

            this.actionEvent(button, dropdown, content);
        });
    }

    private actionEvent(button: HTMLElement, dropdown: HTMLElement, content: HTMLElement): void {
        button.addEventListener('click', (event: MouseEvent) => {
            event.stopPropagation();

            const isOpen =  content.classList.contains('show');
            button.dispatchEvent(new Event('dropdown:beforeToggle'));

            if (isOpen) {
                Dropdown.slideUp(content);
                content.classList.remove('show');
            } else {
                Dropdown.slideDown(content);
                content.classList.add('show');
            }

            button.dispatchEvent(new Event('dropdown:afterToggle'));
        });
    }

    private static slideDown(element: HTMLElement): void {
        const height = element.scrollHeight as number;

        element.style.overflow = "hidden";
        element.style.height = "0px";

        const animation = element.animate(
            [{height: "0px"}, {height: `${height}px`}],
            {duration: 300, easing: "ease"}
        );

        animation.onfinish = (): void => {
            element.style.height = "auto";
        };
    }

    private static slideUp(element: HTMLElement): void {
        const height = element.scrollHeight as number;

        element.style.overflow = "hidden";
        element.style.height = `${height}px`;

        const animation = element.animate(
            [{height: `${height}px`}, {height: "0px"}],
            {duration: 300, easing: "ease"}
        );

        animation.onfinish = (): void => {
            element.style.height = "0px";
        };
    }
}