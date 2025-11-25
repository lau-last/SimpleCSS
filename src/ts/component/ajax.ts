import EventManager from './event-manager.js';

interface AjaxContext {
    element: HTMLElement;
    url: string;
    method: string;
    targetSelector: string | null;
    swapMode: string | null;
    formData: FormData;
    selectSelector: string | null;
}

/**
 * Ajax
 * ----------
 * Lightweight vanilla JS utility that provides HTMX-like behavior using simple data-ajax-* attributes.
 *
 * Supported attributes:
 * - data-ajax-get: URL for GET requests; form data is sent as query parameters.
 * - data-ajax-post: URL for POST requests; form data is sent in the request body.
 * - data-ajax-trigger: Event name that triggers the AJAX request (e.g. click, submit, input).
 * - data-ajax-target: CSS selector of the element to update with the response (defaults to self if missing).
 * - data-ajax-swap: How to insert the response HTML (innerHTML, outerHTML).
 * - data-ajax-event-before: JS code to execute before the request.
 * - data-ajax-event-success: JS code to execute on success.
 * - data-ajax-event-error: JS code to execute on error.
 * - data-ajax-event-after: JS code to execute after the request.
 * - data-ajax-select: CSS selector of the element to extract from the response HTML.
 * - data-ajax-value: JSON object to append to the form data.
 */
export default class Ajax {

    // Initializes event delegation
    constructor() {
        Ajax.setupDelegation();
    }

    // Sets up delegation for all existing triggers
    static setupDelegation(): void {
        Ajax.registerExistingTriggers();
        // Ajax.observeTriggerAttributeChanges();
    }

    // Scans the DOM for elements with data-ajax-trigger and registers them
    static registerExistingTriggers(root: Document | HTMLElement = document): void {
        const nodes = root.querySelectorAll<HTMLElement>('[data-ajax-trigger]');
        for (const element of nodes) {
            Ajax.ensureListenersFor(element.getAttribute('data-ajax-trigger'));
        }
    }

    // Checks if the event should prevent default browser behavior
    static shouldPreventDefault(type: string, element: HTMLElement): boolean {
        return type === 'submit' || (type === 'click' && element.tagName === 'A');
    }

    // Builds the AJAX context: url, method, target, swap, data, and select
    static createContext(element: HTMLElement): AjaxContext | null {
        const urlInfo = Ajax.resolveAjaxUrl(element);
        if (!urlInfo?.url || !urlInfo?.method) return null;

        const targetSelector = Ajax.resolveAjaxTarget(element);
        const swapMode = Ajax.resolveAjaxSwap(element);
        const formData = Ajax.buildFormData(element);
        const selectSelector = Ajax.resolveAjaxSelect(element);

        return {
            element,
            url: urlInfo.url,
            method: urlInfo.method,
            targetSelector,
            swapMode,
            formData,
            selectSelector,
        };
    }

    // Executes the AJAX request from a given context
    static performAjax(context: AjaxContext): Promise<string> {
        return Ajax.sendRequest(context.url, context.method, context.formData, context.element);
    }

