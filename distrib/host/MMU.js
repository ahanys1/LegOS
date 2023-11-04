//Also taken from org and arch
var TSOS;
(function (TSOS) {
    class MMU {
        lob;
        hob;
        PIDs;
        hot;
        constructor(lob = 0x00, hob = 0x0000, PIDs = [42069], //bandaid fix
        hot = 0x0000) {
            this.lob = lob;
            this.hob = hob;
            this.PIDs = PIDs;
            this.hot = hot;
        }
        init() {
            this.lob = 0x00;
            this.hob = 0x0000;
            this.PIDs = [42069];
            this.hot = 0x0000;
        }
        write() {
            //to be honest, might not even need this
            _MA.write(_PCB.processes[_PCB.runningPID].Segment);
        }
        writeImm(address, value) {
            _MA.setMAR(address);
            _MA.setMDR(value);
            _MA.write(_PCB.processes[_PCB.runningPID].Segment);
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
            return _MA.read(_PCB.processes[_PCB.runningPID].Segment);
        }
        readImm(address) {
            _MA.setMAR(address);
            console.log(_PCB.runningPID);
            return _MA.read(_PCB.processes[_PCB.runningPID].Segment);
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
        writeInit(programArray, segment) {
            if (segment >= 0) {
                programArray.forEach((code, index) => {
                    //_MMU.writeImm(index, parseInt(code,16));
                    _MA.setMAR(index);
                    _MA.setMDR(parseInt(code, 16));
                    _MA.write(segment);
                    index++;
                });
                return true;
            }
            else {
                return false;
            }
        }
        findValidSpace() {
            if (_Memory.ram[0] == 0x00) {
                return 0;
            }
            else if (_Memory.ram[256] == 0x00) {
                return 1;
            }
            else if (_Memory.ram[512] == 0x00) {
                return 2;
            }
            else {
                return -1;
            }
        }
    }
    TSOS.MMU = MMU;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=MMU.js.map