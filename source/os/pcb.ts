module TSOS{
    //ment for handling updates to the cpu display
    //this is very bare bones rn and my goal is to meet the requirements for credit
    interface ProcessInfo{
        PC: number;
        Acc: number;
        IR: number;
        Xreg: number;
        Yreg: number;
        Zflag: number;
        Status: string;
    }

    export class PCB{
        constructor(
            private PCBTable: HTMLTableElement = document.getElementById("PCB") as HTMLTableElement,
            public runningPID: number = null,
            public processes: {[PID: number]: ProcessInfo} = {}
        ){}

        public init(): void {
            this.PCBTable = document.getElementById("PCB") as HTMLTableElement;
            this.runningPID = null;
            this.processes = {};
        }

        public addProgram(pid: number){
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
            const tableBody = document.getElementById("pcbBody") as HTMLTableElement;
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
            cellAcc.textContent = Utils.hexLog(process.Acc, false);
            cellIR.textContent = Utils.hexLog(process.IR, false);
            cellXreg.textContent = Utils.hexLog(process.Xreg, false);
            cellYreg.textContent = Utils.hexLog(process.Yreg, false);
            cellZflag.textContent = Utils.hexLog(process.Zflag, false);
            cellStatus.textContent = process.Status;
        }

        kickStart(pid: number){ //used for passing the running program and "kickstarting" the program
            this.runningPID = pid;
            _CPU.isExecuting = true;
            this.processes[pid].Status = "Running";
        }

        public updateRunning() {
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
            row.cells[2].innerHTML = Utils.hexLog(this.processes[this.runningPID].Acc, false);
            row.cells[3].innerHTML = Utils.hexLog(this.processes[this.runningPID].IR, false);
            row.cells[4].innerHTML = Utils.hexLog(this.processes[this.runningPID].Xreg, false);
            row.cells[5].innerHTML = Utils.hexLog(this.processes[this.runningPID].Yreg, false);
            row.cells[6].innerHTML = Utils.hexLog(this.processes[this.runningPID].Zflag, false);
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

        public terminate(){

        }
    }
}