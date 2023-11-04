module TSOS {
    export class Scheduler {
        

        constructor(
            public readyQueue: TSOS.Queue = new TSOS.Queue,
            private quantum: number = 6, // Set the default quantum
            public CQ: number = 1
        ) {}

        public init(){
            this.readyQueue = new TSOS.Queue();
            this.quantum = 6; 
            this.CQ = 1;
        }

        public schedule(): void {
            if (this.readyQueue.getSize() > 0) {
                const currentProcess = _PCB.processes[_PCB.runningPID];
                if (currentProcess.Status != "Terminated"){
                currentProcess.Status = "Ready";
                _PCB.updateStatusDisplay();
            }
                // Rotate the queue (move the current process to the back)
                this.readyQueue.enqueue(this.readyQueue.dequeue());

                // Get the next process to run
                const nextProcess = this.readyQueue.peek();
                nextProcess.Status = "Running";
                _PCB.runningPID = nextProcess.PID;
                
                _CPU.isExecuting = true;
            } else {
                _CPU.isExecuting = false;
                _Console.advanceLine();
                _Console.putText("=C ");
            }
        }


        public handleCPUBurst(): void {
            if (_PCB.runningPID !== null) {
                _PCB.updateRunning();
            }
            this.CQ++;
            let dispCQ = document.getElementById("CQ");
            
            if (_PCB.runningPID === null  || this.CQ > this.quantum) {
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
            dispQ.innerHTML = "Quantum: " + this.quantum.toString();
        }
    }
    
}
