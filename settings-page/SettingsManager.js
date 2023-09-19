export default class SettingsManager {

    version = "1.0.1";

    constructor(versionSpan, getByKey) {
        this.versionSpan = versionSpan;
        this.getByKey = getByKey;
        this.refreshVersionLabel();
    }

    async refreshVersionLabel() {
        this.version = await this.getByKey("version");
        this.versionSpan.innerHTML = this.version;
    }

    buildDataObject(zip, state, countryCodes, presets) {
        this.version = prompt("Please, enter the version of the settings file", "1.0.0");
        this.versionSpan.innerHTML = this.version;

        let obj = {
            "version": this.version,

            "standartSaved" : 1,
            
            "stateEmptyCodes": state,
            
            "extraZipChars": zip,
        
            "savedPres": {
                "firstName": "S",
                "secondName": "",
                "street": "A",
                "zip": "M", 
                "city": "P",
                "state": "L", 
                "country": "E"
            },
        
            "presets": presets,
        
            "countryCodes": countryCodes
        };

        return obj;
    }

    importAndSaveSettings(data) {
        chrome.storage.local.set( data );

        if (confirm("New settings are saved, do you want to import settings file?")) {
            const json = JSON.stringify(data, null, 2);

            const blob = new Blob([json], { type: "application/json" });

            const url = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = `settings-${this.version}.json`;

            a.click();

            window.URL.revokeObjectURL(url);
        }
    }

}