//this used to be built into my memory file. now breaking up that into a Memory file and Memory Accessor File.

module TSOS { 
    export class MA {
        constructor(
            public mar: number = 0x00,
            public mdr: number = 0x0000,
        ){ }
        public init(): void{
            this.mar = 0x00;
            this.mdr = 0x0000;
        }

        //getters and setters for MDR and MAR
        setMDR(num: number){
            this.mdr = num;
        }
        setMAR(num: number){
            this.mar = num;
        }
        getMDR(): number{
            return this.mdr;
        }
        getMAR(): number{
            return this.mar;
        }

        //read from the memory module
        read(segment: number){
            let accessValid = true;
            let falseAccessAddress;
            if (segment  == 0){
                if (this.mar + partition.zero >= _PCB.processes[_PCB.runningPID].Base && this.mar + partition.zero <= _PCB.processes[_PCB.runningPID].Limit){
                    this.mdr = _Memory.ram[this.mar + partition.zero];
                } else{
                    accessValid = false;
                    falseAccessAddress = this.mar + partition.zero;
                }
            } else if (segment  == 1){
                if (this.mar + partition.one >= _PCB.processes[_PCB.runningPID].Base && this.mar + partition.one <= _PCB.processes[_PCB.runningPID].Limit){
                    this.mdr = _Memory.ram[this.mar + partition.one];
                } else{
                    accessValid = false;
                    falseAccessAddress = this.mar + partition.one;
                }
            } else if (segment  == 2){
                if (this.mar + partition.two >= _PCB.processes[_PCB.runningPID].Base && this.mar + partition.two <= _PCB.processes[_PCB.runningPID].Limit){
                    this.mdr = _Memory.ram[this.mar + partition.two];
                } else{
                    accessValid = false;
                    falseAccessAddress = this.mar + partition.two;
                }
            }
            if (accessValid){
                return this.mdr;
            } else {
                _Kernel.krnTrapError("ACCESS", [falseAccessAddress]);
            }
        }

        //write to the memory module
        write(segment: number){
            if(this.mdr >0xFF){
                this.mdr = this.mdr - 0xFF; //handles overflow by looping around
            }
            if (segment == 0){
                if (this.mar + partition.zero >= 0x0000 && this.mar + partition.zero <= 0x00FF){
                    _Memory.ram[this.mar + partition.zero] = this.mdr;
                } else {
                    _Kernel.krnTrapError("ACCESS", [this.mar + partition.zero]);
                }
            } else if (segment == 1){
                if (this.mar + partition.one >= 0x0100 && this.mar + partition.one <= 0x01FF){
                    _Memory.ram[this.mar + partition.one] = this.mdr;
                } else {
                    _Kernel.krnTrapError("ACCESS", [this.mar + partition.one]);
                }
            } else if (segment == 2){
                if (this.mar + partition.two >= 0x0200 && this.mar + partition.two <= 0x02FF){
                    _Memory.ram[this.mar + partition.two] = this.mdr;
                } else {
                    _Kernel.krnTrapError("ACCESS", [this.mar + partition.two]);
                }
            }
        }

        deleteProgram(segment: number){
            if (segment == 0){
                for (let i = 0; i <= 255; i++){
                    _Memory.ram[i] = 0x00;
                }
            } else if(segment == 1){
                for (let i = 256; i <= 511; i++){
                    _Memory.ram[i] = 0x00;
                }
            } else if (segment == 2){
                for (let i = 512; i < 768; i++){
                    _Memory.ram[i] = 0x00;
                }
            }
        }

        public readWholeProgram(segment: number): string{
            let intArray: number[] = [];
            //fetch the code
            if (segment === 0){
                for (let i = 0; i <= 255; i++){
                    intArray.push(_Memory.ram[i]);
                }
            } else if (segment === 1){
                for (let i = 256; i <= 511; i++){
                    intArray.push(_Memory.ram[i]);
                }
            } else if (segment === 2){
                for (let i = 512; i < 768; i++){
                    intArray.push(_Memory.ram[i]);
                }
            } else {
                _Kernel.krnTrapError("READ WHOLE PROGRAM");
                return null;
            }
            //convert the codes to strings
            let strArray: string[] = [];
            for (const code of intArray) {
                let codeStr = code.toString(16);
                if (codeStr.length === 1){
                    codeStr = "0" + codeStr;
                }
                strArray.push(codeStr);
            }

            return strArray.join("");
        }
    }
    
}