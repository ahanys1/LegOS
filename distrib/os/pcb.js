var TSOS;
(function (TSOS) {
    //ment for handling updates to the cpu display
    //this is very bare bones rn and my goal is to meet the requirements for credit
    class PCB {
        PCBTable;
        pZero;
        pOne;
        pTwo;
        runningPID;
        constructor(PCBTable = document.getElementById("PCB"), pZero = document.getElementById("pZero"), pOne = document.getElementById("pOne"), pTwo = document.getElementById("pTwo"), runningPID = null) {
            this.PCBTable = PCBTable;
            this.pZero = pZero;
            this.pOne = pOne;
            this.pTwo = pTwo;
            this.runningPID = runningPID;
        }
        init() {
            this.PCBTable = document.getElementById("PCB");
            this.pZero = document.getElementById("pZero");
            this.pOne = document.getElementById("pOne");
            this.pTwo = document.getElementById("pTwo");
            this.runningPID = null;
        }
        addProgram(pid) {
            if (pid == 0) {
                for (let i = 0; i < 7; i++) { //fill blank cells
                    let cell = this.pZero.insertCell();
                    switch (i) {
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
            else if (pid == 1) {
                for (let i = 0; i < 7; i++) { //fill blank cells
                    let cell = this.pOne.insertCell();
                    switch (i) {
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
            else if (pid == 2) {
                for (let i = 0; i < 7; i++) { //fill blank cells
                    let cell = this.pTwo.insertCell();
                    switch (i) {
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
        kickStart(pid) {
            _CPU.isExecuting = true;
            this.runningPID = pid;
        }
        updateAll(pid) {
            if (pid == 0) {
                this.pZero.cells.item(1).innerText = _CPU.PC.toString();
                this.pZero.cells.item(2).innerText = TSOS.Utils.hexLog(_CPU.Acc, false);
                this.pZero.cells.item(3).innerText = TSOS.Utils.hexLog(_CPU.IR, false);
                this.pZero.cells.item(4).innerText = TSOS.Utils.hexLog(_CPU.Xreg, false);
                this.pZero.cells.item(5).innerText = TSOS.Utils.hexLog(_CPU.Yreg, false);
                this.pZero.cells.item(6).innerText = TSOS.Utils.hexLog(_CPU.Zflag, false);
                if (_CPU.isExecuting) {
                    this.pZero.cells.item(7).innerText = "Running";
                }
                else {
                    this.pZero.cells.item(7).innerText = "Ready";
                }
            }
            else if (pid == 1) {
                //pid 1, will implement these later. Just want to get this done ASAP, and they're not required for now.
            }
            else if (pid == 2) {
                //pid 2
            }
        }
    }
    TSOS.PCB = PCB;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=pcb.js.map