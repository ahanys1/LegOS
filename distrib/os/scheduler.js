var TSOS;
(function (TSOS) {
    class Scheduler {
        readyQueue;
        quantum;
        constructor(readyQueue = new TSOS.Queue, quantum = 6 // Set the default quantum
        ) {
            this.readyQueue = readyQueue;
            this.quantum = quantum;
        }
        init() {
            this.readyQueue = new TSOS.Queue();
            this.quantum = 6;
        }
        schedule() {
            if (this.readyQueue.getSize() > 0) {
                const currentProcess = _PCB.processes[_PCB.runningPID];
                currentProcess.Status = "Ready";
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
            }
        }
        handleCPUBurst() {
            if (_PCB.runningPID !== null) {
                const currentProcess = _PCB.processes[_PCB.runningPID];
                currentProcess.PC = _CPU.PC;
                currentProcess.Acc = _CPU.Acc;
                currentProcess.IR = _CPU.IR;
                currentProcess.Xreg = _CPU.Xreg;
                currentProcess.Yreg = _CPU.Yreg;
                currentProcess.Zflag = _CPU.Zflag;
            }
            if (_PCB.runningPID === null || _CPU.PC === 0) {
                this.schedule();
            }
            else if (_CPU.PC % this.quantum === 0) {
                this.schedule();
            }
        }
        static contextSwitch() {
            // Trigger a context switch by generating a context switch interrupt
            if (!_Dispatcher.contextSwitching) {
                const interrupt = new TSOS.Interrupt(CONTEXT_SWITCH_IRQ, null);
                _KernelInterruptQueue.enqueue(interrupt);
                _Dispatcher.contextSwitching = true;
            }
        }
    }
    TSOS.Scheduler = Scheduler;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=scheduler.js.map