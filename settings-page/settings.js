import TableActions from './TableActions.js';
import TabsManager from './TabsManager.js';
import SelectManager from './SelectManager.js';
import SettingsManager from './SettingsManager.js';
import { STATE_TABLE_BODY, COUNTRY_TABLE_BODY, ZIP_TABLE_BODY } from './constants.js';

let tabs = {};

console.log(await getByKey("version"));

document.querySelectorAll("body > div.tab > button.tablinks").forEach(element => {
    let tab = {
        name: element.id,
        active: false,
        button: element,
        body: document.querySelector(`body > div.${element.id}.tab-content`),
        importable: false
    }
    switch (tab.name) {
        case 'zip':
            tab.table = new TableActions( ZIP_TABLE_BODY , "zip" );
            tab.reload = async () => tab.table.fill(await getByKey("extraZipChars"));
            tab.importable = true;
            break;
        case 'state':
            tab.table = new TableActions( STATE_TABLE_BODY , "state" );
            tab.reload = async () => tab.table.fill(await getByKey("stateEmptyCodes"));
            tab.importable = true;
            break;
        case 'country-codes':
            tab.importable = true;
            tab.table = new TableActions( COUNTRY_TABLE_BODY , "country-codes" );
            tab.select = new SelectManager(
                document.getElementById(`country-select`),
                tab.table,
                document.getElementById("add-country-button"),
                document.getElementById("delete-country-button")
            );
            tab.reload = async () => tab.select.refresh(await getByKey('countryCodes'));
            break;
        case 'presets':
            tab.reload = () => {
                chrome.storage.local.get("presets" , function(result) {
                    document.querySelector(".presets > pre").textContent = objectToText(result.presets);
                });
            };
            break;
    
        default:
            break;
    }

    tabs[element.id] = tab;
});

tabs.zip.active = true;

const tabsManager = new TabsManager(tabs, document.getElementById("reload-button"));

const settingsManager = new SettingsManager(
    document.getElementById("settings-version"),
    getByKey
    );

function objectToText(obj, indent = 0) {
    const spaces = ' '.repeat(indent * 2);
    let text = '';
  
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
  
        if (typeof value === 'object') {
          text += `${spaces}${key}:\n${objectToText(value, indent + 1)}`;
        } else {
          text += `${spaces}${key}: ${value}\n`;
        }
      }
    }
  
    return text;
}

function convertFileToJSON(fileInput) {
    return new Promise((resolve, reject) => {
      const selectedFile = fileInput.files[0];

      if (!selectedFile) {
        reject(new Error("No file selected."));
        return;
      }

      // Check if the selected file has a JSON extension
      if (selectedFile.name.endsWith(".json")) {
        const reader = new FileReader();

        reader.onload = function (e) {
          try {
            // Parse the JSON data from the file
            const jsonObject = JSON.parse(e.target.result);
            resolve(jsonObject);
          } catch (error) {
            reject(error);
          }
        };

        reader.readAsText(selectedFile);
      } else {
        reject(new Error("Selected file is not a JSON file."));
      }
    });
  }

function getByKey(storageKey) {
    return new Promise((resolve, reject) => {
        const key = storageKey;
        chrome.storage.local.get( key , function(result) {
            if (chrome.runtime.lastError) {
                return reject(chrome.runtime.lastError);
            }
            resolve(result[key]);
        });
    });
}

document.getElementById("save-import").addEventListener( "click" , async () => {
    settingsManager.importAndSaveSettings(settingsManager.buildDataObject(
        tabs.zip.table.valuesArr,
        tabs.state.table.valuesArr,
        tabs['country-codes'].select.options,
        await getByKey("presets")
    ));
});

document.getElementById("load-settings-button").addEventListener( "click" , async () => {
    settingsManager.loadSettings(await convertFileToJSON(document.getElementById("file-input")));
});