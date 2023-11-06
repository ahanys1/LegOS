var TSOS;
(function (TSOS) {
    class Scheduler {
        readyQueue;
        quantum;
        CQ;
        TurnaroundTime;
        finishedPIDs;
        justTerminated;
        constructor(readyQueue = new TSOS.Queue, quantum = 6, // Set the default quantum
        CQ = 1, TurnaroundTime = 0, finishedPIDs = [], justTerminated = false) {
            this.readyQueue = readyQueue;
            this.quantum = quantum;
            this.CQ = CQ;
            this.TurnaroundTime = TurnaroundTime;
            this.finishedPIDs = finishedPIDs;
            this.justTerminated = justTerminated;
        }
        init() {
            this.readyQueue = new TSOS.Queue();
            this.quantum = 6;
            this.CQ = 1;
            this.TurnaroundTime = 0;
            this.finishedPIDs = [];
            this.justTerminated = false;
        }
        schedule() {
            if (this.readyQueue.getSize() > 0) {
                const currentProcess = _PCB.processes[_PCB.runningPID];
                if (currentProcess.Status != "Terminated") {
                    currentProcess.Status = "Ready";
                    _PCB.updateStatusDisplay();
                }
                // Rotate the queue (move the current process to the back) only if one just wasn't terminated
                if (!this.justTerminated) {
                    this.readyQueue.enqueue(this.readyQueue.dequeue());
                }
                else {
                    _Scheduler.justTerminated = false;
                }
                // Get the next process to run
                const nextProcess = this.readyQueue.peek();
                nextProcess.Status = "Running";
                _PCB.runningPID = nextProcess.PID;
                _CPU.isExecuting = true;
            }
            else { //done executing all programs
                _CPU.isExecuting = false;
                _Console.advanceLine();
                for (let i = 0; i < this.finishedPIDs.length; i++) {
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
                _Console.putText("=C ");
                this.finishedPIDs = [];
                this.TurnaroundTime = 0;
            }
        }
        handleCPUBurst() {
            if (_PCB.runningPID !== null) {
                _PCB.updateRunning();
            }
            this.CQ++;
            let dispCQ = document.getElementById("CQ");
            _PCB.processes[_PCB.runningPID].ExecutionLength++;
            if (_PCB.runningPID === null || this.CQ > this.quantum) {
                this.CQ = 1;
                this.contextSwitch();
            }
            dispCQ.innerHTML = "CQ: " + this.CQ.toString();
        }
        contextSwitch() {
            // Trigger a context switch by generating a context switch interrupt
            if (!_Dispatcher.contextSwitching) {
                const interrupt = new TSOS.Interrupt(CONTEXT_SWITCH_IRQ, null);
                _KernelInterruptQueue.enqueue(interrupt);
                _Dispatcher.contextSwitching = true;
            }
        }
        updateQuantum(q) {
            this.quantum = q;
            let dispQ = document.getElementById("Quantum");
            dispQ.innerHTML = "Quantum: " + this.quantum.toString();
        }
    }
    TSOS.Scheduler = Scheduler;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=scheduler.js.map