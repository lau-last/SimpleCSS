import Aside from "./components/aside.js";
import Dropdown from "./components/dropdown.js";
import Dialog from "./components/dialog.js";
import Tab from "./components/tab.js";
document.addEventListener('DOMContentLoaded', () => {
    new Aside();
    new Dropdown();
    new Dialog();
    new Tab();
});
