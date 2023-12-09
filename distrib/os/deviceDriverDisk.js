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
                }
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
            let i = 4; //4th position is always beginning of data
            let decoded = "";
            let dataArr = TSOS.Utils.splitEveryOther(data);
            while (dataArr[i] !== "00") { //00 terminates
                decoded += String.fromCharCode(parseInt(dataArr[i], 16));
                i++;
                if (i === 64) { // for whatever reason this only works for blocks of 2???? idk I'm gonn astart doing other stuff and come back to this
                    const nextBlock = this.formatTSB(parseInt(dataArr[1]), parseInt(dataArr[2]), parseInt(dataArr[3]));
                    dataArr = TSOS.Utils.splitEveryOther(sessionStorage.getItem(nextBlock));
                    //console.log(`Switched to next block: ${nextBlock} with data: ${dataArr}`);
                    i = 4;
                }
                //console.log(`i: ${i}, dataArr[i]: ${dataArr[i]}, decoded: ${decoded}`);
            }
            return decoded;
        }
        findFATEntry(filename) {
            for (let s = 0; s < this.sectors; s++) {
                for (let b = 0; b < this.blocks; b++) {
                    const block = sessionStorage.getItem(this.formatTSB(0, s, b));
                    if (block[1] === "1") {
                        const decodedData = this.decodeData(block);
                        if (decodedData === filename) {
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
        createFile(fileName, isProgram = false) {
            if (!this.findFATEntry(fileName)) {
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
                    if (!isProgram) {
                        _StdOut.putText(`File ${fileName} created.`);
                    }
                }
                else {
                    _Kernel.krnTrapError("NO DISK SPACE"); //TODO: disk space error handler
                }
            }
            else {
                _Kernel.krnTrapError("FILE EXISTS", [fileName]);
            }
        }
        write(fileName, data, isProgram = false) {
            const fatEntry = this.findFATEntry(fileName);
            const FatEntryData = TSOS.Utils.splitEveryOther(sessionStorage.getItem(fatEntry)); //gets the data of FAT entry
            const t = FatEntryData[1];
            const s = FatEntryData[2];
            const b = FatEntryData[3];
            let dataAddress = this.formatTSB(parseInt(t), parseInt(s), parseInt(b));
            let dataBlockArr = TSOS.Utils.splitEveryOther(sessionStorage.getItem(dataAddress));
            let encodedData;
            if (isProgram) { //if it's a program there's no need to encode the data.
                encodedData = TSOS.Utils.splitEveryOther(data);
            }
            else {
                encodedData = TSOS.Utils.splitEveryOther(this.encodeData(data));
            }
            console.log(encodedData.join(""));
            let i = 0;
            while (i < encodedData.length) {
                dataBlockArr[(i % 60) + 4] = encodedData[i];
                console.log(`i: ${i} | Data: ${encodedData[i]} (Decoded: ${String.fromCharCode(parseInt(encodedData[i], 16))}) Written to block: ${dataAddress} Loc: ${(i % 60) + 4} as ${dataBlockArr[(i % 60) + 4]}`);
                i++;
                if (i % 60 === 0 && i !== 0) { //if it's over the limit we need to go to a new block
                    dataBlockArr[0] = "01";
                    sessionStorage.setItem(dataAddress, dataBlockArr.join(""));
                    const freeBlock = this.findFreeData();
                    if (freeBlock) {
                        const [nt, ns, nb] = freeBlock.split(".");
                        dataBlockArr[1] = "0" + nt;
                        dataBlockArr[2] = "0" + ns;
                        dataBlockArr[3] = "0" + nb;
                        sessionStorage.setItem(dataAddress, dataBlockArr.join(""));
                        dataAddress = this.formatTSB(parseInt(nt), parseInt(ns), parseInt(nb));
                        dataBlockArr = TSOS.Utils.splitEveryOther(sessionStorage.getItem(dataAddress));
                        //
                    }
                    else {
                        _Kernel.krnTrapError("NO DISK SPACE");
                    }
                }
            }
            dataBlockArr[1] = "00";
            dataBlockArr[2] = "00";
            dataBlockArr[3] = "00";
            sessionStorage.setItem(dataAddress, dataBlockArr.join(""));
            _DiskDisplay.update();
        }
        read(fileName) {
            let FATEntry = this.findFATEntry(fileName);
            let FATasArr = TSOS.Utils.splitEveryOther(sessionStorage.getItem(FATEntry));
            let pointedLoc = this.formatTSB(parseInt(FATasArr[1]), parseInt(FATasArr[2]), parseInt(FATasArr[3]));
            let rawData = sessionStorage.getItem(pointedLoc);
            let rawDataArr = TSOS.Utils.splitEveryOther(rawData);
            let nextPoint = this.formatTSB(parseInt(rawDataArr[1]), parseInt(rawDataArr[2]), parseInt(rawDataArr[3]));
            let output = "";
            output = this.decodeData(rawData);
            /*while (pointedLoc !== "0.0.0"){
                let currentData = this.decodeData(rawData);
                console.log(`data at ${pointedLoc}: ${currentData}`);
                output = output + currentData;
                pointedLoc = nextPoint;
                rawData = sessionStorage.getItem(pointedLoc);
                rawDataArr = Utils.splitEveryOther(rawData);
                nextPoint = this.formatTSB(parseInt(rawDataArr[1]), parseInt(rawDataArr[2]), parseInt(rawDataArr[3]));
            }*/
            console.log(`Output: ${output}`);
            return output;
        }
        delete(fileName) {
            let FATEntry = this.findFATEntry(fileName);
            let FATasArr = TSOS.Utils.splitEveryOther(sessionStorage.getItem(FATEntry));
            let pointedLoc = this.formatTSB(parseInt(FATasArr[1]), parseInt(FATasArr[2]), parseInt(FATasArr[3]));
            let rawData = sessionStorage.getItem(pointedLoc);
            let rawDataArr = TSOS.Utils.splitEveryOther(rawData);
            let nextPoint = this.formatTSB(parseInt(rawDataArr[1]), parseInt(rawDataArr[2]), parseInt(rawDataArr[3]));
            while (pointedLoc !== "0.0.0") {
                //overwrite the data
                rawData = this.fetchBlank();
                sessionStorage.setItem(pointedLoc, rawData);
                pointedLoc = nextPoint;
                rawData = sessionStorage.getItem(pointedLoc);
                rawDataArr = TSOS.Utils.splitEveryOther(rawData);
                nextPoint = this.formatTSB(parseInt(rawDataArr[1]), parseInt(rawDataArr[2]), parseInt(rawDataArr[3]));
            }
            //overwrite the FAT
            rawData = this.fetchBlank();
            sessionStorage.setItem(FATEntry, rawData);
            _DiskDisplay.update();
        }
        fetchFileList() {
            let output = [];
            for (let s = 0; s < this.sectors; s++) {
                for (let b = 0; b < this.blocks; b++) {
                    let FATDataArr = TSOS.Utils.splitEveryOther(sessionStorage.getItem(this.formatTSB(0, s, b)));
                    if ((FATDataArr[0] === "01") && (FATDataArr[1] !== "FF")) {
                        console.log(FATDataArr);
                        output.push(this.decodeData(FATDataArr.join("")));
                    }
                }
            }
            console.log(output);
            return output;
        }
        copy(fileName, newFileName) {
            const data = this.read(fileName); // get the data with the read function we already made
            if (this.findFATEntry(newFileName)) { //if the entry exists, we're gonna copy there
                this.write(newFileName, data);
            }
            else { //otherwise, create a new file
                this.createFile(newFileName);
                this.write(newFileName, data);
            }
        }
        rename(fileName, newName) {
            if (!this.findFATEntry(newName)) {
                let FATEntryArr = TSOS.Utils.splitEveryOther(sessionStorage.getItem(this.findFATEntry(fileName)));
                let encodedNameArr = TSOS.Utils.splitEveryOther(this.encodeData(newName));
                for (let i = 0; i < 60; i++) {
                    if (i < encodedNameArr.length) {
                        FATEntryArr[i + 4] = encodedNameArr[i];
                    }
                    else {
                        FATEntryArr[i + 4] = "00";
                    }
                }
                sessionStorage.setItem(this.findFATEntry(fileName), FATEntryArr.join(""));
                _DiskDisplay.update();
                _StdOut.putText(`File ${fileName} renamed to ${newName}`);
            }
            else {
                _Kernel.krnTrapError("FILE EXISTS", [newName]);
            }
        }
    }
    TSOS.DeviceDriverDisk = DeviceDriverDisk;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=deviceDriverDisk.js.map