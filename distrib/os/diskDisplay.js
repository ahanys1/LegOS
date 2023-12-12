var TSOS;
(function (TSOS) {
    class diskDisplay {
        diskTableBody;
        constructor(diskTableBody = document.getElementById("diskTableBody")) {
            this.diskTableBody = diskTableBody;
        }
        // if I get the time, this update function is how I want to do all the update functions for the displays.
        update() {
            //first, clear the table
            this.diskTableBody.innerHTML = "";
            // then, populate the table with the session storage
            for (const key of _krnDiskDriver.orderedKeys) {
                const value = sessionStorage.getItem(key);
                // create the rows and cells
                const row = document.createElement("tr");
                const keyCell = document.createElement("td");
                const occupiedCell = document.createElement("td");
                const nextCell = document.createElement("td");
                const dataCell = document.createElement("td");
                //set the cell content
                keyCell.innerHTML = key;
                dataCell.innerHTML = value.substring(8);
                if (value.substring(0, 2) === "01") {
                    occupiedCell.innerHTML = "&#10004;";
                }
                else {
                    occupiedCell.innerHTML = "&#8901;";
                }
                occupiedCell.style.textAlign = "center";
                nextCell.innerHTML = `${value.substring(3, 4)}.${value.substring(5, 6)}.${value.substring(7, 8)}`;
                row.appendChild(keyCell);
                row.appendChild(occupiedCell);
                row.appendChild(nextCell);
                row.appendChild(dataCell);
                /*
                if (parseInt(key[4]) % 2 == 0){ //every other row make grey
                    row.style.backgroundColor = "#dfdfdf";
                }*/
                //append row to table
                this.diskTableBody.appendChild(row);
            }
        }
    }
    TSOS.diskDisplay = diskDisplay;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=diskDisplay.js.map