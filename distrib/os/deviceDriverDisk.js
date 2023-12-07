/* ----------------------------------
   DeviceDriverDisk.ts

   The Kernel Disk Device Driver.
   ---------------------------------- */
var TSOS;
(function (TSOS) {
    // Extends DeviceDriver
    class DeviceDriverDisk extends TSOS.DeviceDriver {
        tracks = 4;
        sectors = 8;
        blocks = 8;
        blockSize = 64;
        isFormated = false;
        orderedKeys = []; //keys need to be ordered seperatly bc session storage does not retain order
        constructor() {
            super();
            this.driverEntry = this.krnDiskDriverEntry;
        }
        krnDiskDriverEntry() {
            // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
            // More?
        }
        //helper functions. many of these are inspired by KeedOS, however are altered to fit in my implementation.
        fetchBlank(isMBR = false) {
            let blank = new Array(this.blockSize); //create an array of 64 (the block size)
            blank.fill("00"); //fill array with 0s 
            if (isMBR) { //if it's the mbr then set the first byte to 1 on format. Put other MBR data in this section
                let easterEggStr = "01 FF FF FF 41 20 6D 61 6E 20 68 61 73 20 66 61 6C 6C 65 6E 20 69 6E 74 6F 20 74 68 65 20 72 69 76 65 72 20 61 74 20 4C 65 67 6F 20 43 69 74 79 21"; //yes, there is an easter egg here!
                let eeA = easterEggStr.split(" ");
                for (let i = 0; i < eeA.length; i++) {
                    blank[i] = eeA[i];
                } //for some reason this adds an extra value to the end??
                blank.pop();
            }
            let blankStr = blank.join("");
            return blankStr;
        }
        formatTSB(t, s, b) {
            return `${t}.${s}.${b}`;
        }
        findFreeFAT() {
            for (let s = 0; s < this.sectors; s++) {
                for (let b = 0; b < this.blocks; b++) {
                    const block = TSOS.Utils.splitEveryOther(sessionStorage.getItem(this.formatTSB(0, s, b)));
                    if (block[0] === "00") {
                        return this.formatTSB(0, s, b);
                    }
                }
            }
            return null;
        }
        findFreeData() {
            for (let t = 1; t < this.tracks; t++) {
                for (let s = 0; s < this.sectors; s++) {
                    for (let b = 0; b < this.blocks; b++) {
                        const block = TSOS.Utils.splitEveryOther(sessionStorage.getItem(this.formatTSB(t, s, b)));
                        if (block[0] === "00") {
                            return this.formatTSB(t, s, b);
                        }
                    }
                }
            }
            return null;
        }
        encodeData(data) {
            let encoded = "";
            for (let i = 0; i < data.length; i++) {
                let charCode = data.charCodeAt(i).toString(16).toUpperCase();
                if (charCode.length == 1) { //deal with missing 0s
                    charCode = "0" + charCode;
                }
                encoded = encoded + charCode;
            }
            return encoded;
        }
        decodeData(data) {
            let dataArr = TSOS.Utils.splitEveryOther(data);
            let i = 4; //4th position is always beginning of data
            let decoded = "";
            while (dataArr[i] !== "00") { //00 terminates
                decoded += String.fromCharCode(parseInt(dataArr[i], 16));
                i++;
                if (i === 64) { //if the index went too high look for linked and reset // at the moment I have 0 clue if this works, I will test it eventually
                    const nextBlock = this.formatTSB(parseInt(dataArr[1]), parseInt(dataArr[2]), parseInt(dataArr[3]));
                    dataArr = TSOS.Utils.splitEveryOther(sessionStorage.getItem(nextBlock));
                    i = 4;
                }
            }
            console.log(decoded);
            return decoded;
        }
        findFATEntry(filename) {
            for (let s = 0; s < this.sectors; s++) {
                for (let b = 0; b < this.blocks; b++) {
                    const block = sessionStorage.getItem(this.formatTSB(0, s, b));
                    if (block[1] === "1") {
                        const decodedData = this.decodeData(block);
                        if (decodedData === filename) {
                            console.log(this.formatTSB(0, s, b));
                            return this.formatTSB(0, s, b);
                        }
                    }
                }
            }
            return null;
        }
        // command specific functions
        format() {
            _Kernel.krnTrace("Formating Disk");
            for (let t = 0; t < this.tracks; t++) {
                for (let s = 0; s < this.sectors; s++) {
                    for (let b = 0; b < this.blocks; b++) {
                        let blankBlock;
                        if (t === 0 && s === 0 && b === 0) {
                            blankBlock = this.fetchBlank(true);
                        }
                        else {
                            blankBlock = this.fetchBlank();
                        }
                        sessionStorage.setItem(this.formatTSB(t, s, b), blankBlock);
                        this.orderedKeys.push(this.formatTSB(t, s, b));
                        //console.log(this.formatTSB(t,s,b) + ": " + blankBlock);
                    }
                }
            }
            _DiskDisplay.update();
            this.isFormated = true;
        }
        createFile(fileName) {
            const freeFATAddress = this.findFreeFAT();
            const freeDataAddress = this.findFreeData();
            if (freeFATAddress && freeDataAddress) {
                //first, fetch data as string array
                let FATData = TSOS.Utils.splitEveryOther(sessionStorage.getItem(freeFATAddress));
                let Data = TSOS.Utils.splitEveryOther(sessionStorage.getItem(freeDataAddress));
                //next, mark blocks as occupied
                FATData[0] = "01";
                Data[0] = "01";
                //now, set the FAT to point to the reserved Data
                let DataAddressArr = freeDataAddress.split(".");
                FATData[1] = "0" + DataAddressArr[0];
                FATData[2] = "0" + DataAddressArr[1];
                FATData[3] = "0" + DataAddressArr[2];
                //now encode the name of the file as the ascii hex codes
                let encodedFileName = TSOS.Utils.splitEveryOther(this.encodeData(fileName));
                for (let i = 0; i < encodedFileName.length; i++) {
                    FATData[4 + i] = encodedFileName[i];
                }
                /*for (let i = 0; i < fileName.length; i++){
                    let charCode = fileName.charCodeAt(i).toString(16).toUpperCase();
                    if (charCode.length == 1){ //deal with missing 0s
                        charCode = "0" + charCode;
                    }
                    FATData[4+i] = charCode;
                }*/
                //lastly, writeback the data to the disk...
                sessionStorage.setItem(freeFATAddress, FATData.join(""));
                sessionStorage.setItem(freeDataAddress, Data.join(""));
                //...and update the display
                _DiskDisplay.update();
            }
            else {
                _Kernel.krnTrapError("NO DISK SPACE"); //TODO: disk space error handler
            }
        }
        write(fileName, data) {
            let FATEntry = this.findFATEntry(fileName);
            let FATasArr = TSOS.Utils.splitEveryOther(sessionStorage.getItem(FATEntry));
            let pointedLoc = this.formatTSB(parseInt(FATasArr[1]), parseInt(FATasArr[2]), parseInt(FATasArr[3]));
            let dataEntry = sessionStorage.getItem(pointedLoc);
            let encodedData = this.encodeData(data);
            let encodedArr = TSOS.Utils.splitEveryOther(encodedData);
            //first, let's clear the existing data
            dataEntry = this.fetchBlank();
            //next convert to arr and mark occupied
            let dataEntryArr = TSOS.Utils.splitEveryOther(dataEntry);
            dataEntryArr[0] = "01";
            let i = 0;
            while (encodedArr[i]) {
                dataEntryArr[4 + (i % 60)] = encodedArr[i];
                i++;
                //if block is over
                if (i % 60 === 0 && i !== 0) {
                    //find free data
                    const available = this.findFreeData();
                    if (available) {
                        //separate the new key and insert to prev
                        const [t, s, b] = available.split(".");
                        dataEntryArr[1] = "0" + t;
                        dataEntryArr[2] = "0" + s;
                        dataEntryArr[3] = "0" + b;
                        sessionStorage.setItem(pointedLoc, dataEntryArr.join(""));
                        //reset the array and location
                        pointedLoc = available;
                        dataEntryArr.fill("00");
                        dataEntryArr[0] = "01";
                    }
                    else {
                        _Kernel.krnTrapError("NO DISK SPACE");
                    }
                }
            }
            sessionStorage.setItem(pointedLoc, dataEntryArr.join(""));
            /*if (encodedArr.length <= 60){ //if it fits in one block, just deal with it
                for (let i = 0; i < encodedArr.length; i++){
                    dataEntryArr[i+4] = encodedArr[i];
                }
                sessionStorage.setItem(pointedLoc, dataEntryArr.join(""));
            } else {//if it's too big, fill other blocks too

            }*/
            _DiskDisplay.update();
        }
    }
    TSOS.DeviceDriverDisk = DeviceDriverDisk;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=deviceDriverDisk.js.map