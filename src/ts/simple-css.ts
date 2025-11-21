import EventManager from "./component/event-manager";
import Ajax from "./component/ajax.js";
import Alert from "./component/alert.js";
import Aside from "./component/aside.js";
import Collapse from "./component/collapse.js";
import Dialog from "./component/dialog.js";
import Dropdown from "./component/dropdown.js";
import FormValidate from "./component/form-validate.js";
import Tab from "./component/tab.js";


document.addEventListener('DOMContentLoaded', () => {
    new Ajax();
    new Alert();
    new Aside();
    new Collapse();
    new Dialog();
    new Dropdown();
    new FormValidate();
    new Tab();
    console.log(EventManager.listeners)
});