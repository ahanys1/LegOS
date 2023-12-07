var TSOS;
(function (TSOS) {
    class diskDisplay {
        diskTableBody;
        constructor(diskTableBody = document.getElementById("diskTableBody")) {
            this.diskTableBody = diskTableBody;
        }
        update() {
            //first, clear the table
            this.diskTableBody.innerHTML = "";
            // then, populate the table with the session storage
            for (const key of _krnDiskDriver.orderedKeys) {
                const value = sessionStorage.getItem(key);
                // create the rows and cells
                const row = document.createElement("tr");
                const keyCell = document.createElement("td");
                const dataCell = document.createElement("td");
                //set the cell content
                keyCell.innerHTML = key;
                dataCell.innerHTML = value;
                row.appendChild(keyCell);
                row.appendChild(dataCell);
                if (parseInt(key[4]) % 2 == 0) { //every other row make grey
                    row.style.backgroundColor = "#dfdfdf";
                }
                //append row to table
                this.diskTableBody.appendChild(row);
            }
        }
    }
    TSOS.diskDisplay = diskDisplay;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=diskDisplay.js.map