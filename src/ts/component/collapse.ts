import EventManager from './event-manager.js';

export default class Collapse {

    constructor() {
        Collapse.init();
    }

    private static init(): void {
        EventManager.addEventToDocument('click', Collapse.onClick);
    }

    private static onClick(event: Event): void {
        if (!(event instanceof MouseEvent)) return;

        const target = event.target as HTMLElement | null;
        if (!target) return;

        const button = target.closest<HTMLElement>('[data-js="collapse"][data-target]');
        if (!button) return;

        Collapse.handleToggle(button);
    }

    private static handleToggle(button: HTMLElement): void {
        const selector = button.getAttribute('data-target');
        if (!selector) return;

        const collapse = document.querySelector<HTMLElement>(selector);
        if (!collapse) return;

        Collapse.toggle(collapse, button);
    }


    private static toggle(collapse: HTMLElement, button: HTMLElement): void {
        if (Collapse.isAnimating(collapse)) return;

        const accordion = collapse.closest<HTMLElement>('.accordion');

        if (accordion) {
            Collapse.handleTypeAccordion(accordion, collapse, button);
        }

        const isOpen = collapse.classList.contains('show');
        isOpen ? Collapse.close(collapse, button) : Collapse.open(collapse, button);
    }

    private static handleTypeAccordion(accordion: HTMLElement | null, collapse: HTMLElement, button: HTMLElement): void {
        if (!accordion) return;

        const type = accordion.getAttribute('data-type');

        if (type !== 'multiple') {
            Collapse.closeAllCollapses(accordion, collapse, button);
        }
    }

    private static closeAllCollapses(accordion: HTMLElement, except: HTMLElement, button: HTMLElement): void {
        const collapses = accordion.querySelectorAll<HTMLElement>('.accordion-body.show');

        collapses.forEach((panel) => {
            if (panel === except) return;
            Collapse.close(panel, button);
        });
    }


    private static isAnimating(collapse: HTMLElement): boolean {
        return collapse.dataset.animating === 'true';
    }


    private static open(collapse: HTMLElement, button: HTMLElement): void {
        button.setAttribute('aria-expanded', 'true');

        collapse.dataset.animating = 'true';
        collapse.classList.add('show');

        Collapse.prepareOpenStyles(collapse);

        const height = collapse.scrollHeight;
        collapse.style.height = '0px';

        const animation = Collapse.playOpenAnimation(collapse, height);
        animation.onfinish = () => {
            collapse.style.height = 'auto';
            collapse.style.overflow = 'visible';
            delete collapse.dataset.animating;
            Collapse.cleanAnimationStyles(collapse);
        };
    }


    private static close(collapse: HTMLElement, button: HTMLElement): void {
        collapse.dataset.animating = 'true';

        const height = collapse.scrollHeight;
        Collapse.prepareCloseStyles(collapse, height);

        const animation = Collapse.playCloseAnimation(collapse, height);
        animation.onfinish = () => {
            collapse.style.height = '0px';
            collapse.classList.remove('show');
            button.setAttribute('aria-expanded', 'false');
            delete collapse.dataset.animating;
            Collapse.cleanAnimationStyles(collapse);
        };
    }


    private static prepareOpenStyles(collapse: HTMLElement): void {
        collapse.style.overflow = 'hidden';
        collapse.style.height = 'auto';
    }

    private static prepareCloseStyles(collapse: HTMLElement, height: number): void {
        collapse.style.overflow = 'hidden';
        collapse.style.height = `${height}px`;
    }

    private static playOpenAnimation(collapse: HTMLElement, height: number): Animation {
        return collapse.animate(
            [{height: '0px'}, {height: `${height}px`}],
            {duration: 300, easing: 'ease'}
        );
    }

    private static playCloseAnimation(collapse: HTMLElement, height: number): Animation {
        return collapse.animate(
            [{height: `${height}px`}, {height: '0px'}],
            {duration: 300, easing: 'ease'}
        );
    }

    private static cleanAnimationStyles(collapse: HTMLElement): void {
        collapse.style.removeProperty('height');
        collapse.style.removeProperty('overflow');
        delete collapse.dataset.animating;
        if (!collapse.style.cssText.trim()) {
            collapse.removeAttribute('style');
        }
    }

}