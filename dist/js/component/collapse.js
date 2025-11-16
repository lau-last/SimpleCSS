import EventManager from './event_manager.js';
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
        const trigger = target.closest('[data-js="collapse"][data-target]');
        if (!trigger)
            return;
        Collapse.handleToggle(trigger);
    }
    static handleToggle(trigger) {
        const selector = trigger.getAttribute('data-target');
        if (!selector)
            return;
        const collapse = document.querySelector(selector);
        if (!collapse)
            return;
        Collapse.toggle(collapse);
    }
    static toggle(collapse) {
        if (Collapse.isAnimating(collapse))
            return;
        const accordion = collapse.closest('.accordion');
        if (accordion) {
            Collapse.handleTypeAccordion(accordion, collapse);
        }
        const isOpen = collapse.classList.contains('show');
        isOpen ? Collapse.close(collapse) : Collapse.open(collapse);
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
            Collapse.close(panel);
        });
    }
    static isAnimating(collapse) {
        return collapse.dataset.animating === 'true';
    }
    static open(collapse) {
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
    static close(collapse) {
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
        collapse.style.removeProperty('height');
        collapse.style.removeProperty('overflow');
        delete collapse.dataset.animating;
    }
}
