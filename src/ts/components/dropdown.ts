export default class Dropdown {

    constructor() {
        this.init();
    }

    private init(): void {
        const buttons = document.querySelectorAll('[data-js="dropdown"]') as NodeListOf<HTMLElement>;
        if (!buttons.length) return;

        buttons.forEach((button: HTMLElement) => {
            const target = button.getAttribute('data-target') as string;
            if (!target) return;
            const content = document.querySelector(target) as HTMLElement | null;
            if (!content) return;

            Dropdown.actionEvent(button, content);
        });
    }

    static actionEvent(button: HTMLElement, content: HTMLElement): void {
        button.addEventListener('click', (event: MouseEvent) => {
            event.stopPropagation();

            Dropdown.closeAllDropdownsOverlay(content);
            
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
            element.style.overflow = "visible";
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