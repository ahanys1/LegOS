//Also taken from org and arch
var TSOS;
(function (TSOS) {
    class MMU {
        lob;
        hob;
        PIDs;
        hot;
        activePID;
        constructor(lob = 0x00, hob = 0x0000, PIDs = [42069], //bandaid fix
        hot = 0x0000, activePID = 0) {
            this.lob = lob;
            this.hob = hob;
            this.PIDs = PIDs;
            this.hot = hot;
            this.activePID = activePID;
        }
        init() {
            this.lob = 0x00;
            this.hob = 0x0000;
            this.PIDs = [42069];
            this.hot = 0x0000;
            this.activePID = 0;
        }
        write() {
            //to be honest, might not even need this
            _MA.write(this.activePID);
        }
        writeImm(address, value) {
            _MA.setMAR(address);
            _MA.setMDR(value);
            _MA.write(this.activePID);
        }
        setLowOrder(LOB) {
            this.lob = LOB;
        }
        setHighOrder(HOB) {
            this.hob = HOB;
            this.hot = this.hob * 256; //this bitshifts so they can be added together
        }
        read() {
            _MA.setMAR(this.hot + this.lob);
            return _MA.read(this.activePID);
        }
        readImm(address) {
            _MA.setMAR(address);
            return _MA.read(this.activePID);
        }
        setMDR(num) {
            _MA.setMDR(num);
        }
        setMAR(num) {
            _MA.setMAR(num);
        }
        getMDR() {
            return _MA.getMDR();
        }
        getMAR() {
            return _MA.getMAR();
        }
        writeInit(programArray) {
            programArray.forEach((code, index) => {
                //_MMU.writeImm(index, parseInt(code,16));
                _MA.setMAR(index);
                _MA.setMDR(parseInt(code, 16));
                _MA.write(this.PIDs[this.PIDs.length - 1]);
                index++;
            });
        }
    }
    TSOS.MMU = MMU;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=MMU.js.map