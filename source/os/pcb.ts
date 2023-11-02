module TSOS{
    //ment for handling updates to the cpu display
    //this is very bare bones rn and my goal is to meet the requirements for credit
    export class PCB{
        constructor(
            private PCBTable: HTMLTableElement = document.getElementById("PCB") as HTMLTableElement,
            private pZero: HTMLTableRowElement = document.getElementById("pZero") as HTMLTableRowElement,
            private pOne: HTMLTableRowElement = document.getElementById("pOne") as HTMLTableRowElement,
            private pTwo: HTMLTableRowElement = document.getElementById("pTwo") as HTMLTableRowElement,
            public runningPID: number = null
        ){}

        public init(): void {
            this.PCBTable = document.getElementById("PCB") as HTMLTableElement;
            this.pZero = document.getElementById("pZero") as HTMLTableRowElement;
            this.pOne = document.getElementById("pOne") as HTMLTableRowElement;
            this.pTwo = document.getElementById("pTwo") as HTMLTableRowElement;
            this.runningPID = null;
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
                            cell.innerText = "Resident";
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
                            cell.innerText = "Resident";
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
                            cell.innerText = "Resident";
                            break;
                    }
                }
            }
        }

        kickStart(pid: number){ //used for passing the running program and "kickstarting" the program
            _CPU.isExecuting = true;
            this.runningPID = pid;
        }

        public updateAll(pid: number){
            if (pid == 0){
                this.pZero.cells.item(1).innerText = _CPU.PC.toString();
                this.pZero.cells.item(2).innerText = Utils.hexLog(_CPU.Acc,false);
                this.pZero.cells.item(3).innerText = Utils.hexLog(_CPU.IR,false);
                this.pZero.cells.item(4).innerText = Utils.hexLog(_CPU.Xreg,false);
                this.pZero.cells.item(5).innerText = Utils.hexLog(_CPU.Yreg,false);
                this.pZero.cells.item(6).innerText = Utils.hexLog(_CPU.Zflag,false);
                if(_CPU.isExecuting){
                    this.pZero.cells.item(7).innerText = "Running";
                }else{
                    this.pZero.cells.item(7).innerText = "Ready";
                }
            } else if (pid == 1){
                //pid 1, will implement these later. Just want to get this done ASAP, and they're not required for now.
            } else if (pid == 2){
                //pid 2
            }
        }
    }
}