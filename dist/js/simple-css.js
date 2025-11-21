"use strict";
(() => {
  // src/ts/component/event-manager.ts
  var EventManager = class {
    static {
      // Stores all listeners by event type
      this.listeners = /* @__PURE__ */ new Map();
    }
    // Adds an event listener to the document
    static addEventToDocument(type, handler) {
      if (this.verifyListener(type, handler)) return;
      if (!this.listeners.has(type)) {
        this.listeners.set(type, /* @__PURE__ */ new Set());
        document.addEventListener(type, (event) => this.dispatch(type, event));
      }
      this.pushListener(type, handler);
    }
    // Checks if a listener already exists for the given type
    static verifyListener(type, handler) {
      const set = this.listeners.get(type);
      if (!set) return false;
      return set.has(handler);
    }
    // Adds a listener to the internal list
    static pushListener(type, handler) {
      if (!this.listeners.has(type)) {
        this.listeners.set(type, /* @__PURE__ */ new Set());
      }
      this.listeners.get(type).add(handler);
    }
    // Dispatches the event to all registered handlers
    static dispatch(type, event) {
      const set = this.listeners.get(type);
      if (!set) return;
      for (const handler of set) {
        try {
          handler(event);
        } catch (err) {
          console.error(`[EventManager] Error in handler "${type}":`, err);
        }
      }
    }
  };

  // src/ts/component/ajax.ts
  var Ajax = class _Ajax {
    // Initializes event delegation
    constructor() {
      _Ajax.setupDelegation();
    }
    // Sets up delegation for all existing triggers
    static setupDelegation() {
      _Ajax.registerExistingTriggers();
    }
    // Scans the DOM for elements with data-ajax-trigger and registers them
    static registerExistingTriggers(root = document) {
      const nodes = root.querySelectorAll("[data-ajax-trigger]");
      for (const element of nodes) {
        _Ajax.ensureListenersFor(element.getAttribute("data-ajax-trigger"));
      }
    }
    // Checks if the event should prevent default browser behavior
    static shouldPreventDefault(type, element) {
      return type === "submit" || type === "click" && element.tagName === "A";
    }
    // Builds the AJAX context: url, method, target, swap, data, and select
    static createContext(element) {
      const urlInfo = _Ajax.resolveAjaxUrl(element);
      if (!urlInfo?.url || !urlInfo?.method) return null;
      const targetSelector = _Ajax.resolveAjaxTarget(element);
      const swapMode = _Ajax.resolveAjaxSwap(element);
      const formData = _Ajax.buildFormData(element);
      const selectSelector = _Ajax.resolveAjaxSelect(element);
      return {
        element,
        url: urlInfo.url,
        method: urlInfo.method,
        targetSelector,
        swapMode,
        formData,
        selectSelector
      };
    }
    // Executes the AJAX request from a given context
    static performAjax(context) {
      return _Ajax.sendRequest(context.url, context.method, context.formData, context.element);
    }
    /**
     * Handler global appelé par EventManager
     * pour tous les types enregistrés (click, submit, input, etc.)
     */
    static onEvent(event) {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const type = event.type;
      const selector = `[data-ajax-trigger="${type}"]`;
      const element = target.closest(selector);
      if (!element) return;
      if (_Ajax.shouldPreventDefault(type, element)) {
        event.preventDefault();
      }
      const context = _Ajax.createContext(element);
      if (!context) {
        console.warn("No AJAX URL/method resolved for:", element);
        return;
      }
      _Ajax.emitEvent(element, "data-ajax:before-request", context);
      _Ajax.handleAjaxEvents(element, "data-ajax-event-before", context);
      _Ajax.performAjax(context).then((html) => {
        _Ajax.emitEvent(element, "data-ajax:on-success", context);
        _Ajax.handleAjaxEvents(element, "data-ajax-event-success", context);
        const targetEl = _Ajax.getTargetElement(context.targetSelector, element);
        const picked = _Ajax.extractSelectedHtml(html, context.selectSelector);
        _Ajax.applySwap(targetEl, picked, context.swapMode);
      }).catch(() => {
        _Ajax.emitEvent(element, "data-ajax:on-error", context);
        _Ajax.handleAjaxEvents(element, "data-ajax-event-error", context);
        console.error("AJAX error:", element);
        const targetEl = _Ajax.getTargetElement(context.targetSelector, element);
        _Ajax.applySwap(
          targetEl,
          `<p style="color:red;">Error while loading.</p>`,
          context.swapMode
        );
      }).finally(() => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            _Ajax.emitEvent(element, "data-ajax:after-request", context);
            _Ajax.handleAjaxEvents(element, "data-ajax-event-after", context);
          });
        });
      });
    }
    // Registers a delegated event listener for the given trigger type
    static ensureListenersFor(triggerAttribute) {
      if (!triggerAttribute) return;
      if (triggerAttribute.includes(" ")) return;
      EventManager.addEventToDocument(triggerAttribute, _Ajax.onEvent);
    }
    // Resolves the swap mode (innerHTML by default)
    static resolveAjaxSwap(element) {
      const ajaxSwap = element.getAttribute("data-ajax-swap");
      if (ajaxSwap) return ajaxSwap;
      return "innerHTML";
    }
    // Resolves the POST URL (data-ajax-post)
    static resolveAjaxPost(element) {
      return element.closest("[data-ajax-post]")?.getAttribute("data-ajax-post") || null;
    }
    // Resolves the GET URL (data-ajax-get)
    static resolveAjaxGet(element) {
      return element.closest("[data-ajax-get]")?.getAttribute("data-ajax-get") || null;
    }
    // Determines the final URL and HTTP method
    static resolveAjaxUrl(element) {
      const postUrl = _Ajax.resolveAjaxPost(element);
      const getUrl = _Ajax.resolveAjaxGet(element);
      if (!postUrl && !getUrl) {
        console.warn("No data-ajax-post or data-ajax-get found for:", element);
        return null;
      }
      const method = postUrl ? "POST" : "GET";
      const url = postUrl || getUrl;
      return { url, method };
    }
    // Resolves the target selector (data-ajax-target)
    static resolveAjaxTarget(element) {
      const selector = element.closest("[data-ajax-target]")?.getAttribute("data-ajax-target");
      if (!selector) {
        console.warn("No data-ajax-target defined for:", element);
      }
      return selector || null;
    }
    // Resolves the fragment selector (data-ajax-select)
    static resolveAjaxSelect(element) {
      return element.closest("[data-ajax-select]")?.getAttribute("data-ajax-select") || null;
    }
    // Resolves the value (data-ajax-value)
    static resolveAjaxValue(element) {
      return element.closest("[data-ajax-value]")?.getAttribute("data-ajax-value") || null;
    }
    // Extracts the selected fragment from the returned HTML
    static extractSelectedHtml(html, selector) {
      if (!selector) return html;
      try {
        const documentParsed = new DOMParser().parseFromString(html, "text/html");
        const node = documentParsed.querySelector(selector);
        return node ? node.innerHTML : html;
      } catch (_) {
        return html;
      }
    }
    // Finds the target DOM element or falls back to the source element
    static getTargetElement(targetSelector, sourceElement) {
      if (targetSelector) {
        const element = document.querySelector(targetSelector);
        if (element) return element;
        console.warn("Target not found for selector:", targetSelector, "\u2014 using source element instead.");
      }
      return sourceElement;
    }
    // Applies the chosen swap method (innerHTML, outerHTML, etc.)
    static applySwap(targetElement, html, swap) {
      const mode = String(swap || "innerHTML").toLowerCase();
      switch (mode) {
        case "inner":
        case "innerhtml":
          targetElement.innerHTML = html;
          break;
        case "outer":
        case "outerhtml":
        case "replace":
          targetElement.outerHTML = html;
          break;
        default:
          console.warn("Unknown swap mode:", swap, "\u2014 falling back to innerHTML.");
          targetElement.innerHTML = html;
      }
    }
    // Builds FormData from the element or its closest form
    static buildFormData(element) {
      const form = element.tagName === "FORM" ? element : element.closest("form");
      if (form) {
        return new FormData(form);
      }
      const formData = new FormData();
      const named = element;
      if (named.name) {
        formData.append(named.name, named.value ?? "");
      }
      return formData;
    }
    // Builds default fetch request options
    static buildRequestOptions(method) {
      const httpMethod = String(method || "GET").toUpperCase();
      return {
        method: httpMethod,
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          "Accept": "text/html"
        }
      };
    }
    // Prepares the final URL and fetch options (handles GET/POST)
    static prepareRequest(method, url, formData, element) {
      const options = _Ajax.buildRequestOptions(method);
      let finalUrl = url;
      const valueRow = _Ajax.resolveAjaxValue(element);
      if (valueRow) {
        try {
          const object = JSON.parse(valueRow.replace(/'/g, '"'));
          for (const [key, value] of Object.entries(object)) {
            formData.append(key, value);
          }
        } catch {
        }
      }
      if (method === "GET") {
        const params = new URLSearchParams();
        for (const [key, value] of formData.entries()) {
          params.append(key, value);
        }
        finalUrl += (finalUrl.includes("?") ? "&" : "?") + params.toString();
      } else {
        options.body = formData;
      }
      return { finalUrl, options };
    }
    // Sends the fetch request and returns the response HTML
    static sendRequest(url, method, formData, element) {
      const { finalUrl, options } = _Ajax.prepareRequest(method, url, formData, element);
      return fetch(finalUrl, options).then((response) => {
        if (!response.ok) throw new Error("Server error: " + response.status);
        return response.text();
      });
    }
    // Emits a custom DOM event with the given context
    static emitEvent(target, name, context = {}) {
      target.dispatchEvent(new CustomEvent(name, { detail: { ...context }, bubbles: true }));
    }
    // Executes inline expressions or functions defined in data-ajax-event-* attributes
    static handleAjaxEvents(element, eventAttrName, context = {}) {
      const host = element.hasAttribute(eventAttrName) ? element : element.closest?.(`[${eventAttrName}]`);
      if (!host) return;
      const value = host.getAttribute(eventAttrName);
      if (!value) return;
      const parts = value.split(";").map((part) => part.trim()).filter(Boolean);
      for (const expr of parts) {
        try {
          const fn = window[expr];
          if (typeof fn === "function") {
            fn(context, host);
          } else {
            new Function("context", "element", expr)(context, host);
          }
        } catch (e) {
          console.error(`Error in ${eventAttrName} -> "${expr}"`, e);
        }
      }
    }
  };

  // src/ts/component/alert.ts
  var Alert = class _Alert {
    constructor() {
      _Alert.init();
    }
    static init() {
      EventManager.addEventToDocument("animationend", _Alert.onAnimationEnd);
      EventManager.addEventToDocument("click", _Alert.onClick);
    }
    static onAnimationEnd(event) {
      const target = event.target;
      if (!target) return;
      if (!target.matches('[data-js="alert"]')) return;
      target.remove();
    }
    static onClick(event) {
      if (!(event instanceof MouseEvent)) return;
      const target = event.target;
      if (!target) return;
      if (!target.matches(".close")) return;
      const alert = target.closest('[data-js="alert"]');
      if (!alert) return;
      alert.remove();
    }
  };

  // src/ts/component/aside.ts
  var Aside = class _Aside {
    constructor() {
      _Aside.init();
    }
    static init() {
      EventManager.addEventToDocument("click", _Aside.onClick);
    }
    static onClick(event) {
      if (!(event instanceof MouseEvent)) return;
      const target = event.target;
      if (!target) return;
      _Aside.handleClose(target);
      _Aside.handleOpen(target);
    }
    static handleOpen(target) {
      if (!target.matches('[data-js="aside"][data-target]')) return;
      const selector = target.getAttribute("data-target");
      if (!selector) return;
      const aside = document.querySelector(selector);
      if (!aside) return;
      _Aside.isOpen(aside) ? _Aside.hide(aside) : _Aside.show(aside);
    }
    static handleClose(target) {
      if (!target.matches(".close")) return;
      const aside = target.closest("aside, .sidebar-left, .sidebar-right");
      if (!aside) return;
      if (!_Aside.isOpen(aside)) return;
      _Aside.hide(aside);
    }
    static isOpen(aside) {
      return aside.classList.contains("show");
    }
    static show(aside) {
      aside.classList.add("show");
    }
    static hide(aside) {
      aside.classList.remove("show");
    }
  };

  // src/ts/component/collapse.ts
  var Collapse = class _Collapse {
    constructor() {
      _Collapse.init();
    }
    static init() {
      EventManager.addEventToDocument("click", _Collapse.onClick);
    }
    static onClick(event) {
      if (!(event instanceof MouseEvent)) return;
      const target = event.target;
      if (!target) return;
      const trigger = target.closest('[data-js="collapse"][data-target]');
      if (!trigger) return;
      _Collapse.handleToggle(trigger);
    }
    static handleToggle(trigger) {
      const selector = trigger.getAttribute("data-target");
      if (!selector) return;
      const collapse = document.querySelector(selector);
      if (!collapse) return;
      _Collapse.toggle(collapse);
    }
    static toggle(collapse) {
      if (_Collapse.isAnimating(collapse)) return;
      const accordion = collapse.closest(".accordion");
      if (accordion) {
        _Collapse.handleTypeAccordion(accordion, collapse);
      }
      const isOpen = collapse.classList.contains("show");
      isOpen ? _Collapse.close(collapse) : _Collapse.open(collapse);
    }
    static handleTypeAccordion(accordion, collapse) {
      if (!accordion) return;
      const type = accordion.getAttribute("data-type");
      if (type !== "multiple") {
        _Collapse.closeAllCollapses(accordion, collapse);
      }
    }
    static closeAllCollapses(accordion, except) {
      const collapses = accordion.querySelectorAll(".accordion-body.show");
      collapses.forEach((panel) => {
        if (panel === except) return;
        _Collapse.close(panel);
      });
    }
    static isAnimating(collapse) {
      return collapse.dataset.animating === "true";
    }
    static open(collapse) {
      collapse.dataset.animating = "true";
      collapse.classList.add("show");
      _Collapse.prepareOpenStyles(collapse);
      const height = collapse.scrollHeight;
      collapse.style.height = "0px";
      const animation = _Collapse.playOpenAnimation(collapse, height);
      animation.onfinish = () => {
        collapse.style.height = "auto";
        collapse.style.overflow = "visible";
        delete collapse.dataset.animating;
        _Collapse.cleanAnimationStyles(collapse);
      };
    }
    static close(collapse) {
      collapse.dataset.animating = "true";
      const height = collapse.scrollHeight;
      _Collapse.prepareCloseStyles(collapse, height);
      const animation = _Collapse.playCloseAnimation(collapse, height);
      animation.onfinish = () => {
        collapse.style.height = "0px";
        collapse.classList.remove("show");
        delete collapse.dataset.animating;
        _Collapse.cleanAnimationStyles(collapse);
      };
    }
    static prepareOpenStyles(collapse) {
      collapse.style.overflow = "hidden";
      collapse.style.height = "auto";
    }
    static prepareCloseStyles(collapse, height) {
      collapse.style.overflow = "hidden";
      collapse.style.height = `${height}px`;
    }
    static playOpenAnimation(collapse, height) {
      return collapse.animate(
        [{ height: "0px" }, { height: `${height}px` }],
        { duration: 300, easing: "ease" }
      );
    }
    static playCloseAnimation(collapse, height) {
      return collapse.animate(
        [{ height: `${height}px` }, { height: "0px" }],
        { duration: 300, easing: "ease" }
      );
    }
    static cleanAnimationStyles(collapse) {
      collapse.style.removeProperty("height");
      collapse.style.removeProperty("overflow");
      delete collapse.dataset.animating;
    }
  };

  // src/ts/component/dialog.ts
  var Dialog = class _Dialog {
    constructor() {
      _Dialog.init();
    }
    static init() {
      EventManager.addEventToDocument("click", _Dialog.onClick);
    }
    static onClick(event) {
      if (!(event instanceof MouseEvent)) return;
      const target = event.target;
      if (!target) return;
      if (_Dialog.handleSwitch(target)) return;
      if (_Dialog.handleClose(target)) return;
      _Dialog.handleOpen(target);
    }
    static handleSwitch(target) {
      if (!target.matches('.close[data-js="dialog"][data-target]')) {
        return false;
      }
      const selector = target.getAttribute("data-target");
      if (!selector) return true;
      const nextDialog = document.querySelector(selector);
      if (!(nextDialog instanceof HTMLDialogElement)) return true;
      const currentDialog = target.closest("dialog");
      if (currentDialog && currentDialog !== nextDialog) {
        currentDialog.addEventListener(
          "transitionend",
          () => _Dialog.open(nextDialog),
          { once: true }
        );
        _Dialog.close(currentDialog);
        return true;
      }
      if (!nextDialog.open) {
        _Dialog.open(nextDialog);
      }
      return true;
    }
    static handleClose(target) {
      if (!target.matches(".close") || target.matches('[data-js="dialog"]')) {
        return false;
      }
      const dialog = target.closest("dialog");
      if (!dialog) return true;
      _Dialog.close(dialog);
      return true;
    }
    static handleOpen(target) {
      if (!target.matches('[data-js="dialog"][data-target]') || target.matches(".close")) {
        return false;
      }
      const selector = target.getAttribute("data-target");
      if (!selector) return true;
      const dialog = document.querySelector(selector);
      if (!(dialog instanceof HTMLDialogElement)) return true;
      if (!dialog.open) {
        _Dialog.open(dialog);
      }
      return true;
    }
    static open(dialog) {
      _Dialog.emitEvent(dialog, "dialog:beforeOpen", dialog);
      dialog.showModal();
      dialog.classList.add("show");
      _Dialog.emitEvent(dialog, "dialog:afterOpen", dialog);
    }
    static close(dialog) {
      _Dialog.emitEvent(dialog, "dialog:beforeClose", dialog);
      dialog.classList.remove("show");
      dialog.addEventListener(
        "transitionend",
        () => {
          dialog.close();
        },
        { once: true }
      );
      _Dialog.emitEvent(dialog, "dialog:afterClose", dialog);
    }
    static emitEvent(target, name, dialog) {
      target.dispatchEvent(
        new CustomEvent(name, {
          detail: { element: dialog },
          bubbles: true
        })
      );
    }
  };

  // src/ts/component/dropdown.ts
  var Dropdown = class _Dropdown {
    constructor() {
      _Dropdown.init();
    }
    static init() {
      EventManager.addEventToDocument("click", _Dropdown.onClick);
    }
    static onClick(event) {
      if (!(event instanceof MouseEvent)) return;
      const target = event.target;
      if (!target) return;
      if (target.matches('[data-js="dropdown"][data-target]')) {
        const selector = target.getAttribute("data-target");
        if (!selector) return;
        const dropdown = document.querySelector(selector);
        if (!dropdown) return;
        _Dropdown.closeAllDropdownsExcept(dropdown);
        _Dropdown.toggleDropdown(dropdown);
        return;
      }
      if (target.closest(".dropdown-menu.show")) {
        return;
      }
      _Dropdown.closeAllDropdowns();
    }
    static toggleDropdown(dropdown) {
      _Dropdown.isOpen(dropdown) ? _Dropdown.closeDropdown(dropdown) : _Dropdown.openDropdown(dropdown);
    }
    static isOpen(dropdown) {
      return dropdown.classList.contains("show");
    }
    static openDropdown(dropdown) {
      if (_Dropdown.isOpen(dropdown)) return;
      dropdown.style.display = "block";
      dropdown.offsetHeight;
      dropdown.classList.add("show");
    }
    static closeDropdown(dropdown) {
      if (!_Dropdown.isOpen(dropdown)) return;
      dropdown.classList.remove("show");
      const onTransitionEnd = (event) => {
        if (event.propertyName !== "opacity") return;
        dropdown.style.display = "none";
        dropdown.removeEventListener("transitionend", onTransitionEnd);
      };
      dropdown.addEventListener("transitionend", onTransitionEnd, { once: true });
      dropdown.classList.remove("show");
    }
    static closeAllDropdownsExcept(exception) {
      const dropdowns = document.querySelectorAll(".dropdown-menu.show");
      dropdowns.forEach((dropdown) => {
        if (dropdown !== exception) {
          _Dropdown.closeDropdown(dropdown);
        }
      });
    }
    static closeAllDropdowns() {
      const dropdowns = document.querySelectorAll(".dropdown-menu.show");
      dropdowns.forEach((dropdown) => _Dropdown.closeDropdown(dropdown));
    }
  };

  // src/ts/component/form-validate.ts
  var FormValidate = class _FormValidate {
    constructor() {
      _FormValidate.init();
    }
    static init() {
      EventManager.addEventToDocument("submit", _FormValidate.onSubmit);
    }
    static onSubmit(event) {
      const target = event.target;
      if (!target) return;
      const form = target.closest("form");
      if (!form) return;
      if (!form.matches('[data-js="validate"]')) return;
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add("validated");
    }
  };

  // src/ts/component/tab.ts
  var Tab = class _Tab {
    constructor() {
      _Tab.init();
    }
    static init() {
      EventManager.addEventToDocument("click", _Tab.onClick);
    }
    static onClick(event) {
      if (!(event instanceof MouseEvent)) return;
      const target = event.target;
      if (!target) return;
      _Tab.handleTabClick(target);
    }
    static handleTabClick(target) {
      if (!target.matches('[data-js="tab"][data-target]')) return;
      const container = target.parentElement;
      if (!container) return;
      const content = _Tab.resolveContent(target);
      if (!content) return;
      _Tab.hideAll(container);
      _Tab.clearActive(container);
      _Tab.showOne(target, content);
    }
    static resolveContent(button) {
      const selector = button.getAttribute("data-target");
      if (!selector) return null;
      const el = document.querySelector(selector);
      return el instanceof HTMLElement ? el : null;
    }
    static hideAll(container) {
      const buttons = container.querySelectorAll('[data-js="tab"][data-target]');
      buttons.forEach((button) => {
        const content = _Tab.resolveContent(button);
        if (content) content.classList.remove("show");
      });
    }
    static clearActive(container) {
      const buttons = container.querySelectorAll('[data-js="tab"][data-target]');
      buttons.forEach((button) => button.classList.remove("active"));
    }
    static showOne(button, content) {
      button.classList.add("active");
      content.classList.add("show");
    }
  };

  // src/ts/simple-css.ts
  document.addEventListener("DOMContentLoaded", () => {
    new Ajax();
    new Alert();
    new Aside();
    new Collapse();
    new Dialog();
    new Dropdown();
    new FormValidate();
    new Tab();
    console.log(EventManager.listeners);
  });
})();
