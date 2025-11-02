export default class Alert {
    constructor() {
        Alert.init();
    }

    private static init(): void {
        const alerts = document.querySelectorAll('[data-js="alert"]') as NodeListOf<HTMLElement>;
        if (!alerts.length) return;

        for (const alert of alerts) {
            if (alert.classList.contains('alert-keep') as boolean) {
                Alert.closeAlert(alert);
                continue;
            }
            Alert.removeAlertAfterAnimation(alert);
        }
    }

    private static removeAlertAfterAnimation(alert: HTMLElement): void {

        alert.addEventListener('animationend', () => {

            alert.dispatchEvent(new CustomEvent('alert:beforeRemove', {
                detail: {element: alert},
                bubbles: true,
            }));

            alert.remove();

            document.body.dispatchEvent(new CustomEvent('alert:afterRemove', {
                detail: {element: alert},
                bubbles: true,
            }));
        });
    }

    private static closeAlert(alert: HTMLElement): void {

        const buttonClose = alert.querySelectorAll('.close') as NodeListOf<HTMLElement>;
        if (!buttonClose.length) return;

        buttonClose.forEach((button) => {

            button.addEventListener('click', () => {
                alert.dispatchEvent(new CustomEvent('alert:beforeRemove', {
                    detail: {element: alert},
                    bubbles: true,
                }));

                alert.remove();

                document.body.dispatchEvent(new CustomEvent('alert:afterRemove', {
                    detail: {element: alert},
                    bubbles: true,
                }));
            });
        })
    }


}