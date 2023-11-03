var TSOS;
(function (TSOS) {
    class PCB {
        PCBTable;
        runningPID;
        processes;
        constructor(PCBTable = document.getElementById("PCB"), runningPID = null, processes = {}) {
            this.PCBTable = PCBTable;
            this.runningPID = runningPID;
            this.processes = processes;
        }
        init() {
            this.PCBTable = document.getElementById("PCB");
            this.runningPID = null;
            this.processes = {};
        }
        addProgram(pid) {
            this.processes[pid] = {
                PC: 0,
                Acc: 0,
                IR: 0,
                Xreg: 0,
                Yreg: 0,
                Zflag: 0,
                Status: "Resident"
            };
            //handle display quickly
            //TODO: have table fill from dictionary
            const tableBody = document.getElementById("pcbBody");
            const process = this.processes[pid];
            const row = tableBody.insertRow();
            const cellPID = row.insertCell(0);
            const cellPC = row.insertCell(1);
            const cellAcc = row.insertCell(2);
            const cellIR = row.insertCell(3);
            const cellXreg = row.insertCell(4);
            const cellYreg = row.insertCell(5);
            const cellZflag = row.insertCell(6);
            const cellStatus = row.insertCell(7);
            cellPID.textContent = pid.toString();
            cellPC.textContent = process.PC.toString();
            cellAcc.textContent = TSOS.Utils.hexLog(process.Acc, false);
            cellIR.textContent = TSOS.Utils.hexLog(process.IR, false);
            cellXreg.textContent = TSOS.Utils.hexLog(process.Xreg, false);
            cellYreg.textContent = TSOS.Utils.hexLog(process.Yreg, false);
            cellZflag.textContent = TSOS.Utils.hexLog(process.Zflag, false);
            cellStatus.textContent = process.Status;
        }
        kickStart(pid) {
            this.runningPID = pid;
            _CPU.isExecuting = true;
            this.processes[pid].Status = "Running";
        }
        updateRunning() {
            //update dictinary first
            this.processes[this.runningPID].PC = _CPU.PC;
            this.processes[this.runningPID].Acc = _CPU.Acc;
            this.processes[this.runningPID].IR = _CPU.IR;
            this.processes[this.runningPID].Xreg = _CPU.Xreg;
            this.processes[this.runningPID].Yreg = _CPU.Yreg;
            this.processes[this.runningPID].Zflag = _CPU.Zflag;
            console.log(this.processes);
            //now update visuals
            let row = this.PCBTable.rows[(this.runningPID % 3) + 1];
            row.cells[1].innerHTML = this.processes[this.runningPID].PC.toString();
            row.cells[2].innerHTML = TSOS.Utils.hexLog(this.processes[this.runningPID].Acc, false);
            row.cells[3].innerHTML = TSOS.Utils.hexLog(this.processes[this.runningPID].IR, false);
            row.cells[4].innerHTML = TSOS.Utils.hexLog(this.processes[this.runningPID].Xreg, false);
            row.cells[5].innerHTML = TSOS.Utils.hexLog(this.processes[this.runningPID].Yreg, false);
            row.cells[6].innerHTML = TSOS.Utils.hexLog(this.processes[this.runningPID].Zflag, false);
            row.cells[7].innerHTML = this.processes[this.runningPID].Status;
            /*if (this.processes.hasOwnProperty(pid)) {
                const row = this.PCBTable.querySelector(`#pid-${pid}`) as HTMLTableRowElement;
                if (row) {
                    row.cells[1].textContent = process.PC.toString();
                    row.cells[2].textContent = Utils.hexLog(process.Acc, false);
                    row.cells[3].textContent = Utils.hexLog(process.IR, false);
                    row.cells[4].textContent = Utils.hexLog(process.Xreg, false);
                    row.cells[5].textContent = Utils.hexLog(process.Yreg, false);
                    row.cells[6].textContent = Utils.hexLog(process.Zflag, false);
                    row.cells[7].textContent = process.Status;
                }
            }*/
        }
        terminate() {
        }
    }
    TSOS.PCB = PCB;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=pcb.js.map