var TSOS;
(function (TSOS) {
    class Scheduler {
        readyQueue;
        quantum;
        CQ;
        constructor(readyQueue = new TSOS.Queue, quantum = 6, // Set the default quantum
        CQ = 1) {
            this.readyQueue = readyQueue;
            this.quantum = quantum;
            this.CQ = CQ;
        }
        init() {
            this.readyQueue = new TSOS.Queue();
            this.quantum = 6;
            this.CQ = 1;
        }
        schedule() {
            if (this.readyQueue.getSize() > 0) {
                const currentProcess = _PCB.processes[_PCB.runningPID];
                if (currentProcess.Status != "Terminated") {
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
            }
            else {
                _CPU.isExecuting = false;
                _Console.advanceLine();
                _Console.putText("=C ");
            }
        }
        handleCPUBurst() {
            if (_PCB.runningPID !== null) {
                _PCB.updateRunning();
            }
            this.CQ++;
            let dispCQ = document.getElementById("CQ");
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
            dispQ.innerHTML = this.quantum.toString();
        }
    }
    TSOS.Scheduler = Scheduler;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=scheduler.js.map