var TSOS;
(function (TSOS) {
    //pcb class for handling the PCB display updates
    class RAMdisplay {
        table;
        constructor(table = document.getElementById("Mem")) {
            this.table = table;
        }
        init() {
            this.table = document.getElementById("Mem");
            for (let i = 0; i <= _Memory.size; i += 8) {
                let row = document.createElement("tr");
                let address = document.createElement("th");
                address.innerText = TSOS.Utils.hexLog(i, true);
                row.appendChild(address);
                for (let j = 0; j < 8; j++) {
                    let cell = document.createElement("td");
                    cell.innerText = TSOS.Utils.hexLog(0x00, false);
                    row.appendChild(cell);
                }
                this.table.appendChild(row);
            }
        }
        updateDisplay() {
            for (let i = 0; i < _Memory.size; i++) {
                //calculate location of cell
                let row = Math.floor(i / 8);
                let column = i % 8;
                //update cell
                let cell = this.table.rows[row].cells[column + 1];
                cell.innerText = TSOS.Utils.hexLog(_Memory.ram[i], false);
            }
        }
    }
    TSOS.RAMdisplay = RAMdisplay;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=RAMdisplay.js.map