import Ajax from "./component/ajax";
import Alert from "./component/alert";
import Aside from "./component/aside";
import Collapse from "./component/collapse";
import Dialog from "./component/dialog";
import Dropdown from "./component/dropdown";
import FormValidate from "./component/form-validate";
import Tab from "./component/tab";
document.addEventListener('DOMContentLoaded', () => {
    new Ajax();
    new Alert();
    new Aside();
    new Collapse();
    new Dialog();
    new Dropdown();
    new FormValidate();
    new Tab();
});
