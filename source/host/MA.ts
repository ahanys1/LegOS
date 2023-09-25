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
        read(){
            this.mdr = _Memory.ram[this.mar];
            return this.mdr;
        }

        //write to the memory module
        write(){
            _Memory.ram[this.mar] = this.mdr;
        }
    }
    
}