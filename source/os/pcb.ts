module TSOS{
    interface ProcessInfo{
        Priority: number;
        Location: string;
        Segment: number;
        Base: number;
        Limit: number;
        PC: number;
        Acc: number;
        IR: number;
        Xreg: number;
        Yreg: number;
        Zflag: number;
        Status: "Resident" | "Ready" | "Running" | "Terminated";
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

        public addProgram(pid: number, segment: number){//creates an entry for the new program, give it resident status
            let base: number;
            if (segment == 0){
                base = 0;
            } else if (segment == 1){
                base = 256;
            } else if (segment == 2){
                base = 512;
            }
            this.processes[pid] = {
                Priority: 8,
                Location: "Memory",
                Segment: segment,
                Base: base,
                Limit: base + 255,
                PC: 0,
                Acc: 0,
                IR: 0,
                Xreg: 0,
                Yreg: 0,
                Zflag: 0,
                Status: "Resident"
            };

            //create a new row in the display
            const tableBody = document.getElementById("pcbBody") as HTMLTableElement;
            const row = tableBody.insertRow();
            const cellPID = row.insertCell(0);
            const cellPriority = row.insertCell(1);
            const cellLocation = row.insertCell(2);
            const cellSegment = row.insertCell(3);
            const cellBase = row.insertCell(4);
            const cellLimit = row.insertCell(5);
            const cellPC = row.insertCell(6);
            const cellAcc = row.insertCell(7);
            const cellIR = row.insertCell(8);
            const cellXreg = row.insertCell(9);
            const cellYreg = row.insertCell(10);
            const cellZflag = row.insertCell(11);
            const cellStatus = row.insertCell(12);

            cellPriority.textContent = this.processes[pid].Priority.toString();
            cellLocation.textContent = this.processes[pid].Location;
            cellSegment.textContent = this.processes[pid].Segment.toString();
            cellBase.textContent = Utils.hexLog(this.processes[pid].Base, true);
            cellLimit.textContent = Utils.hexLog(this.processes[pid].Limit, true);
            cellPID.textContent = pid.toString();
            cellPC.textContent = this.processes[pid].PC.toString();
            cellAcc.textContent = Utils.hexLog(this.processes[pid].Acc, false);
            cellIR.textContent = Utils.hexLog(this.processes[pid].IR, false);
            cellXreg.textContent = Utils.hexLog(this.processes[pid].Xreg, false);
            cellYreg.textContent = Utils.hexLog(this.processes[pid].Yreg, false);
            cellZflag.textContent = Utils.hexLog(this.processes[pid].Zflag, false);
            cellStatus.textContent = this.processes[pid].Status;
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
            let row = this.PCBTable.rows[this.runningPID + 1];
            row.cells[6].innerHTML = this.processes[this.runningPID].PC.toString();
            row.cells[7].innerHTML = Utils.hexLog(this.processes[this.runningPID].Acc, false);
            row.cells[8].innerHTML = Utils.hexLog(this.processes[this.runningPID].IR, false);
            row.cells[9].innerHTML = Utils.hexLog(this.processes[this.runningPID].Xreg, false);
            row.cells[10].innerHTML = Utils.hexLog(this.processes[this.runningPID].Yreg, false);
            row.cells[11].innerHTML = Utils.hexLog(this.processes[this.runningPID].Zflag, false);
            row.cells[12].innerHTML = this.processes[this.runningPID].Status;
        }

        public terminate(){
            this.processes[this.runningPID].Status = "Terminated";
            _MA.deleteProgram(this.processes[this.runningPID].Segment);
            this.updateRunning();
        }
    }
}