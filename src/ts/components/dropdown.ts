export default class Dropdown {

    constructor() {
        Dropdown.init();
    }

    // Initialize all dropdown trigger buttons
    private static init(): void {
        const buttons = document.querySelectorAll('[data-js="dropdown"]') as NodeListOf<HTMLElement>;
        if (!buttons.length) return;
        buttons.forEach((button: HTMLElement) => {
            const target = button.getAttribute('data-target') as string;
            if (!target) return;
            const dropdown = document.querySelector(target) as HTMLElement | null;
            if (!dropdown) return;
            Dropdown.bindToggle(button, dropdown);
        });
    }

    // Bind click to toggle the target dropdown
    private static bindToggle(button: HTMLElement, dropdown: HTMLElement): void {
        button.addEventListener('click', (event: MouseEvent) => {
            event.stopPropagation();
            Dropdown.closeAllDropdownsOverlay(dropdown);
            const isOpen = dropdown.classList.contains('show');
            if (isOpen) {
                Dropdown.close(dropdown);
                dropdown.classList.remove('show');
            } else {
                Dropdown.open(dropdown);
                dropdown.classList.add('show');
            }
        });
    }

    // Open dropdown with animated expand
    private static open(dropdown: HTMLElement): void {
        Dropdown.emit(dropdown, 'dropdown:beforeOpen');
        const height = dropdown.scrollHeight as number;
        Dropdown.prepareOpenStyles(dropdown);
        Dropdown.playOpenAnimation(dropdown, height);
        Dropdown.emit(dropdown, 'dropdown:afterOpen');
    }

    // Close dropdown with animated collapse
    private static close(dropdown: HTMLElement): void {
        Dropdown.emit(dropdown, 'dropdown:beforeClose');
        const height = dropdown.scrollHeight as number;
        Dropdown.prepareCloseStyles(dropdown, height);
        Dropdown.playCloseAnimation(dropdown, height);
        Dropdown.emit(dropdown, 'dropdown:afterClose');
    }

    // Emit a custom dropdown event with the element in detail
    private static emit(target: HTMLElement, name: string): void {
        target.dispatchEvent(new CustomEvent(name, {detail: {element: target}, bubbles: true}));
    }

    // Set initial styles before opening animation
    private static prepareOpenStyles(dropdown: HTMLElement): void {
        dropdown.style.overflow = 'hidden';
        dropdown.style.height = '0px';
    }

    // Set initial styles before closing animation
    private static prepareCloseStyles(dropdown: HTMLElement, height: number): void {
        dropdown.style.overflow = 'hidden';
        dropdown.style.height = `${height}px`;
    }

    // Play the opening height animation and finalize styles on finish
    private static playOpenAnimation(dropdown: HTMLElement, height: number): void {
        const animation = dropdown.animate([{height: '0px'}, {height: `${height}px`}], {duration: 300, easing: 'ease'});
        animation.onfinish = () => {
            dropdown.style.height = 'auto';
            dropdown.style.overflow = 'visible';
        };
    }

    // Play the closing height animation and finalize styles on finish
    private static playCloseAnimation(dropdown: HTMLElement, height: number): void {
        const animation = dropdown.animate([{height: `${height}px`}, {height: '0px'}], {duration: 300, easing: 'ease'});
        animation.onfinish = () => {
            dropdown.style.height = '0px';
        };
    }

    // Close all overlays except the one provided
    private static closeAllDropdownsOverlay(except?: HTMLElement): void {
        const dropdownsOverlay = document.querySelectorAll<HTMLElement>([
            '.dropdown-overlay.show',
            '.dropdown-overlay-right.show',
            '.dropdown-overlay-left.show'
        ].join(','));
        if (!dropdownsOverlay.length) return;
        dropdownsOverlay.forEach((dropdown) => {
            if (dropdown === except) return;
            Dropdown.close(dropdown);
            dropdown.classList.remove('show');
        });
    }
}
