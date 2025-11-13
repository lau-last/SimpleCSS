import Alert from "./components/alert.js";
import Aside from "./components/aside.js";
import Collapse from "./components/collapse.js";
import Dialog from "./components/dialog.js";
import Tab from "./components/tab.js";
import Ajax from "./components/ajax.js";
import EventManager from "./components/event_manager.js";


document.addEventListener('DOMContentLoaded', () => {
    new Alert();
    new Aside();
    new Collapse();
    new Dialog();
    new Tab();
    new Ajax();
    console.log(EventManager.listeners)
});