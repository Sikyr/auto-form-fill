// обработчик нажатия горячей клавиши
document.addEventListener('keydown', function(event) {
  if (event.code == 'KeyQ' && (event.ctrlKey || event.metaKey)) {
	
	//Переменные номеров колонок разбивания строчки
	var nameColumn, name2Column, streetColumn, zipColumn, cityColumn, stateColumn, countryColumn;
	
	// получаю из хранилища и присваиваю номера столбцов
	chrome.storage.local.get(['cname', 'cname2', 'cstreet', 'czip', 'ccity', 'cstate', 'ccountry'], function(result) {
		nameColumn = numberOfLetter[result.cname];
		name2Column = numberOfLetter[result.cname2];
		streetColumn = numberOfLetter[result.cstreet];
		zipColumn = numberOfLetter[result.czip];
		cityColumn = numberOfLetter[result.ccity];
		stateColumn = numberOfLetter[result.cstate];
		countryColumn = numberOfLetter[result.ccountry];
	});
	
	//читаю из буфера обмена и разбиваю строчку по табам
	window.navigator.clipboard.readText()
    .then((data) => FormFill(data.split('\t')))
    .catch((err) => console.error('Не удалось скопировать', err));;
	
	// функция поиска второго значения по массиву
	function getCountryCode(value) {
		for (let country in countryCodes){
			for(let name of countryCodes[country].names){		
				if (value.toUpperCase() == name.toUpperCase()) return countryCodes[country].code;
			}
		}
	}
	
	//функция заполнения
	function FormFill(rowSplit){
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
	
		if(rowSplit[zipColumn].startsWith("'")) 
			zipInput.value = rowSplit[zipColumn].slice(1);
		else
			zipInput.value = rowSplit[zipColumn];
		zipDiv.classList.add('filled');
		zipInput.focus();
	
		//получаю и присваию город
		const cityDiv = document.querySelector('[data-id="recipient.city"]') 
		const cityInput = document.querySelector('[data-id="recipient.city"] div.input input') 
		
		if(stateColumn == "" || rowSplit[stateColumn] == "xx" || rowSplit[stateColumn] == "" || rowSplit[stateColumn] == "N/A" || rowSplit[stateColumn] == "_" || !rowSplit[stateColumn])
			cityInput.value = rowSplit[cityColumn];
		else
			cityInput.value = rowSplit[cityColumn] + ", " + rowSplit[stateColumn];
		cityDiv.classList.add('filled');
		cityInput.focus();
		
		// присваиваю страну
		const countrySelect = document.querySelector('[data-id="recipient.country"] div.select select') 
		const countryOption = document.querySelector('[data-id="recipient.country"] div.select select [value="' + getCountryCode(rowSplit[countryColumn]) + '"]') 
		
		countrySelect.options[countryOption.index].selected = true;
		countrySelect.dispatchEvent(new Event('change'));;
		countrySelect.focus();
		
	}
  }
});
