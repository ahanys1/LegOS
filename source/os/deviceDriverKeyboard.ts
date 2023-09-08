/* ----------------------------------
   DeviceDriverKeyboard.ts

   The Kernel Keyboard Device Driver.
   ---------------------------------- */

module TSOS {

    // Extends DeviceDriver
    export class DeviceDriverKeyboard extends DeviceDriver {

        constructor() {
            // Override the base method pointers.

            // The code below cannot run because "this" can only be
            // accessed after calling super.
            // super(this.krnKbdDriverEntry, this.krnKbdDispatchKeyPress);
            // So instead...
            super();
            this.driverEntry = this.krnKbdDriverEntry;
            this.isr = this.krnKbdDispatchKeyPress;
        }

        public krnKbdDriverEntry() {
            // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
            // More?
        }

        public krnKbdDispatchKeyPress(params) {
            // Parse the params.  TODO: Check that the params are valid and osTrapError if not.
            var keyCode = params[0];
            var isShifted = params[1];
            _Kernel.krnTrace("Key code:" + keyCode + " shifted:" + isShifted);
            var chr = "";
            // Check to see if we even want to deal with the key that was pressed.
            if ((keyCode >= 65) && (keyCode <= 90)) { // letter
                if (isShifted === true) { 
                    chr = String.fromCharCode(keyCode); // Uppercase A-Z
                } else {
                    chr = String.fromCharCode(keyCode + 32); // Lowercase a-z
                }
                // TODO: Check for caps-lock and handle as shifted if so.
                
            } else if ((keyCode >= 48) && (keyCode <= 57)){// digits
                if (isShifted){
                    //check each bc no pattern with ascii yaaay
                    if(keyCode == 48){ //0
                        chr = String.fromCharCode(41);
                    }
                    if(keyCode == 49){ //1
                        chr = String.fromCharCode(33);
                    }
                    if(keyCode == 50){ //2
                        chr = String.fromCharCode(64);
                    }
                    if(keyCode == 51){ //3
                        chr = String.fromCharCode(35);
                    }
                    if(keyCode == 52){ //4
                        chr = String.fromCharCode(36);
                    }
                    if(keyCode == 53){ //5
                        chr = String.fromCharCode(37);
                    }
                    if(keyCode == 54){ //6
                        chr = String.fromCharCode(94);
                    }
                    if(keyCode == 55){ //7
                        chr = String.fromCharCode(38);
                    }
                    if(keyCode == 56){ //8
                        chr = String.fromCharCode(42);
                    }
                    if(keyCode == 57){ //9
                        chr = String.fromCharCode(40);
                    }
                } else{
                    chr = String.fromCharCode(keyCode);
                } 
            } else if((keyCode == 32) || (keyCode == 13)) {//space || enter
                chr = String.fromCharCode(keyCode);
            }
            _KernelInputQueue.enqueue(chr);
        }
    }
}
