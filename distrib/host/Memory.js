//This is largely ported from my Org & Arch project linked here: https://github.com/ahanys1/422-tsiraM/tree/master
var TSOS;
(function (TSOS) {
    class Memory {
        ram;
        mar;
        mdr;
        size;
        constructor(ram = [], mar = 0x0000, //memory adress register
        mdr = 0x00, //memory data register 
        size = 0xFFFF) {
            this.ram = ram;
            this.mar = mar;
            this.mdr = mdr;
            this.size = size;
            this.initializeMemory();
        }
        init() {
            this.mar = 0x000;
            this.mdr = 0x00;
            this.size = 0xFFFF;
            this.initializeMemory();
        }
        //Getters and setters for MDR and MAR
        setMDR(num) {
            this.mdr = num;
        }
        setMAR(num) {
            this.mar = num;
        }
        getMDR() {
            return this.mdr;
        }
        getMAR() {
            return this.mar;
        }
        //read and write memory
        read() {
            this.mdr = this.ram[this.mar];
            return this.mdr;
        }
        write() {
            this.ram[this.mar] = this.mdr;
        }
        initializeMemory() {
            for (let i = 0x00; i <= this.size; i++) {
                this.ram.push(0x00);
            }
            //this.log("created - Addressable space : " + (this.size+1)); need to figure out logging
        }
        reset() {
            this.mdr = 0x00;
            this.mar = 0x0000;
            this.ram = [];
            this.initializeMemory();
        }
    }
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=Memory.js.map