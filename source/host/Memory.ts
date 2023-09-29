//This is largely ported from my Org & Arch project linked here: https://github.com/ahanys1/422-tsiraM/tree/master

module TSOS {
    export class Memory {
        constructor(
            public ram: number[] = [],
            private size: number = 0xFFFF) 
            {
            this.initializeMemory();         
        }
        public init(): void{
            this.size = 768;
            this.reset();
        }


        initializeMemory(){
            for (let i = 0x00; i <= this.size; i++) {
                this.ram.push(0x00); 
            }
            //this.log("created - Addressable space : " + (this.size+1)); need to figure out logging
        }

        reset(){//resets memory
            this.ram = [];
            this.initializeMemory();
        }
    }
}