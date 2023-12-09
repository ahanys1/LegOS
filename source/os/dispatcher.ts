module TSOS {
    export class Dispatcher {
        constructor(public contextSwitching: boolean = false){}

        public completeContextSwitch() {
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

        public rollIn(){

        }

        public rollOut(){
            
        }
    }
}

