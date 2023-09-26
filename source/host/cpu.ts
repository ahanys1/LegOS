/* ------------
     CPU.ts

     Routines for the host CPU simulation, NOT for the OS itself.
     In this manner, it's A LITTLE BIT like a hypervisor,
     in that the Document environment inside a browser is the "bare metal" (so to speak) for which we write code
     that hosts our client OS. But that analogy only goes so far, and the lines are blurred, because we are using
     TypeScript/JavaScript in both the host and client environments.

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */
//took op codes from my org and arch project.
module TSOS {

    export class Cpu {

        constructor(public PC: number = 0,
                    public Acc: number = 0,
                    public Xreg: number = 0,
                    public Yreg: number = 0,
                    public Zflag: number = 0,
                    public IR: number = 0, //instruction register
                    public isExecuting: boolean = false) {

        }

        public init(): void {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.IR = 0;
            this.isExecuting = false;
        }

        public cycle(): void {
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.

            //Fetch OPCODE
            this.IR = _MMU.readImm(this.PC);

            //OPCODES
            switch(this.IR){
                case 0xA9: //Load the accumulator with a constant   A9   LDA | LDA #$07
                    this.PC++; //increments program counter to load symbol
                    this.Acc = _MMU.readImm(this.PC); //loads next symbol into the accumulator
                    
                case 0x8D://Store the accumulator in memory     8D      STA | STA $0010
                    this.PC++;
                    _MMU.littleEndian(_MMU.readImm(this.PC), _MMU.readImm(this.PC + 1)); //converts the little endian memory address.
                    this.PC++; //since address is 2 bytes, increments twice
                    _MMU.writeImm(_MMU.littleEndianAddress,this.Acc); //writes to the address the contents in the Acc


            }


            this.PC++; //increment to the next opcode
            console.log(this.Acc);
        }
    }
}
