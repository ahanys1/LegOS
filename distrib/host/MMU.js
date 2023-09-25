//Also taken from org and arch
var TSOS;
(function (TSOS) {
    class MMU {
        lob;
        hob;
        littleEndianAddress;
        constructor(lob = 0x00, hob = 0x0000, littleEndianAddress = 0x0000) {
            this.lob = lob;
            this.hob = hob;
            this.littleEndianAddress = littleEndianAddress;
        }
        init() {
            this.lob = 0x00;
            this.hob = 0x0000;
            this.littleEndianAddress = 0x0000;
        }
        writeMem() {
            //to be honest, might not even need this
            _MA.write();
        }
        writeImm(address, value) {
            _MA.setMAR(address);
            _MA.setMDR(value);
            _MA.write();
        }
        readMem() {
            _MA.setMAR(this.littleEndianAddress);
            return _MA.read();
        }
        readImm(address) {
            _MA.setMAR(address);
            return _MA.read();
        }
        littleEndian(LOB, HOB) {
            this.lob = LOB;
            this.hob = HOB;
            this.littleEndianAddress = (this.hob * 256) + this.lob; //the * 256 bitshifts the memory address, putting it in the correct order
        }
    }
    TSOS.MMU = MMU;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=MMU.js.map