module TSOS {
    export class Scheduler {
        

        constructor(
            public readyQueue: TSOS.Queue = new TSOS.Queue,
            private quantum: number = 6, // Set the default quantum
            public CQ: number = 1,
            public TurnaroundTime: number = 0,
            public finishedPIDs: number[] = [],
            public justTerminated: boolean = false,
            public scheduleAlgorithm: "rr" | "fcfs" | "priority" = "rr"
        ) {}

        public init(){
            this.readyQueue = new TSOS.Queue();
            this.quantum = 6; 
            this.CQ = 1;
            this.TurnaroundTime = 0;
            this.finishedPIDs = [];
            this.justTerminated = false;
            this.scheduleAlgorithm = "rr";
        }

        public schedule(): void {
            if (this.readyQueue.getSize() > 0) {
                const currentProcess = _PCB.processes[_PCB.runningPID];
                if (currentProcess.Status != "Terminated"){
                currentProcess.Status = "Ready";
                _PCB.updateStatusDisplay();
                }
                // Rotate the queue (move the current process to the back) only if one just wasn't terminated
                if (!this.justTerminated){
                    this.readyQueue.enqueue(this.readyQueue.dequeue());
                } else {
                    _Scheduler.justTerminated = false;
                }

                // Get the next process to run
                const nextProcess = this.readyQueue.peek();
                nextProcess.Status = "Running";
                _PCB.runningPID = nextProcess.PID;
                
                _CPU.isExecuting = true;
            } else { //done executing all programs
                _CPU.isExecuting = false;
                _Console.advanceLine();
                for (let i = 0; i < this.finishedPIDs.length; i++){
                    _PCB.processes[this.finishedPIDs[i]].LastTick++;
                    _Console.putText(`PID: ${this.finishedPIDs[i]}`);
                    _Console.advanceLine();
                    _Console.putText(`Turnaround Time: ${_PCB.processes[this.finishedPIDs[i]].LastTick} CPU cycles`);
                    _Console.advanceLine();
                    _Console.putText(`Wait time: ${_PCB.processes[this.finishedPIDs[i]].LastTick - _PCB.processes[this.finishedPIDs[i]].ExecutionLength} CPU cycles`);
                    _Console.advanceLine();
                    _Console.putText("------------------");
                    _Console.advanceLine();
                }
                // manage any artifacting in the disk from leftover processes
                for(const pid of this.finishedPIDs){
                    if (_krnDiskDriver.findFATEntry(`program${pid}.stud`)){
                        _krnDiskDriver.delete(`program${pid}.stud`);
                    }
                }
                
                _Console.putText("=C ");
                this.finishedPIDs = [];
                this.TurnaroundTime = 0;
                document.getElementById("runningGIF").style.visibility = "hidden";
                
                
            }
        }


        public handleCPUBurst(): void {
            if (_PCB.runningPID !== null) {
                _PCB.updateRunning();
            }
            this.CQ++;
            let dispCQ = document.getElementById("CQ");
            _PCB.processes[_PCB.runningPID].ExecutionLength++; 
            
            if (_PCB.runningPID === null  || this.CQ > this.quantum ) {
                this.CQ = 1;
                this.contextSwitch();
            }
            dispCQ.innerHTML = "CQ: " + this.CQ.toString();
        }
        public contextSwitch() {
            // Trigger a context switch by generating a context switch interrupt
            if (!_Dispatcher.contextSwitching) {
                const interrupt = new Interrupt(CONTEXT_SWITCH_IRQ, null);
                _KernelInterruptQueue.enqueue(interrupt);
                _Dispatcher.contextSwitching = true;
            }
        }

        public updateQuantum(q: number){
            this.quantum = q;
            let dispQ = document.getElementById("Quantum");
            if (this.scheduleAlgorithm == "rr"){
                dispQ.innerHTML = "Round Robin | Q: " + this.quantum.toString();
            } else {
                dispQ.innerHTML = "First-come First-serve";
            }
            
        }
    }

    
}
