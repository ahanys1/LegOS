//This is largely implemented from my Org & Arch project linked here: https://github.com/ahanys1/422-tsiraM/tree/master

module TSOS {
    export class Memory {
        constructor(
            private ram: number[] = [],
            private mar: number = 0x0000, //memory adress register
            private mdr: number = 0x00,   //memory data register 
            private size: number = 0xFFFF)
            {
            this.initializeMemory();         
        }

        //Getters and setters for MDR and MAR
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

        //read and write memory
        read(){
            this.mdr = this.ram[this.mar];
            return this.mdr;
        }
        write(){
            this.ram[this.mar] = this.mdr;
        }

        initializeMemory(){
            for (let i = 0x00; i <= this.size; i++) {
                this.ram.push(0x00); 
            }
            //this.log("created - Addressable space : " + (this.size+1)); need to figure out logging
        }

        reset(){//resets memory
            this.mdr = 0x00;
            this.mar = 0x0000;
            this.ram = [];
            this.initializeMemory();
        }
    }
}