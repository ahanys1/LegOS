module TSOS{
    interface ProcessInfo{ //look, I realized after I went down this rabbit hole that there was a far better (and probably more correct) way to do this. 
        PID: number;       //instead of making a new PCB for each program, I create a new entry in my PCB's Dictionary of all the programs.
        Priority: number;  //Functionally, this produces the exact same result. If you're wondering where I got this idea, I used a lot of dictionaries at my internship this past summer.
        Location: "Memory" | "Disk";
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
        ExecutionLength: number;
        LastTick: number;
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
            if (segment >= 0){ //segment is -1 if it is loaded to the disk
                if (segment == 0){
                    base = 0;
                } else if (segment == 1){
                    base = 256;
                } else if (segment == 2){
                    base = 512;
                }
                this.processes[pid] = {
                    PID: pid,
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
                    Status: "Resident",
                    ExecutionLength: 0,
                    LastTick: 0
                };
            } else {
                this.processes[pid] = {
                    PID: pid,
                    Priority: 8,
                    Location: "Disk",
                    Segment: NaN,
                    Base: NaN,
                    Limit: NaN,
                    PC: 0,
                    Acc: 0,
                    IR: 0,
                    Xreg: 0,
                    Yreg: 0,
                    Zflag: 0,
                    Status: "Resident",
                    ExecutionLength: 0,
                    LastTick: 0
                };
            }
            

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
            //console.log(this.processes);
            
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

        public terminate(pid: number){
            this.processes[pid].Status = "Terminated";
            let row = this.PCBTable.rows[pid + 1] as HTMLTableRowElement;
            row.cells[12].innerHTML = this.processes[pid].Status;
            _MA.deleteProgram(this.processes[pid].Segment);
            _Scheduler.readyQueue.dequeue();
            this.updateRunning();
            _Scheduler.CQ == 1;
            _Scheduler.contextSwitch();
            _CPUdisplay.updateAll();
            _RAMdisplay.updateDisplay();
            _StdOut.advanceLine();
            _StdOut.putText(`Process ${pid} Terminated.`);
            _StdOut.advanceLine();
        }

        public terminateAll(){
            for (const pid in this.processes){
                this.processes[pid].Status = "Terminated";
                let row = this.PCBTable.rows[parseInt(pid)+1] as HTMLTableRowElement;
                row.cells[12].innerHTML = this.processes[pid].Status;
            }
        }

        public updateStatusDisplay(){ //depreciated
            let row = this.PCBTable.rows[this.runningPID + 1];
            row.cells[12].innerHTML = this.processes[this.runningPID].Status;
        }

        public updateAll() { //I was lazy. ChatGPT gave me a bugged version of this but I fixed it. 
            // Iterate through each process in the dictionary
            for (const pid in this.processes) {
                const process = this.processes[pid];
                const row = this.PCBTable.rows[parseInt(pid) + 1] as HTMLTableRowElement;

                // Update each cell in the row
                row.cells[0].textContent = process.PID.toString();
                row.cells[1].textContent = process.Priority.toString();
                row.cells[2].textContent = process.Location;
                row.cells[3].textContent = process.Segment.toString();
                row.cells[4].textContent = Utils.hexLog(process.Base, true);
                row.cells[5].textContent = Utils.hexLog(process.Limit, true);
                row.cells[6].textContent = process.PC.toString();
                row.cells[7].textContent = Utils.hexLog(process.Acc, false);
                row.cells[8].textContent = Utils.hexLog(process.IR, false);
                row.cells[9].textContent = Utils.hexLog(process.Xreg, false);
                row.cells[10].textContent = Utils.hexLog(process.Yreg, false);
                row.cells[11].textContent = Utils.hexLog(process.Zflag, false);
                row.cells[12].textContent = process.Status;
            }
        }
        
    }
}