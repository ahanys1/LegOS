/* ----------------------------------
   DeviceDriverDisk.ts

   The Kernel Disk Device Driver.
   ---------------------------------- */

   module TSOS {

    // Extends DeviceDriver
    export class DeviceDriverDisk extends DeviceDriver {
        tracks: number = 4;
        sectors: number = 8;
        blocks: number = 8;
        blockSize: number = 64;
        isFormated: boolean = false;
        public orderedKeys = []; //keys need to be ordered seperatly bc session storage does not retain order

        constructor() {
            super();
            this.driverEntry = this.krnDiskDriverEntry;
        }

        public krnDiskDriverEntry() {
            // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
            // More?
        }

        public fetchBlank(isMBR: boolean = false): string{ //since I don't feel like writing out a full 64 0s
            let blank = new Array(this.blockSize); //create an array of 64 (the block size)
            blank.fill("00"); //fill array with 0s 
            if (isMBR){ //if it's the mbr then set the first byte to 1 on format. Put other MBR data in this section
                let easterEggStr = "01 41 20 6D 61 6E 20 68 61 73 20 66 61 6C 6C 65 6E 20 69 6E 74 6F 20 74 68 65 20 72 69 76 65 72 20 61 74 20 4C 65 67 6F 20 43 69 74 79 21"; //yes, there is an easter egg here!
                let eeA:string[] = easterEggStr.split(" ");
                for (let i = 0; i < eeA.length; i++){
                    blank[i] = eeA[i];
                }
                blank.pop();
                
            }
            let blankStr = blank.join("");
            return blankStr;
        }

        public formatTSB(t: string | number, s: string | number, b: string | number): string { //takes the individual values and formats too a string
            return `${t}.${s}.${b}`;
        }

        public format() {
            _Kernel.krnTrace("Formating Disk");
            for (let t = 0; t < this.tracks; t++){
                for (let s = 0; s < this.sectors; s++){
                    for (let b = 0; b < this.blocks; b++){
                        let blankBlock: string;
                        if (t === 0 && s === 0 && b === 0){
                            blankBlock = this.fetchBlank(true);
                        } else {
                            blankBlock = this.fetchBlank();
                        }
                        sessionStorage.setItem(this.formatTSB(t,s,b), blankBlock);
                        this.orderedKeys.push(this.formatTSB(t,s,b));
                        //console.log(this.formatTSB(t,s,b) + ": " + blankBlock);
                    } 
                }
            }
            _DiskDisplay.update();
        }
        
    }
}
