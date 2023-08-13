import PresetsManager from './PresetsManager.js';

const presManager = new PresetsManager;

// даю обработчики кнопкам, чекбоксу и селекту
addPresButton.addEventListener('click', addPreset);
delPresButton.addEventListener('click', delPreset);
buttonSave.addEventListener('click', SaveButton);
checkboxName2.addEventListener('change', Name2Check);
selectFile.addEventListener('change', FilePreset);

// даю обработчики для фильтрации полям вводам
document.getElementById('name_number').addEventListener('input', charCheck);
document.getElementById('street_number').addEventListener('input', charCheck);
document.getElementById('zip_number').addEventListener('input', charCheck);
document.getElementById('city_number').addEventListener('input', charCheck);
document.getElementById('state_number').addEventListener('input', charCheck);
document.getElementById('country_number').addEventListener('input', charCheck);
document.getElementById('name2_number').addEventListener('input', charCheck);

// запускаю заполнение пресета настройками из кукисов
LoadLastSet();

setSelectOpts();

// запускаю функцию "при запуске"
onLoad();

// проверка на сохранение стандартного набора пресетов
chrome.storage.local.get(['standartSaved'], function(result){
	if (!result.standartSaved) presManager.saveStandartSettings();
});

// добавление нового пресета 
function addPreset(){
	// запрашиваю имя пресета
	let presName = prompt("Please, enter preset name(without spaces, or kirilic letters)", "Example_0321_blabla");
	
	// запрашиваю объект персетов и запускаю функцию
	presManager.add(presName);
	
	// Добавляю его в селект
	var opt = document.createElement('option');
	opt.value = presName;
	opt.innerHTML = presName;
	selectFile.appendChild(opt);
	selectFile.value = presName;
}

// удаление выбраного пресета
function delPreset(){
	presManager.delete(selectFile.value);

	selectFile.removeChild(selectFile.querySelector('[value="' + selectFile.value + '"]'));

	selectFile.value = "last_settings";
	LoadLastSet();	
}

// функция заполнения селекта опциями по сохранённым пресетам
function setSelectOpts(){
	// запрашиваю список пресетов
	chrome.storage.local.get(
		'presets', 
	function(result) {
		// массив названий пресетов
		var presNamesArr = Object.keys(result.presets);
		
		// заполняю селект но названиям
		for(let i = 0; i < presNamesArr.length; i++){
			let opt = document.createElement('option');
			opt.value = presNamesArr[i];
			opt.innerHTML = presNamesArr[i];
			selectFile.appendChild(opt);
		}
	});
}

// проверка на регистр и символ
function charCheck(){
	if ((/[A-Za-z]/g.test(this.value)))
		this.value = this.value.toUpperCase();
	else 
		this.value = '';
}

// Выбор чека с двумя именами
function Name2Check(){
	if (checkboxName2.checked)
		// включаю поле если отмечен чекбокс
		numberName2.disabled = false;
	else {
		// включаю и чищу поле если не отмечен чекбокс
		numberName2.disabled = true;
		numberName2.value = "";
	}
}

// нажатие кнопки сохранить
function SaveButton() {

	// считываю инпуты и сохраняю данные в хранилище
	chrome.storage.local.set({
		'cname': document.getElementById('name_number').value,
		'cname2': numberName2.value,
		'cstreet': document.getElementById('street_number').value,
		'czip': document.getElementById('zip_number').value, 
		'ccity': document.getElementById('city_number').value,
		'cstate': document.getElementById('state_number').value, 
		'ccountry': document.getElementById('country_number').value
	}, function() {
		// просто уведомляю о сохранении данных
		alert("Data saved");
	});
}	

// работа с пресетами файлов
function FilePreset() {
	// последние настройки
	if(selectFile.value == "last_settings"){
		LoadLastSet()
	}else{
		// запрос по айди пресета
		chrome.storage.local.get(
			'presets', 
		function(result){
			// присваивание полей попапам по данным пресета из бд
			document.getElementById('name_number').value = result.presets[selectFile.value].fisrtName; 
			document.getElementById('street_number').value = result.presets[selectFile.value].street;
			document.getElementById('zip_number').value = result.presets[selectFile.value].zip;
			document.getElementById('city_number').value = result.presets[selectFile.value].city;
			document.getElementById('state_number').value = result.presets[selectFile.value].state;
			document.getElementById('country_number').value = result.presets[selectFile.value].country;
			
			// проверка на 2 имени
			if (result.presets[selectFile.value].secondName){
				numberName2.value = result.presets[selectFile.value].secondName;
				numberName2.disabled = false;
				checkboxName2.checked = true;
			} else {
				numberName2.value = "";
				numberName2.disabled = true;
				checkboxName2.checked = false;
			}
		});
	}
}	

// получаю последние настройки из кукисов 
function LoadLastSet(){
	chrome.storage.local.get(
	['cname', 'cname2', 'cstreet', 'czip', 'ccity', 'cstate', 'ccountry'], 
	function(result) {
		// заполняю инпуты данными из кукисов
		document.getElementById('name_number').value = result.cname;
		document.getElementById('street_number').value = result.cstreet;
		document.getElementById('zip_number').value = result.czip;
		document.getElementById('city_number').value = result.ccity;
		document.getElementById('state_number').value = result.cstate;
		document.getElementById('country_number').value = result.ccountry;
		
		// проверка на двойное имя
		if (result.cname2 != "") {
			numberName2.value = result.cname2;
			numberName2.disabled = false;
			checkboxName2.checked = true;
		}
	});
}