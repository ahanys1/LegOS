var TSOS;
(function (TSOS) {
    //ment for handling updates to the cpu display
    class PCB {
        PCBTable;
        pZero;
        pOne;
        pTwo;
        constructor(PCBTable = document.getElementById("PCB"), pZero = document.getElementById("pZero"), pOne = document.getElementById("pOne"), pTwo = document.getElementById("pTwo")) {
            this.PCBTable = PCBTable;
            this.pZero = pZero;
            this.pOne = pOne;
            this.pTwo = pTwo;
        }
        init() {
            this.PCBTable = document.getElementById("PCB");
            this.pZero = document.getElementById("pZero");
            this.pOne = document.getElementById("pOne");
            this.pTwo = document.getElementById("pTwo");
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
                            cell.innerText = "Ready";
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
                            cell.innerText = "Ready";
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
                            cell.innerText = "Ready";
                            break;
                    }
                }
            }
        }
    }
    TSOS.PCB = PCB;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=pcb.js.map