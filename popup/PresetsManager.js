import STANDART_SETTINGS from '../settings/settings-1.json' assert { type: 'json' };

export default class PresetsManager {

    constructor() {
        
    }

    add(name) {
        chrome.storage.local.get('presets', result => {
            result.presets[name] = {
                'firstName': document.getElementById('name_number').value,
                'secondName': numberName2.value,
                'street': document.getElementById('street_number').value,
                'zip': document.getElementById('zip_number').value, 
                'city': document.getElementById('city_number').value,
                'state': document.getElementById('state_number').value, 
                'country': document.getElementById('country_number').value
            };
            
            chrome.storage.local.set(
                {
                    'presets': result.presets
                }, 
                function() {
                    alert("New preset is added");
                }
            );
        });

    }

    delete(name) {
        chrome.storage.local.get('presets', result => {
            delete result.presets[name];

            chrome.storage.local.set(
                {
                    'presets': result.presets
                }, 
                function() {
                    alert("Preset deleted");
                }
            );
        });
    }

    save() {
        chrome.storage.local.set({
            "savedPres":{
                'firstName': document.getElementById('name_number').value,
                'secondName': numberName2.value,
                'street': document.getElementById('street_number').value,
                'zip': document.getElementById('zip_number').value, 
                'city': document.getElementById('city_number').value,
                'state': document.getElementById('state_number').value, 
                'country': document.getElementById('country_number').value
        }
        }, function() {
            // просто уведомляю о сохранении данных
            alert("Data saved");
        });
    }

    saveStandartSettings() {
        chrome.storage.local.set( STANDART_SETTINGS , function() {
            alert("Standart set of settings presets is loaded!");
        });
    }
}