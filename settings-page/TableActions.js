export default class TableActions {

    constructor(tableBody, tableTabId) {
        this.valuesArr = [];
        this.tableBody = tableBody;
        document.querySelector(`body > div.${tableTabId}.tab-content > div > div > div > div:last-child > button`)
            .addEventListener("click", () => this.addRow());
    }

    fill(newArr) {
        this.valuesArr = newArr;
        const tb = this.tableBody;
        tb.textContent = '';
        this.valuesArr.forEach(char => {
            tb.appendChild(this.buildNewRow(char));
        });
    }

    addRow() {
        const row = this.buildNewRow("x");
        this.tableBody.appendChild(row);
        this.editRow(row);
    }

    saveRow(row) {
        while (row.nodeName != "TR") { 
            row = row.parentNode;
        }
        const char = row.firstChild.value;
        row.firstChild.remove();
        row.querySelector("a.add").classList.add("hidden");
        row.querySelector("a.edit").classList.remove("hidden");

        const tableCharCell = document.createElement("td");
        tableCharCell.appendChild(document.createTextNode(char));
        
        this.valuesArr.splice(Array.prototype.indexOf.call(row.parentNode.children, row), 1, char);

        console.log(this.valuesArr);
        
        row.insertBefore(tableCharCell, row.firstChild);
    }

    editRow(row) {
        while (row.nodeName != "TR") { 
            row = row.parentNode;
        }
        const char = row.firstChild.innerHTML;
        row.firstChild.remove();
        row.querySelector("a.edit").classList.add("hidden");
        row.querySelector("a.add").classList.remove("hidden");

        const inputChar = document.createElement("input");
        inputChar.type = "text";
        inputChar.classList.add("form-control");
        inputChar.value = char;
        
        row.insertBefore(inputChar, row.firstChild);
    }

    deleteRow(row) {
        while (row.nodeName != "TR") { 
            row = row.parentNode;
        }
        const index = this.valuesArr.indexOf(row.firstChild.innerHTML || row.firstChild.value);
        if (index > -1) {
            this.valuesArr.splice(index, 1); 
        }
        console.log(this.valuesArr);
        row.remove();
    }

    buildNewRow(char) {
        const tableRow = document.createElement("tr");
        const tableButtonsCell = document.createElement("td");
        const tableCharCell = document.createElement("td");

        const addButton = document.createElement("a");
        const editButton = document.createElement("a");
        const deleteButton = document.createElement("a");

        const node = document.createTextNode(char);
        tableCharCell.appendChild(node);

        addButton.classList.add("add", "hidden");
        addButton.innerHTML = '<i class="material-icons">&#xE03B;</i>';
        editButton.classList.add("edit");
        editButton.innerHTML = '<i class="material-icons">&#xE254;</i>';
        deleteButton.classList.add("delete");
        deleteButton.innerHTML = '<i class="material-icons">&#xE872;</i>';

        addButton.addEventListener('click', (event) => this.saveRow(event.target));
        editButton.addEventListener('click', (event) => this.editRow(event.target));
        deleteButton.addEventListener('click', (event) => this.deleteRow(event.target));

        tableButtonsCell.appendChild(addButton);
        tableButtonsCell.appendChild(editButton);
        tableButtonsCell.appendChild(deleteButton);

        tableRow.appendChild(tableCharCell);
        tableRow.appendChild(tableButtonsCell);

        return tableRow;
    }
}