/* ------------
     Kernel.ts

     Routines for the Operating System, NOT the host.

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */

module TSOS {

    export class Kernel {
        //
        // OS Startup and Shutdown Routines
        //
        public krnBootstrap() {      // Page 8. {
            Control.hostLog("bootstrap", "host");  // Use hostLog because we ALWAYS want this, even if _Trace is off.

            // Initialize our global queues.
            _KernelInterruptQueue = new Queue();  // A (currently) non-priority queue for interrupt requests (IRQs).
            _KernelBuffers = new Array();         // Buffers... for the kernel.
            _KernelInputQueue = new Queue();      // Where device input lands before being processed out somewhere.

            // Initialize the console.
            _Console = new Console();             // The command line interface / console I/O device.
            _Console.init();

            // Initialize standard input and output to the _Console.
            _StdIn  = _Console;
            _StdOut = _Console;

            // Load the Keyboard Device Driver
            this.krnTrace("Loading the keyboard device driver.");
            _krnKeyboardDriver = new DeviceDriverKeyboard();     // Construct it.
            _krnKeyboardDriver.driverEntry();                    // Call the driverEntry() initialization routine.
            this.krnTrace(_krnKeyboardDriver.status);

            //load disk driver
            this.krnTrace("loading Disk Driver");
            _krnDiskDriver = new DeviceDriverDisk();
            _krnDiskDriver.driverEntry();
            this.krnTrace(_krnDiskDriver.status);

            //
            // ... more?
            //

            // Enable the OS Interrupts.  (Not the CPU clock interrupt, as that is done in the hardware sim.)
            this.krnTrace("Enabling the interrupts.");
            this.krnEnableInterrupts();

            // Launch the shell.
            this.krnTrace("Creating and Launching the shell.");
            _OsShell = new Shell();
            _OsShell.init();

            //Start CPU Display
             _CPUdisplay = new CPUdisplay();
             _CPUdisplay.init();

             //start mem display
             _RAMdisplay = new RAMdisplay();
             _RAMdisplay.init();

             //start disk display
             _DiskDisplay = new diskDisplay();

             //start pcb
             _PCB = new PCB();
             _PCB.init();

             //start scheduler
            _Scheduler = new Scheduler();
            _Scheduler.init();
            //and dispatcher
            _Dispatcher = new Dispatcher();

            // Finally, initiate student testing protocol.
            if (_GLaDOS) {
                _GLaDOS.afterStartup();
            }
        }

        public krnShutdown() {
            this.krnTrace("begin shutdown OS");
            // TODO: Check for running processes.  If there are some, alert and stop. Else...
            // ... Disable the Interrupts.
            this.krnTrace("Disabling the interrupts.");
            this.krnDisableInterrupts();
            //
            // Unload the Device Drivers?
            // More?
            //
            this.krnTrace("end shutdown OS");
            _StdOut.clearScreen(); 
            _StdOut.putText("System successfully shutdown. Please reset the system.");
        }


        public krnOnCPUClockPulse() {
            /* This gets called from the host hardware simulation every time there is a hardware clock pulse.
               This is NOT the same as a TIMER, which causes an interrupt and is handled like other interrupts.
               This, on the other hand, is the clock pulse from the hardware / VM / host that tells the kernel
               that it has to look for interrupts and process them if it finds any.                          
            */

            // Check for an interrupt, if there are any. Page 560
            if (_KernelInterruptQueue.getSize() > 0) {
                // Process the first interrupt on the interrupt queue.
                // TODO (maybe): Implement a priority queue based on the IRQ number/id to enforce interrupt priority.
                var interrupt = _KernelInterruptQueue.dequeue();
                this.krnInterruptHandler(interrupt.irq, interrupt.params);
            } else if (_CPU.isExecuting && !_stepModeEnabled) { // If there are no interrupts then run one CPU cycle if there is anything being processed. Also checks if there is step modes
                _CPU.cycle();
            } else {                       // If there are no interrupts and there is nothing being executed then just be idle.
                this.krnTrace("Idle");
            }
        }


        //
        // Interrupt Handling
        //
        public krnEnableInterrupts() {
            // Keyboard
            Devices.hostEnableKeyboardInterrupt();
            // Put more here.
        }

        public krnDisableInterrupts() {
            // Keyboard
            Devices.hostDisableKeyboardInterrupt();
            // Put more here.
        }

