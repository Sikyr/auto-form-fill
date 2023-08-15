var nameColumn, name2Column, streetColumn, zipColumn, cityColumn, stateColumn, countryColumn;

// обработчик нажатия горячей клавиши
document.addEventListener('keydown', function(event) {
	if (event.code == 'KeyQ' && (event.ctrlKey || event.metaKey)) magicCombinationClick(event);
});

function magicCombinationClick() {
	// получаю из хранилища и присваиваю номера столбцов
	chrome.storage.local.get("savedPres", function(result) {
		nameColumn = result.savedPres["firstName"].charCodeAt(0) - 65;
		name2Column = result.savedPres["secondName"].charCodeAt(0) - 65;
		streetColumn = result.savedPres["street"].charCodeAt(0) - 65;
		zipColumn = result.savedPres["zip"].charCodeAt(0) - 65;
		cityColumn = result.savedPres["city"].charCodeAt(0) - 65;
		stateColumn = result.savedPres["state"].charCodeAt(0) - 65;
		countryColumn = result.savedPres["country"].charCodeAt(0) - 65;
	});
	
	//читаю из буфера обмена и разбиваю строчку по табам
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
						resolve(result.countryCodes[country].code);
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
	//получаю и присваию имя
	const nameDiv = document.querySelector('[data-id="recipient.name"]') 
	const nameInput = document.querySelector('[data-id="recipient.name"] div.input input') 
	
	// проверка на раздельное имя
	if (name2Column == "" || !name2Column)
		nameInput.value = rowSplit[nameColumn];
	else {
		if (rowSplit[nameColumn] == rowSplit[name2Column])
			nameInput.value = rowSplit[nameColumn];
		else
			nameInput.value = rowSplit[nameColumn] + " " + rowSplit[name2Column];
	}
	nameDiv.classList.add('filled');
	nameInput.focus();
	
	
	//получаю и присваию улицу
	const streetDiv = document.querySelector('[data-id="recipient.street"]') 
	var streetInput = document.querySelector('[data-id="recipient.street"] div.input textarea') 
	if (!streetInput) streetInput = document.querySelector('[data-id="recipient.street"] div.input input');

	streetInput.value = rowSplit[streetColumn];
	streetDiv.classList.add('filled');
	streetInput.focus();
	
	//получаю и присваию зип-код
	const zipDiv = document.querySelector('[data-id="recipient.zip"]') 
	const zipInput = document.querySelector('[data-id="recipient.zip"] div.input input') 

	// if(rowSplit[zipColumn].startsWith("'")) 
	// 	zipInput.value = rowSplit[zipColumn].slice(1);
	// else
	// 	zipInput.value = rowSplit[zipColumn];

	zipInput.value = await cleanFromChars(rowSplit[zipColumn]);
	zipDiv.classList.add('filled');
	zipInput.focus();

	//получаю и присваию город
	const cityDiv = document.querySelector('[data-id="recipient.city"]') 
	const cityInput = document.querySelector('[data-id="recipient.city"] div.input input') 
	
	const emptStCodes = await getEmptyStateCodes();
	if(emptStCodes.includes(rowSplit[stateColumn]) || !rowSplit[stateColumn])
		cityInput.value = rowSplit[cityColumn];
	else
		cityInput.value = rowSplit[cityColumn] + ", " + rowSplit[stateColumn];
	cityDiv.classList.add('filled');
	cityInput.focus();
	
	// присваиваю страну
	const countrySelect = document.querySelector('[data-id="recipient.country"] div.select select') 
	const countryOption = document.querySelector('[data-id="recipient.country"] div.select select [value="' + await getCountryCode(rowSplit[countryColumn]) + '"]') 
	
	countrySelect.options[countryOption.index].selected = true;
	countrySelect.dispatchEvent(new Event('change'));
	countrySelect.focus();
}

