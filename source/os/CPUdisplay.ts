module TSOS{
    //pcb class for handling the PCB display updates
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
            this.Acc.innerHTML = _CPU.Acc.toString(16);
            this.IR.innerHTML = _CPU.IR.toString(16);
            this.Xreg.innerHTML = _CPU.Xreg.toString(16);
            this.Yreg.innerHTML = _CPU.Yreg.toString(16);
            this.Zflag.innerHTML = _CPU.Zflag.toString(16);
        }

        updatePC(){
            this.PC.innerHTML = _CPU.PC.toString();
        }
        updateAcc(){
            this.Acc.innerHTML = _CPU.Acc.toString(16);
        }
        updateIR(){
            this.IR.innerHTML = _CPU.IR.toString(16);
        }
        updateXreg(){
            this.Xreg.innerHTML = _CPU.Xreg.toString(16);
        }
        updateYreg(){
            this.Yreg.innerHTML = _CPU.Yreg.toString(16);
        }
        updateZflag(){
            this.Zflag.innerHTML = _CPU.Zflag.toString(16);
        }
    }
}