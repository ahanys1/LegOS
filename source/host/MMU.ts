//Also taken from org and arch

module TSOS { 
    export class MMU {
        constructor(
            public lob: number = 0x00,
            public hob: number = 0x0000,
            public littleEndianAddress: number = 0x0000
        ){ }
        public init(): void{
            this.lob = 0x00;
            this.hob = 0x0000;
            this.littleEndianAddress = 0x0000;
        }
        writeMem(){
            //to be honest, might not even need this
            _MA.write();
        }

        writeImm(address: number, value: number){
            _MA.setMAR(address);
            _MA.setMDR(value);
            _MA.write();
        }

        readMem(){
            _MA.setMAR(this.littleEndianAddress);
            return _MA.read();
        }

        readImm(address: number){
            _MA.setMAR(address);
            return _MA.read();
        }

        littleEndian(LOB: number, HOB: number){
            this.lob = LOB;
            this.hob = HOB;
            this.littleEndianAddress = (this.hob * 256) + this.lob; //the * 256 bitshifts the memory address, putting it in the correct order
        }
    }
    
}