module TSOS{
    //ment for handling updates to the cpu display
    export class CPUdisplay{
        constructor(
            private CPUTable: HTMLElement = document.getElementById("CPU"),
            private PC: HTMLElement = document.getElementById("PC"),
            private Acc: HTMLElement = document.getElementById("Acc"),
            private IR: HTMLElement = document.getElementById("IR"),
            private Xreg: HTMLElement = document.getElementById("Xreg"),
            private Yreg: HTMLElement = document.getElementById("Yreg"),
            private Zflag: HTMLElement = document.getElementById("Zflag")
        ){}

        public init(): void {
            this.CPUTable = document.getElementById("PCB");
            this.PC = document.getElementById("PC");
            this.Acc = document.getElementById("Acc");
            this.IR = document.getElementById("IR");
            this.Xreg = document.getElementById("Xreg");
            this.Yreg = document.getElementById("Yreg");
            this.Zflag = document.getElementById("Zflag");
            
        }

        updateAll() {//updates the table with the current status of the CPU
            this.PC.innerHTML = _CPU.PC.toString();
            this.Acc.innerHTML = Utils.hexLog(_CPU.Acc, false);
            this.IR.innerHTML = Utils.hexLog(_CPU.IR, false);
            this.Xreg.innerHTML = Utils.hexLog(_CPU.Xreg, false);
            this.Yreg.innerHTML = Utils.hexLog(_CPU.Yreg, false);
            this.Zflag.innerHTML = Utils.hexLog(_CPU.Zflag, false);
        }

        updatePC(){
            this.PC.innerHTML = _CPU.PC.toString();
        }
        updateAcc(){
            this.Acc.innerHTML = Utils.hexLog(_CPU.Acc, false);
        }
        updateIR(){
            this.IR.innerHTML = Utils.hexLog(_CPU.IR, false);
        }
        updateXreg(){
            this.Xreg.innerHTML = Utils.hexLog(_CPU.Xreg, false);
        }
        updateYreg(){
            this.Yreg.innerHTML = Utils.hexLog(_CPU.Yreg, false);
        }
        updateZflag(){
            this.Zflag.innerHTML = Utils.hexLog(_CPU.Zflag, false);
        }
    }
}