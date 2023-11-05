/* ------------
     CPU.ts

     Routines for the host CPU simulation, NOT for the OS itself.
     In this manner, it's A LITTLE BIT like a hypervisor,
     in that the Document environment inside a browser is the "bare metal" (so to speak) for which we write code
     that hosts our client OS. But that analogy only goes so far, and the lines are blurred, because we are using
     TypeScript/JavaScript in both the host and client environments.

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */
//took op codes from my org and arch project.
var TSOS;
(function (TSOS) {
    class Cpu {
        PC;
        Acc;
        Xreg;
        Yreg;
        Zflag;
        IR;
        tempA;
        tempMDR;
        tempMAR;
        inc;
        isExecuting;
        constructor(PC = 0, Acc = 0, Xreg = 0, Yreg = 0, Zflag = 0, IR = 0, //instruction register
        tempA = null, tempMDR = null, tempMAR = null, inc = null, isExecuting = false) {
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.IR = IR;
            this.tempA = tempA;
            this.tempMDR = tempMDR;
            this.tempMAR = tempMAR;
            this.inc = inc;
            this.isExecuting = isExecuting;
        }
        init() {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.IR = 0;
            this.isExecuting = false;
            this.tempA = null;
            this.tempMDR = null;
            this.tempMAR = null;
            this.inc = null;
        }
        cycle() {
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
            //make sure that every cycle a command executes, rather than 1 step of the pipeline per cycle.
            //well, only way to start executing is to start executing. lets gooooooo
            if (this.isExecuting) {
                this.fetch();
            }
            _Scheduler.handleCPUBurst();
            _Scheduler.TurnaroundTime++;
        }
        //
        //PIPELINE - This is where the things do stuff. I'm porting this almost directly from Org and arch because I'm too lazy to refactor it more than I already have to.
        //
        fetch() {
            this.IR = _MMU.readImm(this.PC);
            _CPUdisplay.updateIR();
            this.PC++;
            _CPUdisplay.updatePC();
            _PCB.updateRunning();
            this.decode1();
        }
        decode1() {
            switch (this.IR) {
                case 0xA9: //Load the accumulator with a constant
                case 0xA2: //Load the X register with a constant
                case 0xA0: //Load the Y register with a constant
                case 0xD0: //Branch n bytes if Z flag = 0
                    this.tempA = _MMU.readImm(this.PC);
                    this.PC++;
                    _CPUdisplay.updatePC();
                    this.execute1();
                    break;
                case 0xAD: //Load the accumulator from memory
                case 0x8D: //Store the accumulator in memory
                case 0x6D: //Add with carry
                case 0xAE: //Load the X register from memory
                case 0xAC: //Load the Y register from memory
                case 0xEC: //Compare a byte in memory to the X reg
                case 0xEE: //Increment the value of a byte
                    _MMU.setLowOrder(_MMU.readImm(this.PC));
                    this.PC++;
                    _CPUdisplay.updatePC();
                    this.decode2();
                    break;
                case 0xEA: //No Operation
                    break;
                case 0x00: //Break
                    _Scheduler.justTerminated = true;
                    this.isExecuting = false;
                    _Scheduler.finishedPIDs.push(_PCB.runningPID);
                    _PCB.processes[_PCB.runningPID].LastTick = _Scheduler.TurnaroundTime;
                    _PCB.terminate(_PCB.runningPID);
                    this.init();
                    _Scheduler.CQ == 1;
                    _Scheduler.contextSwitch();
                    _CPUdisplay.updateAll();
                    _RAMdisplay.updateDisplay();
                    break;
                case 0xFF: //System Call
                    if ((this.Xreg == 0x01) || (this.Xreg == 0x02)) {
                        this.tempA = this.Yreg;
                        this.execute1();
                    }
                    break;
            }
        }
        decode2() {
            switch (this.IR) {
                case 0xAD:
                case 0x8D:
                case 0x6D:
                case 0xAE:
                case 0xAC:
                case 0xEC:
                case 0xEE:
                    _MMU.setHighOrder(_MMU.readImm(this.PC));
                    this.PC++;
                    _CPUdisplay.updatePC();
                    this.execute1();
                    break;
            }
        }
        execute1() {
            switch (this.IR) {
                case 0xA9:
                    this.Acc = this.tempA;
                    _CPUdisplay.updateAcc();
                    break;
                case 0xAD:
                    this.Acc = _MMU.read();
                    _CPUdisplay.updateAcc();
                    break;
                case 0x8D:
                    _MMU.read();
                    this.tempMAR = _MMU.getMAR();
                    this.tempMDR = this.Acc;
                    this.writeBack(this.tempMAR, this.tempMDR);
                    break;
                case 0x6D:
                    _MMU.read();
                    this.Acc += _MMU.getMDR();
                    if (this.Acc.toString(16).length == 3) { //deal with overflow and negative numbers by chopping off extra
                        let a = this.Acc.toString(16);
                        a = a.slice(1, a.length);
                        this.Acc = parseInt(a, 16);
                    }
                    _CPUdisplay.updateAcc();
                    break;
                case 0xA2:
                    this.Xreg = this.tempA;
                    _CPUdisplay.updateXreg();
                    break;
                case 0xAE:
                    this.Xreg = _MMU.read();
                    _CPUdisplay.updateXreg();
                    break;
                case 0xA0:
                    this.Yreg = this.tempA;
                    _CPUdisplay.updateYreg();
                    break;
                case 0xAC:
                    this.Yreg = _MMU.read();
                    _CPUdisplay.updateYreg();
                    break;
                case 0xEC:
                    this.tempA = _MMU.read();
                    this.execute2();
                    break;
                case 0xD0:
                    if (this.Zflag == 0x00) {
                        this.PC += (this.tempA);
                        //loc = this.PC.toString(16); 
                        if (this.PC > 0xFF) { //Borrowed this from KeedOS. I had a similar implementation utilizing strings, but for some reason that broke between Org and Arch and here.
                            this.PC -= 0x100;
                        }
                    }
                    _CPUdisplay.updatePC();
                    break;
                case 0xEE: //Increment
                    this.inc = _MMU.read();
                    this.execute2();
                    break;
                case 0xFF:
                    if (this.Xreg == 0x01) { //#$01 in X reg = print the integer stored in the Y register.
                        console.log(this.tempA);
                        _StdOut.putText(this.tempA.toString());
                    }
                    else if (this.Xreg == 0x02) { //#$02 in X reg = print the 00-terminated string stored at the address in the Y register.
                        let temp = "";
                        while (_MMU.readImm(this.tempA) != 0x00) {
                            temp += String.fromCharCode(_MMU.readImm(this.tempA));
                            this.tempA++;
                        }
                        console.log(temp);
                        _StdOut.putText(temp);
                    }
                    break;
            }
        }
        execute2() {
            switch (this.IR) {
                case 0xEC:
                    if (this.Xreg == this.tempA) { //Sets the Z (zero) flag if equal
                        this.Zflag = 0x01;
                    }
                    else {
                        this.Zflag = 0x00;
                    }
                    _CPUdisplay.updateZflag();
                    break;
                case 0xEE:
                    this.inc++;
                    this.tempMAR = _MMU.getMAR();
                    this.tempMDR = this.inc;
                    this.writeBack(this.tempMAR, this.tempMDR);
                    break;
            }
        }
        writeBack(address, data) {
            _MMU.writeImm(address, data);
            _RAMdisplay.updateDisplay();
        }
    }
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=cpu.js.map