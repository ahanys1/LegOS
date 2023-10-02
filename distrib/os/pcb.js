var TSOS;
(function (TSOS) {
    //pcb class for handling the PCB display updates
    class pcb {
        PCBTable;
        PC;
        Acc;
        IR;
        Xreg;
        Yreg;
        Zflag;
        constructor(PCBTable = document.getElementById("PCB"), PC = document.getElementById("PC"), Acc = document.getElementById("Acc"), IR = document.getElementById("IR"), Xreg = document.getElementById("Xreg"), Yreg = document.getElementById("Yreg"), Zflag = document.getElementById("Zflag")) {
            this.PCBTable = PCBTable;
            this.PC = PC;
            this.Acc = Acc;
            this.IR = IR;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
        }
        init() {
            this.PCBTable = document.getElementById("PCB");
            this.PC = document.getElementById("PC");
            this.Acc = document.getElementById("Acc");
            this.IR = document.getElementById("IR");
            this.Xreg = document.getElementById("Xreg");
            this.Yreg = document.getElementById("Yreg");
            this.Zflag = document.getElementById("Zflag");
        }
        updateTable() {
            this.PC.innerHTML = _CPU.PC.toString();
            this.Acc.innerHTML = _CPU.Acc.toString(16);
            this.IR.innerHTML = _CPU.IR.toString(16);
            this.Xreg.innerHTML = _CPU.Xreg.toString(16);
            this.Yreg.innerHTML = _CPU.Yreg.toString(16);
            this.Zflag.innerHTML = _CPU.Zflag.toString(16);
        }
    }
    TSOS.pcb = pcb;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=pcb.js.map