import EventManager from './event-manager.js';
export default class Collapse {
    constructor() {
        Collapse.init();
    }
    static init() {
        EventManager.addEventToDocument('click', Collapse.onClick);
    }
    static onClick(event) {
        if (!(event instanceof MouseEvent))
            return;
        const target = event.target;
        if (!target)
            return;
        const button = target.closest('[data-js="collapse"][data-target]');
        if (!button)
            return;
        Collapse.handleToggle(button);
    }
    static handleToggle(button) {
        const selector = button.getAttribute('data-target');
        if (!selector)
            return;
        const collapse = document.querySelector(selector);
        if (!collapse)
            return;
        Collapse.toggle(collapse, button);
    }
    static toggle(collapse, button) {
        if (Collapse.isAnimating(collapse))
            return;
        const accordion = collapse.closest('.accordion');
        if (accordion) {
            Collapse.handleTypeAccordion(accordion, collapse);
        }
        const isOpen = collapse.classList.contains('show');
        isOpen ? Collapse.close(collapse, button) : Collapse.open(collapse, button);
    }
    static handleTypeAccordion(accordion, collapse) {
        if (!accordion)
            return;
        const type = accordion.getAttribute('data-type');
        if (type !== 'multiple') {
            Collapse.closeAllCollapses(accordion, collapse);
        }
    }
    static closeAllCollapses(accordion, except) {
        const collapses = accordion.querySelectorAll('.accordion-body.show');
        collapses.forEach((panel) => {
            if (panel === except)
                return;
            const button = Collapse.getButton(accordion, panel);
            if (!button)
                return;
            Collapse.close(panel, button);
        });
    }
    static isAnimating(collapse) {
        return collapse.dataset.animating === 'true';
    }
    static open(collapse, button) {
        button.setAttribute('aria-expanded', 'true');
        collapse.dataset.animating = 'true';
        collapse.classList.add('show');
        Collapse.prepareOpenStyles(collapse);
        const height = collapse.scrollHeight;
        collapse.style.height = '0px';
        void collapse.offsetHeight;
        const animation = Collapse.playOpenAnimation(collapse, height);
        animation.onfinish = () => {
            collapse.style.height = 'auto';
            collapse.style.overflow = 'visible';
            Collapse.cleanAnimationStyles(collapse);
        };
        animation.oncancel = () => {
            Collapse.cleanAnimationStyles(collapse);
        };
    }
    static close(collapse, button) {
        collapse.dataset.animating = 'true';
        const height = collapse.scrollHeight;
        Collapse.prepareCloseStyles(collapse, height);
        const animation = Collapse.playCloseAnimation(collapse, height);
        animation.onfinish = () => {
            collapse.style.height = '0px';
            collapse.classList.remove('show');
            button.setAttribute('aria-expanded', 'false');
            Collapse.cleanAnimationStyles(collapse);
        };
        animation.oncancel = () => {
            Collapse.cleanAnimationStyles(collapse);
        };
    }
    static prepareOpenStyles(collapse) {
        collapse.style.overflow = 'hidden';
        collapse.style.height = 'auto';
    }
    static prepareCloseStyles(collapse, height) {
        collapse.style.overflow = 'hidden';
        collapse.style.height = `${height}px`;
    }
    static playOpenAnimation(collapse, height) {
        return collapse.animate([{ height: '0px' }, { height: `${height}px` }], { duration: 300, easing: 'ease' });
    }
    static playCloseAnimation(collapse, height) {
        return collapse.animate([{ height: `${height}px` }, { height: '0px' }], { duration: 300, easing: 'ease' });
    }
    static cleanAnimationStyles(collapse) {
        const propsToClean = ['height', 'overflow'];
        propsToClean.forEach(prop => collapse.style.removeProperty(prop));
        if (collapse.style.length === 0) {
            collapse.removeAttribute('style');
        }
        delete collapse.dataset.animating;
    }
    static getButton(accordion, panel) {
        const id = panel.id;
        if (!id)
            return null;
        return accordion.querySelector(`[data-js="collapse"][data-target="#${id}"]`);
    }
}
