var TSOS;
(function (TSOS) {
    class Dispatcher {
        contextSwitching;
        constructor(contextSwitching = false) {
            this.contextSwitching = contextSwitching;
        }
        completeContextSwitch() {
            // Perform the context switch
            if (this.contextSwitching) {
                // Save the current CPU state to the PCB of the running process
                _PCB.updateRunning();
                // Switch to the next process
                _Scheduler.schedule();
                // Load the CPU state of the new running process
                _CPU.PC = _PCB.processes[_PCB.runningPID].PC;
                _CPU.Acc = _PCB.processes[_PCB.runningPID].Acc;
                _CPU.Xreg = _PCB.processes[_PCB.runningPID].Xreg;
                _CPU.Yreg = _PCB.processes[_PCB.runningPID].Yreg;
                _CPU.Zflag = _PCB.processes[_PCB.runningPID].Zflag;
                // Update the CPU display
                _CPUdisplay.updateAll();
                this.contextSwitching = false;
            }
        }
        rollIn() {
        }
        rollOut() {
        }
    }
    TSOS.Dispatcher = Dispatcher;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=dispatcher.js.map