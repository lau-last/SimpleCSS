import EventManager from './event-manager';

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

        const trigger = target.closest<HTMLElement>('[data-js="collapse"][data-target]');
        if (!trigger) return;

        Collapse.handleToggle(trigger);
    }

    private static handleToggle(trigger: HTMLElement): void {
        const selector = trigger.getAttribute('data-target');
        if (!selector) return;

        const collapse = document.querySelector<HTMLElement>(selector);
        if (!collapse) return;

        Collapse.toggle(collapse);
    }


    private static toggle(collapse: HTMLElement): void {
        if (Collapse.isAnimating(collapse)) return;

        const accordion = collapse.closest<HTMLElement>('.accordion');

        if (accordion) {
            Collapse.handleTypeAccordion(accordion, collapse);
        }

        const isOpen = collapse.classList.contains('show');
        isOpen ? Collapse.close(collapse) : Collapse.open(collapse);
    }

    private static handleTypeAccordion(accordion: HTMLElement | null, collapse: HTMLElement): void {
        if (!accordion) return;

        const type = accordion.getAttribute('data-type');

        if (type !== 'multiple') {
            Collapse.closeAllCollapses(accordion, collapse);
        }
    }

    private static closeAllCollapses(accordion: HTMLElement, except: HTMLElement): void {
        const collapses = accordion.querySelectorAll<HTMLElement>('.accordion-body.show');

        collapses.forEach((panel) => {
            if (panel === except) return;
            Collapse.close(panel);
        });
    }


    private static isAnimating(collapse: HTMLElement): boolean {
        return collapse.dataset.animating === 'true';
    }


    private static open(collapse: HTMLElement): void {
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


    private static close(collapse: HTMLElement): void {
        collapse.dataset.animating = 'true';

        const height = collapse.scrollHeight;
        Collapse.prepareCloseStyles(collapse, height);

        const animation = Collapse.playCloseAnimation(collapse, height);
        animation.onfinish = () => {
            collapse.style.height = '0px';
            collapse.classList.remove('show');
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
    }

}