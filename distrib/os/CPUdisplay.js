var TSOS;
(function (TSOS) {
    //ment for handling updates to the cpu display
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
            this.Acc.innerHTML = TSOS.Utils.hexLog(_CPU.Acc, false);
            this.IR.innerHTML = TSOS.Utils.hexLog(_CPU.IR, false);
            this.Xreg.innerHTML = TSOS.Utils.hexLog(_CPU.Xreg, false);
            this.Yreg.innerHTML = TSOS.Utils.hexLog(_CPU.Yreg, false);
            this.Zflag.innerHTML = TSOS.Utils.hexLog(_CPU.Zflag, false);
        }
        updatePC() {
            this.PC.innerHTML = _CPU.PC.toString();
        }
        updateAcc() {
            this.Acc.innerHTML = TSOS.Utils.hexLog(_CPU.Acc, false);
        }
        updateIR() {
            this.IR.innerHTML = TSOS.Utils.hexLog(_CPU.IR, false);
        }
        updateXreg() {
            this.Xreg.innerHTML = TSOS.Utils.hexLog(_CPU.Xreg, false);
        }
        updateYreg() {
            this.Yreg.innerHTML = TSOS.Utils.hexLog(_CPU.Yreg, false);
        }
        updateZflag() {
            this.Zflag.innerHTML = TSOS.Utils.hexLog(_CPU.Zflag, false);
        }
    }
    TSOS.CPUdisplay = CPUdisplay;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=CPUdisplay.js.map