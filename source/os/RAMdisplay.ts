module TSOS{
    //pcb class for handling the PCB display updates
    export class RAMdisplay{
        constructor(
            private table:HTMLTableElement = document.getElementById("Mem") as HTMLTableElement
        ){}

        public init(): void { //this is inspired by KeedOS. Should get executed when this is init
            this.table = document.getElementById("Mem") as HTMLTableElement;

            for (let i = 0; i <= _Memory.size; i += 8){
                let row = document.createElement("tr");
                let address = document.createElement("th");
                address.innerText = Utils.hexLog(i, true);
                row.appendChild(address);

                for(let j = 0; j < 8; j++){
                    let cell = document.createElement("td");
                    cell.innerText = Utils.hexLog(0x00, false);
                    row.appendChild(cell);
                }

                this.table.appendChild(row);
            }
        }

        public updateDisplay(){ //should in theory update the entire table
            for (let i = 0; i < _Memory.size; i++) {
                //calculate location of cell
                let row = Math.floor(i/8); 
                let column = i % 8;
                
                //update cell
                let cell = this.table.rows[row].cells[column + 1];
                cell.innerText = Utils.hexLog(_Memory.ram[i], false);
            }
        }
    }
} 