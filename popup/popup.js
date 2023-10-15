import PresetsManager from './PresetsManager.js';

const presManager = new PresetsManager;

chrome.storage.local.get(['standartSaved'], function(result){
	if (!result.standartSaved) presManager.saveStandartSettings();
});

addPresButton.addEventListener('click', addPreset);
delPresButton.addEventListener('click', delPreset);
buttonSave.addEventListener('click', presManager.save);
checkboxName2.addEventListener('change', Name2Check);
selectFile.addEventListener('change', FilePreset);

document.getElementById('name_number').addEventListener('input', charCheck);
document.getElementById('street_number').addEventListener('input', charCheck);
document.getElementById('zip_number').addEventListener('input', charCheck);
document.getElementById('city_number').addEventListener('input', charCheck);
document.getElementById('state_number').addEventListener('input', charCheck);
document.getElementById('country_number').addEventListener('input', charCheck);
document.getElementById('name2_number').addEventListener('input', charCheck);

LoadLastSet();

setSelectOpts();

function addPreset(){
	let presName = prompt("Please, enter preset name(without spaces, or kirilic letters)", "Example_0321_blabla");
	
	presManager.add(presName);
	
	var opt = document.createElement('option');
	opt.value = presName;
	opt.innerHTML = presName;
	selectFile.appendChild(opt);
	selectFile.value = presName;
}

function delPreset(){
	presManager.delete(selectFile.value);

	selectFile.removeChild(selectFile.querySelector('[value="' + selectFile.value + '"]'));

	selectFile.value = "last_settings";
	LoadLastSet();	
}

function setSelectOpts(){
	chrome.storage.local.get(
		'presets', 
	function(result) {
		var presNamesArr = Object.keys(result.presets);
		
		for(let i = 0; i < presNamesArr.length; i++){
			let opt = document.createElement('option');
			opt.value = presNamesArr[i];
			opt.innerHTML = presNamesArr[i];
			selectFile.appendChild(opt);
		}
	});
}

function charCheck(){
	if ((/[A-Za-z]/g.test(this.value)))
		this.value = this.value.toUpperCase();
	else 
		this.value = '';
}

function Name2Check(){
	if (checkboxName2.checked)
		numberName2.disabled = false;
	else {
		numberName2.disabled = true;
		numberName2.value = "";
	}
}

function FilePreset() {
	if (selectFile.value == "last_settings"){
		LoadLastSet()
	} else {
		chrome.storage.local.get(
			'presets', 
		function(result){
			document.getElementById('name_number').value = result.presets[selectFile.value].firstName; 
			document.getElementById('street_number').value = result.presets[selectFile.value].street;
			document.getElementById('zip_number').value = result.presets[selectFile.value].zip;
			document.getElementById('city_number').value = result.presets[selectFile.value].city;
			document.getElementById('state_number').value = result.presets[selectFile.value].state;
			document.getElementById('country_number').value = result.presets[selectFile.value].country;
			
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

function LoadLastSet(){
	chrome.storage.local.get("savedPres", function(result) {
		document.getElementById('name_number').value = result.savedPres["firstName"];
		document.getElementById('street_number').value = result.savedPres["street"];
		document.getElementById('zip_number').value = result.savedPres["zip"];
		document.getElementById('city_number').value = result.savedPres["city"];
		document.getElementById('state_number').value = result.savedPres["state"];
		document.getElementById('country_number').value = result.savedPres["country"];
		
		if (result.savedPres["secondName"] != "") {
			numberName2.value = result.savedPres["secondName"];
			numberName2.disabled = false;
			checkboxName2.checked = true;
		}
	});
}