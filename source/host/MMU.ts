//Also taken from org and arch

module TSOS { 
    export class MMU {
        constructor(
            public lob: number = 0x00,
            public hob: number = 0x0000,
            public PIDs: number[] = [42069], //bandaid fix
            public hot: number = 0x0000,
        ){ }
        public init(): void{
            this.lob = 0x00;
            this.hob = 0x0000;
            this.PIDs = [42069];
            this.hot = 0x0000;
        }
        write(){
            //to be honest, might not even need this
            _MA.write(_PCB.processes[_PCB.runningPID].Segment);
        }

        writeImm(address: number, value: number){
            _MA.setMAR(address);
            _MA.setMDR(value);
            _MA.write(_PCB.processes[_PCB.runningPID].Segment);
        }

        setLowOrder(LOB: number){
            this.lob = LOB;
        }

        setHighOrder(HOB: number){
            this.hob = HOB;
            this.hot = this.hob * 256; //this bitshifts so they can be added together
        }

        read(){
            _MA.setMAR(this.hot + this.lob);
            return _MA.read(_PCB.processes[_PCB.runningPID].Segment);
        }

        readImm(address: number){
            _MA.setMAR(address);
           // console.log(_PCB.runningPID);
            return _MA.read(_PCB.processes[_PCB.runningPID].Segment);
        }

        setMDR(num: number){
            _MA.setMDR(num);
        }
        setMAR(num: number){
            _MA.setMAR(num);
        }
        getMDR(): number{
            return _MA.getMDR();
        }
        getMAR(): number{
            return _MA.getMAR();
        }

        writeInit(programArray: string[], segment: number):boolean{
            if (segment >= 0){
                programArray.forEach((code,index) => {
                    //_MMU.writeImm(index, parseInt(code,16));
                    _MA.setMAR(index);
                    _MA.setMDR(parseInt(code, 16));
                    _MA.write(segment);
                    index++;
                });
                return true;
            } else { //this is were we will load the program into the disk instead.
                if (_krnDiskDriver.isFormated){
                    let pid = this.PIDs[_MMU.PIDs.length - 1];
                    _krnDiskDriver.createFile(`program${pid}.stud`, true); //create a .stud file.
                    let programString = programArray.join("");
                    _krnDiskDriver.write(`program${pid}.stud`, programString, true);
                    return false;
                }
                return null;
            }
            
        }

        findValidSpace(): number{
            if (_Memory.ram[0] == 0x00){
                return 0;
            } else if (_Memory.ram[256] == 0x00){
                return 1;
            } else if (_Memory.ram[512] == 0x00){
                return 2;
            } else {
                return -1;
            }
        }

    }
    
}