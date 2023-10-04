var TSOS;
(function (TSOS) {
    //pcb class for handling the PCB display updates
    class CPUdisplay {
        CPUTable;
        PC;
        Acc;
        IR;
        Xreg;
        Yreg;
        Zflag;
        constructor(CPUTable = document.getElementById("CPU"), PC = document.getElementById("PC"), Acc = document.getElementById("Acc"), IR = document.getElementById("IR"), Xreg = document.getElementById("Xreg"), Yreg = document.getElementById("Yreg"), Zflag = document.getElementById("Zflag")) {
            this.CPUTable = CPUTable;
            this.PC = PC;
            this.Acc = Acc;
            this.IR = IR;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
        }
        init() {
            this.CPUTable = document.getElementById("PCB");
            this.PC = document.getElementById("PC");
            this.Acc = document.getElementById("Acc");
            this.IR = document.getElementById("IR");
            this.Xreg = document.getElementById("Xreg");
            this.Yreg = document.getElementById("Yreg");
            this.Zflag = document.getElementById("Zflag");
        }
        updateAll() {
            this.PC.innerHTML = _CPU.PC.toString();
            this.Acc.innerHTML = _CPU.Acc.toString(16);
            this.IR.innerHTML = _CPU.IR.toString(16);
            this.Xreg.innerHTML = _CPU.Xreg.toString(16);
            this.Yreg.innerHTML = _CPU.Yreg.toString(16);
            this.Zflag.innerHTML = _CPU.Zflag.toString(16);
        }
        updatePC() {
            this.PC.innerHTML = _CPU.PC.toString();
        }
        updateAcc() {
            this.Acc.innerHTML = _CPU.Acc.toString(16);
        }
        updateIR() {
            this.IR.innerHTML = _CPU.IR.toString(16);
        }
        updateXreg() {
            this.Xreg.innerHTML = _CPU.Xreg.toString(16);
        }
        updateYreg() {
            this.Yreg.innerHTML = _CPU.Yreg.toString(16);
        }
        updateZflag() {
            this.Zflag.innerHTML = _CPU.Zflag.toString(16);
        }
    }
    TSOS.CPUdisplay = CPUdisplay;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=CPUdisplay.js.map