export default class Alert {
    constructor() {
        Alert.init();
    }
    static init() {
        const alerts = document.querySelectorAll('[data-js="alert"]');
        if (!alerts.length)
            return;
        for (const alert of alerts) {
            if (alert.classList.contains('alert-keep')) {
                Alert.closeAlert(alert);
                continue;
            }
            Alert.removeAlertAfterAnimation(alert);
        }
    }
    static removeAlertAfterAnimation(alert) {
        alert.addEventListener('animationend', () => {
            alert.dispatchEvent(new CustomEvent('alert:beforeRemove', {
                detail: { element: alert },
                bubbles: true,
            }));
            alert.remove();
            document.body.dispatchEvent(new CustomEvent('alert:afterRemove', {
                detail: { element: alert },
                bubbles: true,
            }));
        });
    }
    static closeAlert(alert) {
        const buttonClose = alert.querySelectorAll('.close');
        if (!buttonClose.length)
            return;
        buttonClose.forEach((button) => {
            button.addEventListener('click', () => {
                alert.dispatchEvent(new CustomEvent('alert:beforeRemove', {
                    detail: { element: alert },
                    bubbles: true,
                }));
                alert.remove();
                document.body.dispatchEvent(new CustomEvent('alert:afterRemove', {
                    detail: { element: alert },
                    bubbles: true,
                }));
            });
        });
    }
}
