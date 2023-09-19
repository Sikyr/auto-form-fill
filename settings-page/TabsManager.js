export default class TabsManager {

    constructor(tabs, reloadBtn) {
        this.tabs = tabs;
        reloadBtn.addEventListener('click', () => this.reloadTab());

        for (const tab in this.tabs) {
            this.tabs[tab].button.addEventListener('click', () => this.switchTab(this.tabs[tab]));
            if (this.tabs[tab].reload) {
               this.tabs[tab].reload();
           }
        }
    }

    switchTab(tabTarget) {
        for (const tab in this.tabs) {
            if (this.tabs[tab].active) {
                this.tabs[tab].button.classList.remove("active");
                this.tabs[tab].body.classList.add("hidden");
                this.tabs[tab].active = false;
            }

            tabTarget.body.classList.remove("hidden");
            tabTarget.button.classList.add("active");
            tabTarget.active = true;
        }
    }

    reloadTab() {
        for (const tab in this.tabs) {
            if (this.tabs[tab].active && this.tabs[tab].reload) {
                this.tabs[tab].reload();
            }
        }
    }
}