//This is largely ported from my Org & Arch project linked here: https://github.com/ahanys1/422-tsiraM/tree/master
var TSOS;
(function (TSOS) {
    class Memory {
        ram;
        size;
        constructor(ram = [], size = 0xFFFF) {
            this.ram = ram;
            this.size = size;
            this.initializeMemory();
        }
        init() {
            this.size = 0xFFFF;
            this.initializeMemory();
        }
        initializeMemory() {
            for (let i = 0x00; i <= this.size; i++) {
                this.ram.push(0x00);
            }
            //this.log("created - Addressable space : " + (this.size+1)); need to figure out logging
        }
        reset() {
            this.ram = [];
            this.initializeMemory();
        }
    }
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=Memory.js.map