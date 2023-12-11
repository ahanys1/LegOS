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
                let prevPID = _PCB.runningPID;
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
                // if the new process is in the disk instead of the memory, roll out then roll in
                if (_PCB.processes[_PCB.runningPID].Location === "Disk" && _PCB.processes[_PCB.runningPID].Status != "Terminated") {
                    let rollOutProcess = _MA.readWholeProgram(_PCB.processes[prevPID].Segment); //gets the whole program as a string
                    let prevSegment = this.rollOut(rollOutProcess, prevPID);
                    this.rollIn(_PCB.runningPID, prevSegment);
                }
                _CPUdisplay.updateAll();
                this.contextSwitching = false;
            }
        }
        // rolls out of memory and into disk
        rollOut(process, pid) {
            console.log(`Rolling out PID: ${pid} from segment: ${_PCB.processes[pid].Segment}`);
            console.log(`Rolling out process code: ${process}`);
            console.log(`Process length: ${process.length / 2}`);
            //write file to the disk
            let returnSeg = _PCB.processes[pid].Segment;
            _krnDiskDriver.createFile(`program${pid}.stud`, true);
            _krnDiskDriver.write(`program${pid}.stud`, process, true);
            //delete the file from the memory
            _MA.deleteProgram(_PCB.processes[pid].Segment);
            //update the data in PCB
            _PCB.processes[pid].Location = "Disk";
            _PCB.processes[pid].Segment = NaN;
            _PCB.processes[pid].Base = NaN;
            _PCB.processes[pid].Limit = NaN;
            return returnSeg;
        }
        //rolls in to memory and out of disk
        rollIn(pid, segment) {
            console.log(`Rolling in PID: ${pid} to segment: ${segment}`);
            let fileName = `program${pid}.stud`;
            //write file to the memory
            let processArr = TSOS.Utils.splitEveryOther(_krnDiskDriver.read(fileName));
            console.log(`Rolling in Process code: ${processArr}`);
            console.log(`length: ${processArr.length}`);
            _MMU.writeInit(processArr, segment);
            // delete the file from disk
            _krnDiskDriver.delete(`program${pid}.stud`);
            //update the PCB
            let base;
            if (segment == 0) {
                base = 0;
            }
            else if (segment == 1) {
                base = 256;
            }
            else if (segment == 2) {
                base = 512;
            }
            _PCB.processes[pid].Location = "Memory";
            _PCB.processes[pid].Segment = segment;
            _PCB.processes[pid].Base = base;
            _PCB.processes[pid].Limit = base + 255;
        }
    }
    TSOS.Dispatcher = Dispatcher;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=dispatcher.js.map