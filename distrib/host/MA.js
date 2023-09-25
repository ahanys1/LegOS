//this used to be built into my memory file. now breaking up that into a Memory file and Memory Accessor File.
var TSOS;
(function (TSOS) {
    class MA {
        mar;
        mdr;
        constructor(mar = 0x00, mdr = 0x0000) {
            this.mar = mar;
            this.mdr = mdr;
        }
        init() {
            this.mar = 0x00;
            this.mdr = 0x0000;
        }
        //getters and setters for MDR and MAR
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
        //read from the memory module
        read() {
            this.mdr = _Memory.ram[this.mar];
            return this.mdr;
        }
        //write to the memory module
        write() {
            _Memory.ram[this.mar] = this.mdr;
        }
    }
    TSOS.MA = MA;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=MA.js.map