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
        read(pid) {
            if (pid % 3 == 0) {
                this.mdr = _Memory.ram[this.mar + partition.zero];
            }
            else if (pid % 3 == 1) {
                this.mdr = _Memory.ram[this.mar + partition.one];
            }
            else if (pid % 3 == 2) {
                this.mdr = _Memory.ram[this.mar + partition.two];
            }
            return this.mdr;
        }
        //write to the memory module
        write(pid) {
            if (this.mdr > 0xFF) {
                this.mdr = this.mdr - 0xFF; //handles overflow by looping around
            }
            if (pid % 3 == 0) {
                _Memory.ram[this.mar + partition.zero] = this.mdr;
            }
            else if (pid % 3 == 1) {
                _Memory.ram[this.mar + partition.one] = this.mdr;
            }
            else if (pid % 3 == 2) {
                _Memory.ram[this.mar + partition.two] = this.mdr;
            }
        }
    }
    TSOS.MA = MA;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=MA.js.map