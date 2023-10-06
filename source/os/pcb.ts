module TSOS{
    //ment for handling updates to the cpu display
    export class PCB{
        constructor(
            private PCBTable: HTMLTableElement = document.getElementById("PCB") as HTMLTableElement,
            private pZero: HTMLTableRowElement = document.getElementById("pZero") as HTMLTableRowElement,
            private pOne: HTMLTableRowElement = document.getElementById("pOne") as HTMLTableRowElement,
            private pTwo: HTMLTableRowElement = document.getElementById("pTwo") as HTMLTableRowElement
        ){}

        public init(): void {
            this.PCBTable = document.getElementById("PCB") as HTMLTableElement;
            this.pZero = document.getElementById("pZero") as HTMLTableRowElement;
            this.pOne = document.getElementById("pOne") as HTMLTableRowElement;
            this.pTwo = document.getElementById("pTwo") as HTMLTableRowElement;
        }

        public addProgram(pid: number){
            if(pid == 0){
                for (let i = 0; i < 7; i++){ //fill blank cells
                    let cell = this.pZero.insertCell();
                    switch(i){
                        case 0:
                            cell.innerText = "0";
                            break;
                        case 1:
                        case 2:
                        case 3:
                        case 4:
                        case 5:    
                            cell.innerText = "0x00";
                            break;
                        case 6:
                            cell.innerText = "Ready";
                            break;
                    }
                }

            }else if (pid == 1){
                for (let i = 0; i < 7; i++){ //fill blank cells
                    let cell = this.pOne.insertCell();
                    switch(i){
                        case 0:
                            cell.innerText = "0";
                            break;
                        case 1:
                        case 2:
                        case 3:
                        case 4:
                        case 5:    
                            cell.innerText = "0x00";
                            break;
                        case 6:
                            cell.innerText = "Ready";
                            break;
                    }
                }

            }else if (pid == 2){
                for (let i = 0; i < 7; i++){ //fill blank cells
                    let cell = this.pTwo.insertCell();
                    switch(i){
                        case 0:
                            cell.innerText = "0";
                            break;
                        case 1:
                        case 2:
                        case 3:
                        case 4:
                        case 5:    
                            cell.innerText = "0x00";
                            break;
                        case 6:
                            cell.innerText = "Ready";
                            break;
                    }
                }
            }
        }

    }
}