    /**
     * Handler global appelé par EventManager
     * pour tous les types enregistrés (click, submit, input, etc.)
     */
    static onEvent(event: Event): void {
        const target = event.target;
        if (!(target instanceof Element)) return;

        const type = event.type;
        const selector = `[data-ajax-trigger="${type}"]`;
        const element = target.closest(selector) as HTMLElement | null;
        if (!element) return;

        if (Ajax.shouldPreventDefault(type, element)) {
            event.preventDefault();
        }

        const context = Ajax.createContext(element);
        if (!context) {
            console.warn('No AJAX URL/method resolved for:', element);
            return;
        }

        Ajax.emitEvent(element, 'data-ajax:before-request', context);
        Ajax.handleAjaxEvents(element, 'data-ajax-event-before', context);

        Ajax.performAjax(context)
            .then((html: string) => {
                Ajax.emitEvent(element, 'data-ajax:on-success', context);
                Ajax.handleAjaxEvents(element, 'data-ajax-event-success', context);
                const targetEl = Ajax.getTargetElement(context.targetSelector, element);
                const picked = Ajax.extractSelectedHtml(html, context.selectSelector);
                Ajax.applySwap(targetEl, picked, context.swapMode);
            })
            .catch(() => {
                Ajax.emitEvent(element, 'data-ajax:on-error', context);
                Ajax.handleAjaxEvents(element, 'data-ajax-event-error', context);
                console.error('AJAX error:', element);
                const targetEl = Ajax.getTargetElement(context.targetSelector, element);
                Ajax.applySwap(
                    targetEl,
                    `<p style="color:red;">Error while loading.</p>`,
                    context.swapMode
                );
            })
            .finally(() => {
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        Ajax.emitEvent(element, 'data-ajax:after-request', context);
                        Ajax.handleAjaxEvents(element, 'data-ajax-event-after', context);
                    });
                });
            });
    }

    // Registers a delegated event listener for the given trigger type
    static ensureListenersFor(triggerAttribute: string | null): void {
        if (!triggerAttribute) return;
        if (triggerAttribute.includes(' ')) return;

        EventManager.addEventToDocument(triggerAttribute, Ajax.onEvent);
    }

    // Resolves the swap mode (innerHTML by default)
    static resolveAjaxSwap(element: HTMLElement): string {
        const ajaxSwap = element.getAttribute('data-ajax-swap');
        if (ajaxSwap) return ajaxSwap;
        return 'innerHTML';
    }

    // Resolves the POST URL (data-ajax-post)
    static resolveAjaxPost(element: HTMLElement): string | null {
        return element.closest('[data-ajax-post]')?.getAttribute('data-ajax-post') || null;
    }

    // Resolves the GET URL (data-ajax-get)
    static resolveAjaxGet(element: HTMLElement): string | null {
        return element.closest('[data-ajax-get]')?.getAttribute('data-ajax-get') || null;
    }

    // Determines the final URL and HTTP method
    static resolveAjaxUrl(element: HTMLElement): { url: string; method: string } | null {
        const postUrl = Ajax.resolveAjaxPost(element);
        const getUrl = Ajax.resolveAjaxGet(element);

        if (!postUrl && !getUrl) {
            console.warn('No data-ajax-post or data-ajax-get found for:', element);
            return null;
        }

        const method = postUrl ? 'POST' : 'GET';
        const url = (postUrl || getUrl)!;

        return { url, method };
    }

    // Resolves the target selector (data-ajax-target)
    static resolveAjaxTarget(element: HTMLElement): string | null {
        const selector = element.closest('[data-ajax-target]')?.getAttribute('data-ajax-target');
        if (!selector) {
            console.warn('No data-ajax-target defined for:', element);
        }
        return selector || null;
    }

    // Resolves the fragment selector (data-ajax-select)
    static resolveAjaxSelect(element: HTMLElement): string | null {
        return element.closest('[data-ajax-select]')?.getAttribute('data-ajax-select') || null;
    }

    // Resolves the value (data-ajax-value)
    static resolveAjaxValue(element: HTMLElement): string | null {
        return element.closest('[data-ajax-value]')?.getAttribute('data-ajax-value') || null;
    }

    // Extracts the selected fragment from the returned HTML
    static extractSelectedHtml(html: string, selector: string | null): string {
        if (!selector) return html;
        try {
            const documentParsed = new DOMParser().parseFromString(html, 'text/html');
            const node = documentParsed.querySelector<HTMLElement>(selector);
            return node ? node.innerHTML : html;
        } catch (_) {
            return html;
        }
    }

    // Finds the target DOM element or falls back to the source element
    static getTargetElement(targetSelector: string | null, sourceElement: HTMLElement): HTMLElement {
        if (targetSelector) {
            const element = document.querySelector<HTMLElement>(targetSelector);
            if (element) return element;
            console.warn('Target not found for selector:', targetSelector, '— using source element instead.');
        }
        return sourceElement;
    }

    // Applies the chosen swap method (innerHTML, outerHTML, etc.)
    static applySwap(targetElement: HTMLElement, html: string, swap?: string | null): void {
        const mode = String(swap || 'innerHTML').toLowerCase();

        switch (mode) {
            case 'inner':
            case 'innerhtml':
                targetElement.innerHTML = html;
                break;

            case 'outer':
            case 'outerhtml':
            case 'replace':
                targetElement.outerHTML = html;
                break;

            default:
                console.warn('Unknown swap mode:', swap, '— falling back to innerHTML.');
                targetElement.innerHTML = html;
        }
    }

    // Builds FormData from the element or its closest form
    static buildFormData(element: HTMLElement): FormData {
        const form = (element.tagName === 'FORM' ? element : element.closest('form')) as HTMLFormElement | null;
        if (form) {
            return new FormData(form);
        }

        const formData = new FormData();
        const named = element as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
        if ((named as any).name) {
            formData.append((named as any).name, (named as any).value ?? '');
        }

        return formData;
    }

    // Builds default fetch request options
    static buildRequestOptions(method?: string): RequestInit {
        const httpMethod = String(method || 'GET').toUpperCase();

        return {
            method: httpMethod,
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'text/html'
            }
        };
    }

    // Prepares the final URL and fetch options (handles GET/POST)
    static prepareRequest(
        method: string,
        url: string,
        formData: FormData,
        element: HTMLElement
    ): { finalUrl: string; options: RequestInit } {
        const options = Ajax.buildRequestOptions(method);
        let finalUrl = url;

        const valueRow = Ajax.resolveAjaxValue(element);
        if (valueRow) {
            try {
                const object = JSON.parse(valueRow.replace(/'/g, '"')) as Record<string, unknown>;
                for (const [key, value] of Object.entries(object)) {
                    formData.append(key, value as string);
                }
            } catch {
                /* on ignore si erreur */
            }
        }

        if (method === 'GET') {
            const params = new URLSearchParams();
            for (const [key, value] of formData.entries()) {
                params.append(key, value as string);
            }
            finalUrl += (finalUrl.includes('?') ? '&' : '?') + params.toString();
        } else {
            options.body = formData;
        }

        return { finalUrl, options };
    }

    // Sends the fetch request and returns the response HTML
    static sendRequest(
        url: string,
        method: string,
        formData: FormData,
        element: HTMLElement
    ): Promise<string> {
        const { finalUrl, options } = Ajax.prepareRequest(method, url, formData, element);

        return fetch(finalUrl, options)
            .then((response) => {
                if (!response.ok) throw new Error('Server error: ' + response.status);
                return response.text();
            });
    }

    // Emits a custom DOM event with the given context
    static emitEvent(target: HTMLElement, name: string, context: AjaxContext = {} as AjaxContext): void {
        target.dispatchEvent(new CustomEvent(name, { detail: { ...context }, bubbles: true }));
    }

    // Executes inline expressions or functions defined in data-ajax-event-* attributes
    static handleAjaxEvents(
        element: HTMLElement,
        eventAttrName: string,
        context: AjaxContext = {} as AjaxContext
    ): void {
        const host = element.hasAttribute(eventAttrName)
            ? element
            : (element.closest?.(`[${eventAttrName}]`) as HTMLElement | null);
        if (!host) return;

        const value = host.getAttribute(eventAttrName);
        if (!value) return;

        const parts = value.split(';').map(part => part.trim()).filter(Boolean);

        for (const expr of parts) {
            try {
                const fn = (window as any)[expr];
                if (typeof fn === 'function') {
                    fn(context, host);
                } else {
                    // eslint-disable-next-line no-new-func
                    new Function('context', 'element', expr)(context, host);
                }
            } catch (e) {
                console.error(`Error in ${eventAttrName} -> "${expr}"`, e);
            }
        }
    }
}



// static observeNewAjaxTriggers(): void {
//
//     const observer = new MutationObserver((mutations) => {
//         for (const mutation of mutations) {
//
//             // On surveille seulement les éléments ajoutés
//             mutation.addedNodes.forEach((node) => {
//                 if (!(node instanceof HTMLElement)) return;
//
//                 // Si le nouvel élément a data-ajax-trigger
//                 const direct = node.getAttribute('data-ajax-trigger');
//                 if (direct) {
//                     Ajax.ensureListenersFor(direct);
//                 }
//
//                 // Si des descendants ont data-ajax-trigger
//                 const descendants = node.querySelectorAll('[data-ajax-trigger]');
//                 descendants.forEach((el) => {
//                     const trigger = el.getAttribute('data-ajax-trigger');
//                     if (trigger) {
//                         Ajax.ensureListenersFor(trigger);
//                     }
//                 });
//             });
//         }
//     });
//
//     observer.observe(document.body, {
//         childList: true,
//         subtree: true
//     });
// }