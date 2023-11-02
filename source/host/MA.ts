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
        read(pid: number){
            if (pid % 3 == 0){
                this.mdr = _Memory.ram[this.mar + partition.zero];
            } else if (pid % 3 == 1){
                this.mdr = _Memory.ram[this.mar + partition.one];
            } else if (pid % 3 == 2){
                this.mdr = _Memory.ram[this.mar + partition.two];
            }
            return this.mdr;
        }

        //write to the memory module
        write(pid: number){
            if(this.mdr >0xFF){
                this.mdr = this.mdr - 0xFF; //handles overflow by looping around
            }
            if (pid % 3 == 0){
                _Memory.ram[this.mar + partition.zero] = this.mdr;
            } else if (pid % 3 == 1){
                _Memory.ram[this.mar + partition.one] = this.mdr;
            } else if (pid % 3 == 2){
                _Memory.ram[this.mar + partition.two] = this.mdr;
            }
        }
    }
    
}