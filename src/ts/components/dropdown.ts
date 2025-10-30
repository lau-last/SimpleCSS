export default class Dropdown {

    constructor() {
        Dropdown.init();
    }

    private static init(): void {
        const buttons = document.querySelectorAll('[data-js="dropdown"]') as NodeListOf<HTMLElement>;
        if (!buttons.length) return;

        buttons.forEach((button: HTMLElement) => {
            const target = button.getAttribute('data-target') as string;
            if (!target) return;
            const dropdown = document.querySelector(target) as HTMLElement | null;
            if (!dropdown) return;

            Dropdown.actionEvent(button, dropdown);
        });
    }

    private static actionEvent(button: HTMLElement, dropdown: HTMLElement): void {
        button.addEventListener('click', (event: MouseEvent) => {
            event.stopPropagation();

            Dropdown.closeAllDropdownsOverlay(dropdown);

            const isOpen = dropdown.classList.contains('show');

            if (isOpen) {
                Dropdown.slideUp(dropdown);
                dropdown.classList.remove('show');
            } else {
                Dropdown.slideDown(dropdown);
                dropdown.classList.add('show');
            }
        });
    }

    private static slideDown(dropdown: HTMLElement): void {
        dropdown.dispatchEvent(new CustomEvent('dropdown:beforeOpen', {
            detail: {element: dropdown},
            bubbles: true,
        }));

        const height = dropdown.scrollHeight as number;

        dropdown.style.overflow = "hidden";
        dropdown.style.height = "0px";

        const animation = dropdown.animate(
            [{height: "0px"}, {height: `${height}px`}],
            {duration: 300, easing: "ease"}
        );

        animation.onfinish = (): void => {
            dropdown.style.height = "auto";
            dropdown.style.overflow = "visible";
        };

        dropdown.dispatchEvent(new CustomEvent('dropdown:afterOpen', {
            detail: {element: dropdown},
            bubbles: true,
        }));
    }

    private static slideUp(dropdown: HTMLElement): void {
        dropdown.dispatchEvent(new CustomEvent('dropdown:beforeClose', {
            detail: {element: dropdown},
            bubbles: true,
        }));

        const height = dropdown.scrollHeight as number;

        dropdown.style.overflow = "hidden";
        dropdown.style.height = `${height}px`;

        const animation = dropdown.animate(
            [{height: `${height}px`}, {height: "0px"}],
            {duration: 300, easing: "ease"}
        );

        animation.onfinish = (): void => {
            dropdown.style.height = "0px";
        };

        dropdown.dispatchEvent(new CustomEvent('dropdown:afterClose', {
            detail: {element: dropdown},
            bubbles: true,
        }));
    }

    private static closeAllDropdownsOverlay(except?: HTMLElement): void {
        const dropdownsOverlay = document.querySelectorAll<HTMLElement>([
            '.dropdown-overlay.show',
            '.dropdown-overlay-right.show',
            '.dropdown-overlay-left.show'
        ].join(','));

        if (!dropdownsOverlay.length) return;

        dropdownsOverlay.forEach((dropdown) => {
            if (dropdown === except) return;
            Dropdown.slideUp(dropdown);
            dropdown.classList.remove('show');
        });
    }
}