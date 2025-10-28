export default class Dropdown {
    constructor() {
        this.init();
    }
    init() {
        const buttons = document.querySelectorAll('[data-js="dropdown"]');
        if (!buttons.length)
            return;
        buttons.forEach((button) => {
            const target = button.getAttribute('data-target');
            if (!target)
                return;
            const content = document.querySelector(target);
            if (!content)
                return;
            this.actionEvent(button, content);
        });
    }
    actionEvent(button, content) {
        button.addEventListener('click', (event) => {
            event.stopPropagation();
            const isOpen = content.classList.contains('show');
            button.dispatchEvent(new Event('dropdown:beforeToggle'));
            if (isOpen) {
                Dropdown.slideUp(content);
                content.classList.remove('show');
            }
            else {
                Dropdown.slideDown(content);
                content.classList.add('show');
            }
            button.dispatchEvent(new Event('dropdown:afterToggle'));
        });
    }
    static slideDown(element) {
        const height = element.scrollHeight;
        element.style.overflow = "hidden";
        element.style.height = "0px";
        const animation = element.animate([{ height: "0px" }, { height: `${height}px` }], { duration: 300, easing: "ease" });
        animation.onfinish = () => {
            element.style.height = "auto";
        };
    }
    static slideUp(element) {
        const height = element.scrollHeight;
        element.style.overflow = "hidden";
        element.style.height = `${height}px`;
        const animation = element.animate([{ height: `${height}px` }, { height: "0px" }], { duration: 300, easing: "ease" });
        animation.onfinish = () => {
            element.style.height = "0px";
        };
    }
}
