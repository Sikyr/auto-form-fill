var nameColumn, name2Column, streetColumn, zipColumn, cityColumn, stateColumn, countryColumn;

document.addEventListener('keydown', function(event) {
	if (event.code == 'KeyQ' && (event.ctrlKey || event.metaKey)) magicCombinationClick(event);
});

function magicCombinationClick() {
	chrome.storage.local.get("savedPres", function(result) {
		nameColumn = result.savedPres["firstName"].charCodeAt(0) - 65;
		name2Column = result.savedPres["secondName"].charCodeAt(0) - 65;
		streetColumn = result.savedPres["street"].charCodeAt(0) - 65;
		zipColumn = result.savedPres["zip"].charCodeAt(0) - 65;
		cityColumn = result.savedPres["city"].charCodeAt(0) - 65;
		stateColumn = result.savedPres["state"].charCodeAt(0) - 65;
		countryColumn = result.savedPres["country"].charCodeAt(0) - 65;
	});

	window.navigator.clipboard.readText()
    	.then((data) => FormFill(data.split('\t')))
    		.catch((err) => console.error('Не удалось скопировать', err));;
}

function getCountryCode(value) {
	return new Promise((resolve, reject) => {
		chrome.storage.local.get("countryCodes", function(result) {
			if (chrome.runtime.lastError) {
				return reject(chrome.runtime.lastError);
			}
			for (let country in result.countryCodes) {
				for(let name of result.countryCodes[country].names) {
					if (value.toUpperCase() == name.toUpperCase()) {
						resolve(result.countryCodes[country].codePol);
					}
				}	
			}
		});
	});
}

function getEmptyStateCodes() {
	return new Promise((resolve, reject) => {
		chrome.storage.local.get("stateEmptyCodes", function(result) {
			if (chrome.runtime.lastError) {
				return reject(chrome.runtime.lastError);
			}
			resolve(result.stateEmptyCodes);
		});
	});
}

function cleanFromChars(zip) {
	return new Promise((resolve, reject) => {
		chrome.storage.local.get("extraZipChars", function(result) {
			if (chrome.runtime.lastError) {
				return reject(chrome.runtime.lastError);
			}
			let newZip = zip;
			for (const char of result.extraZipChars) {
				if (newZip.startsWith(char)) {
					newZip = (newZip.slice(1));
				}
			}
			resolve(newZip);
		});
	});
}

async function FormFill(rowSplit){

	const nameInput = document.querySelector('#nazwa') 
	if ( name2Column == "" || !name2Column ){
        nameInput.value = rowSplit[nameColumn]
    } else {
		if ( rowSplit[nameColumn] == rowSplit[name2Column] ) {
            nameInput.value = rowSplit[nameColumn]
        } else {
            nameInput.value = rowSplit[nameColumn] + " " + rowSplit[name2Column]
        }
	}
	if ( nameInput.classList.contains('widgetError') ) {
        nameInput.classList.remove('widgetError');
    }
	nameInput.focus();
	
	const streetInput = document.querySelector('#ulica') 
	streetInput.value = rowSplit[streetColumn];
    if ( streetInput.classList.contains('widgetError') ) {
        streetInput.classList.remove('widgetError');
    }
	streetInput.focus();
	
	const zipInput = document.querySelector('#kod_pocztowy') 
	zipInput.value = await cleanFromChars(rowSplit[zipColumn]);
    if ( zipInput.classList.contains('widgetError') ) {
        zipInput.classList.remove('widgetError');
    }
	zipInput.focus();


	const cityInput = document.querySelector('#miejscowosc') 
	const emptStCodes = await getEmptyStateCodes();
	if ( emptStCodes.includes(rowSplit[stateColumn]) || !rowSplit[stateColumn] ) {
		cityInput.value = rowSplit[cityColumn];
	} else {
		cityInput.value = rowSplit[cityColumn] + ", " + rowSplit[stateColumn];
    }
    if (cityInput.classList.contains('widgetError')) {
        cityInput.classList.remove('widgetError');
    }
	cityInput.focus();
	
	const countrySelect = document.querySelector('#kraj_id');
	console.log(countrySelect);
	console.log(rowSplit[countryColumn]);
	console.log(await getCountryCode(rowSplit[countryColumn]));
	console.log(countrySelect.querySelector('[value="' + await getCountryCode(rowSplit[countryColumn]) + '"]'));
	console.log(document.querySelector('[value="' + await getCountryCode(rowSplit[countryColumn]) + '"]'));
	const countryOption = countrySelect.querySelector('[value="' + await getCountryCode(rowSplit[countryColumn]) + '"]');
	console.log(countryOption);
	countrySelect.options[countryOption.index].selected = true;
	countrySelect.dispatchEvent(new Event('change'));
	countrySelect.focus();
}