        public krnInterruptHandler(irq, params) {
            // This is the Interrupt Handler Routine.  See pages 8 and 560.
            // Trace our entrance here so we can compute Interrupt Latency by analyzing the log file later on. Page 766.
            this.krnTrace("Handling IRQ~" + irq);

            // Invoke the requested Interrupt Service Routine via Switch/Case rather than an Interrupt Vector.
            // TODO: Consider using an Interrupt Vector in the future.
            // Note: There is no need to "dismiss" or acknowledge the interrupts in our design here.
            //       Maybe the hardware simulation will grow to support/require that in the future.
            switch (irq) {
                case TIMER_IRQ:
                    this.krnTimerISR();               // Kernel built-in routine for timers (not the clock).
                    break;
                case KEYBOARD_IRQ:
                    _krnKeyboardDriver.isr(params);   // Kernel mode device driver
                    _StdIn.handleInput();
                    break;
                case CONTEXT_SWITCH_IRQ:
                    _Dispatcher.completeContextSwitch();
                    break;
                default:
                    this.krnTrapError("Invalid Interrupt Request. irq=" + irq + " params=[" + params + "]");
            }
        }

        public krnTimerISR() {
            // The built-in TIMER (not clock) Interrupt Service Routine (as opposed to an ISR coming from a device driver). {
            // Check multiprogramming parameters and enforce quanta here. Call the scheduler / context switch here if necessary.
            // Or do it elsewhere in the Kernel. We don't really need this.
        }

        //
        // System Calls... that generate software interrupts via tha Application Programming Interface library routines.
        //
        // Some ideas:
        // - ReadConsole
        // - WriteConsole
        // - CreateProcess
        // - ExitProcess
        // - WaitForProcessToExit
        // - CreateFile
        // - OpenFile
        // - ReadFile
        // - WriteFile
        // - CloseFile


        //
        // OS Utility Routines
        //
        public krnTrace(msg: string) {
             // Check globals to see if trace is set ON.  If so, then (maybe) log the message.
             if (_Trace) {
                if (msg === "Idle") {
                    // We can't log every idle clock pulse because it would quickly lag the browser quickly.
                    if (_OSclock % 10 == 0) {
                        // Check the CPU_CLOCK_INTERVAL in globals.ts for an
                        // idea of the tick rate and adjust this line accordingly.
                        Control.hostLog(msg, "OS");
                    }
                } else {
                    Control.hostLog(msg, "OS");
                }
             }
        }

        public krnTrapError(msg, params = []) {
            Control.hostLog("OS ERROR - TRAP: " + msg);
            switch(msg){
                case "INVALID OP":
                    _StdOut.putText("ERR: INVALID OP: " + Utils.hexLog(_CPU.IR, false) + " IN PID: " + _PCB.runningPID);
                    _StdOut.advanceLine();
                    _PCB.terminate(_PCB.runningPID);
                    
                    break;
                case "NO SPACE":
                    _StdOut.putText(" ERR: No Valid Space. Aborting...");
                    _MMU.PIDs.pop();
                    break;
                case "NOT LOADED":
                    _StdOut.putText("ERR: Program could not be loaded. Invalid Characters:");
                    _StdOut.advanceLine();
                    for (let i = 0; i < params.length; i++){
                        _StdOut.putText(`${params[i]} `);
                    }
                    break;
                case "CANNOT RUN":
                    _StdOut.putText("ERR: Program with PID " + params[0] + " can not be run.");
                    break;
                case "PS":
                    _StdOut.putText("ERR: There are no processes.");
                    break;
                case "KILL":
                    _StdOut.putText("ERR: a program must be running for it to be killed.");
                    break;
                case "QUANTUM":
                    _StdOut.putText("ERR: quantum must be greater than 0.");
                    break;
                case "ACCESS":
                    _StdOut.putText(`ERR: ACCESS OUT OF BOUNDS at ${Utils.hexLog(params[0], true)}`);
                    _StdOut.advanceLine();
                    _PCB.terminate(_PCB.runningPID);
                    break;
                case "DISK NOT FORMAT":
                    _StdOut.putText(`ERR: Disk is not formatted. Please format the disk.`);
                    break;
                case "NO DISK SPACE":
                    _StdOut.putText(`ERR: No disk space is available.`);
                    break;
                case "FILENAME TOO LONG":
                    _StdOut.putText(`ERR: Filename:`);
                    _StdOut.advanceLine();
                    _StdOut.putText(`${params[0]}`);
                    _StdOut.advanceLine();
                    _StdOut.putText("is too long.");
                    break;
                case "FILE NOT FOUND":
                    _StdOut.putText(`ERR: File ${params[0]} not found.`);
                    break;
                case "QUOTES": 
                    _StdOut.putText("ERR: file contents must be surounded by quotes.");
                    break;
                case "FILE EXISTS":
                    _StdOut.putText(`ERR: File ${params[0]} already exists.`);
                    break;
                case "BSOD":
                default:
                    let bsod = document.getElementById("bsod");
                    let console = document.getElementById("divConsole");
                    let pcb = document.getElementById("PCB");
                    let container = document.getElementById("middle");

                    container.insertBefore(bsod, console); //swaps the bsod image with the terminal
                    container.appendChild(console);

                    console.style.visibility = "hidden";
                    bsod.style.visibility = "visible";
                    this.krnShutdown();
                    clearInterval(_hardwareClockID);
            }
            
        }
    }
}
