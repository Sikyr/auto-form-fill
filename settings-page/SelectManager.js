export default class SelectManager {

    options = {};

    constructor(select, tableManager, plusBtn, minusBtn) {
        this.select = select;
        this.tableManager = tableManager;
        select.addEventListener('change', () => this.tableFill());
        plusBtn.addEventListener('click', () => this.addOption());
        minusBtn.addEventListener('click', () => this.deleteOption());
    }

    refresh(options) {
        this.options = options;
        for (const option in options) {
            let optionEl = document.createElement("option");
            optionEl.value = option;
            optionEl.innerHTML = option;
            this.select.appendChild(optionEl);
        }
        this.select.value = this.select.querySelectorAll('option')[0].value;
        this.tableFill();
    }

    tableFill() {
        document.querySelector("body > div.country-codes.tab-content > div > div:nth-child(2) > div > div.col-sm-10 > center > h2")
            .innerHTML = this.select.value;
        this.tableManager.fill(this.options[this.select.value].names);
    }

    addOption() {
        const name = prompt("Please, enter the name of the country", "TestCountry");
        const codeSlov = prompt("Please, enter the code for slovakian website(2 digits)", "tc");
        const codePol = prompt("Please, enter the code for polish website(number)", "47");
        let option = document.createElement("option");
        option.value = name;
        option.innerHTML = name;
        this.options[name] = {
            "codeSlov": codeSlov,
            "codePol": codePol,
            "names": [name, code]
        }
        this.select.appendChild(option);
        this.select.value = option.value;
        this.tableFill();
    }

    deleteOption() {
        let selectedOption = this.select.options[this.select.selectedIndex];
        delete this.options[selectedOption.value];
        this.select.remove(this.select.selectedIndex);
        this.select.value = this.select.options[0].value;
        this.tableFill();
    }
}