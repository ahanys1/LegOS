/* ------------
   Shell.ts

   The OS Shell - The "command line interface" (CLI) for the console.

    Note: While fun and learning are the primary goals of all enrichment center activities,
          serious injuries may occur when trying to write your own Operating System.
   ------------ */

// TODO: Write a base class / prototype for system services and let Shell inherit from it.

module TSOS {
    export class Shell {
        // Properties
        public promptStr = "=C ";
        public commandList = [];
        public curses = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
        public apologies = "[sorry]";

        constructor() {
        }

        public init() {
            var sc: ShellCommand;
            //
            // Load the command list.

            // ver
            sc = new ShellCommand(this.shellVer,
                                  "ver",
                                  "- Displays the current version.");
            this.commandList[this.commandList.length] = sc;

            // help
            sc = new ShellCommand(this.shellHelp,
                                  "help",
                                  "- This is the help command. Seek help if you don't know how you just used this.");
            this.commandList[this.commandList.length] = sc;

            // shutdown
            sc = new ShellCommand(this.shellShutdown,
                                  "shutdown",
                                  "- Shuts down the virtual OS but leaves the underlying host / hardware simulation running.");
            this.commandList[this.commandList.length] = sc;

            // cls
            sc = new ShellCommand(this.shellCls,
                                  "cls",
                                  "- Clears the screen and resets the cursor position.");
            this.commandList[this.commandList.length] = sc;

            // man <topic>
            sc = new ShellCommand(this.shellMan,
                                  "man",
                                  "<topic> - Displays the MANual page for <topic>.");
            this.commandList[this.commandList.length] = sc;

            // trace <on | off>
            sc = new ShellCommand(this.shellTrace,
                                  "trace",
                                  "<on | off> - Turns the OS trace on or off.");
            this.commandList[this.commandList.length] = sc;

            // rot13 <string>
            sc = new ShellCommand(this.shellRot13,
                                  "rot13",
                                  "<string> - Does rot13 obfuscation on <string>.");
            this.commandList[this.commandList.length] = sc;

            // prompt <string>
            sc = new ShellCommand(this.shellPrompt,
                                  "prompt",
                                  "<string> - Sets the prompt.");
            this.commandList[this.commandList.length] = sc;

            // date
            sc = new ShellCommand(this.shellDate,
                                    "date",
                                    "- Displays current Date and Time.");
            this.commandList[this.commandList.length] = sc;

            // whereami
            sc = new ShellCommand(this.shellWhereAmI,
                "whereami",
                "- Displays current location.");
            this.commandList[this.commandList.length] = sc;

            //legohey
            sc = new ShellCommand(this.shellLegoHey,
                "legohey",
                "- There's a fire in Lego City!");
            this.commandList[this.commandList.length] = sc;

            //status <string>
            sc = new ShellCommand(this.shellStatus,
                "status",
                "<string> - sets the system status message.");
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellLoad,
                "load",
                "- loads the program from the program input.");
            this.commandList[this.commandList.length] = sc;
            
            sc = new ShellCommand(this.shellRun,
                "run",
                "<pid> - Runs the program loaded at pid");
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellRunAll,
                "runall",
                "- Runs all programs in the Resident List");
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellBSOD,
                "bsod",
                "- executes a Blue Screen of Death error.");
            this.commandList[this.commandList.length] = sc; 
            
            sc = new ShellCommand(this.shellClearMem,
                "clearmem",
                "- clears all memory partitions.");
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellPS,
                "ps",
                "- displays the PID and state of all processes.");
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellKill,
                "kill",
                "<pid> - kills the specified prodess.");
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellKillAll,
                "killall",
                "- Kills all running processes.");
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellQuantum,
                "quantum",
                "<q> - updates the quantum to the set number.");
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellFormat,
                "format", 
                "- Initialize all blocks in all sectors in all tracks of the disk.");
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellCreate,
                "create",
                "<filename> — Create a File.");
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellWrite,
                "write",
                '<filename> <"data"> - writes the data inside the quotations.');
            this.commandList[this.commandList.length] = sc;
            sc = new ShellCommand(this.shellRead,
                "read",
                '<filename> - reads the data on the specified file.');
            this.commandList[this.commandList.length] = sc;
            sc = new ShellCommand(this.shellDelete,
                "delete",
                '<filename> - removes filename from storage.');
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellLS,
                "ls",
                '[-a] - list the current files on disk.');
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellCopy,
                "copy",
                '<existingfileName> <newfileName> - copy the file data.');
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellRename,
                "rename",
                '<existingfileName> <newfileName> - rename the file.');
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellGetSchedule,
                "getschedule",
                '- gets the current scheduling algorithm.');
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellSetSchedule,
                "setschedule",
                '<rr | fcfs> - sets the scheduling algorithm.');
            this.commandList[this.commandList.length] = sc;
            // ps  - list the running processes and their IDs
            // kill <id> - kills the specified process id.

            // Display the initial prompt.
            this.putPrompt();
        }

        public putPrompt() {
            _StdOut.putText(this.promptStr);
        }

        public handleInput(buffer) {
            _Kernel.krnTrace("Shell Command~" + buffer);
            //
            // Parse the input...
            //
            var userCommand = this.parseInput(buffer);
            // ... and assign the command and args to local variables.
            var cmd = userCommand.command;
            var args = userCommand.args;
            //
            // Determine the command and execute it.
            //
            // TypeScript/JavaScript may not support associative arrays in all browsers so we have to iterate over the
            // command list in attempt to find a match. 
            // TODO: Is there a better way? Probably. Someone work it out and tell me in class.
            var index: number = 0;
            var found: boolean = false;
            var fn = undefined;
            while (!found && index < this.commandList.length) {
                if (this.commandList[index].command === cmd) {
                    found = true;
                    fn = this.commandList[index].func;
                } else {
                    ++index;
                }
            }
            if (found) {
                this.execute(fn, args);  // Note that args is always supplied, though it might be empty.
            } else {
                // It's not found, so check for curses and apologies before declaring the command invalid.
                if (this.curses.indexOf("[" + Utils.rot13(cmd) + "]") >= 0) {     // Check for curses.
                    this.execute(this.shellCurse);
                } else if (this.apologies.indexOf("[" + cmd + "]") >= 0) {        // Check for apologies.
                    this.execute(this.shellApology);
                } else { // It's just a bad command. {
                    this.execute(this.shellInvalidCommand);
                }
            }
        }

        // Note: args is an optional parameter, ergo the ? which allows TypeScript to understand that.
        public execute(fn, args?) {
            // We just got a command, so advance the line...
            _StdOut.advanceLine();
            // ... call the command function passing in the args with some über-cool functional programming ...
            fn(args);
            // Check to see if we need to advance the line again
            if (_StdOut.currentXPosition > 0) {
                _StdOut.advanceLine();
            }
            // ... and finally write the prompt again.
            this.putPrompt();
        }

        public parseInput(buffer: string): UserCommand {
            var retVal = new UserCommand();

            // 1. Remove leading and trailing spaces.
            buffer = Utils.trim(buffer);

            // 2. Lower-case it.
            buffer = buffer.toLowerCase();

            // 3. Separate on spaces so we can determine the command and command-line args, if any.
            var tempList = buffer.split(" ");

            // 4. Take the first (zeroth) element and use that as the command.
            var cmd = tempList.shift();  // Yes, you can do that to an array in JavaScript. See the Queue class.
            // 4.1 Remove any left-over spaces.
            cmd = Utils.trim(cmd);
            // 4.2 Record it in the return value.
            retVal.command = cmd;

            // 5. Now create the args array from what's left.
            for (var i in tempList) {
                var arg = Utils.trim(tempList[i]);
                if (arg != "") {
                    retVal.args[retVal.args.length] = tempList[i];
                }
            }
            return retVal;
        }

        //
        // Shell Command Functions. Kinda not part of Shell() class exactly, but
        // called from here, so kept here to avoid violating the law of least astonishment.
        //
        public shellInvalidCommand() {
            _StdOut.putText("Invalid Command. ");
            if (_SarcasticMode) {
                _StdOut.putText("Unbelievable. You, [subject name here],");
                _StdOut.advanceLine();
                _StdOut.putText("must be the pride of [subject hometown here].");
            } else {
                _StdOut.putText("Type 'help' for, well... help.");
            }
        }

        public shellCurse() {
            _StdOut.putText("Oh, so that's how it's going to be, eh? Fine.");
            _StdOut.advanceLine();
            _StdOut.putText("Bitch.");
            _SarcasticMode = true;
        }

        public shellApology() {
           if (_SarcasticMode) {
              _StdOut.putText("I think we can put our differences behind us.");
              _StdOut.advanceLine();
              _StdOut.putText("For science . . . You monster.");
              _SarcasticMode = false;
           } else {
              _StdOut.putText("For what?");
           }
        }

        // Although args is unused in some of these functions, it is always provided in the 
        // actual parameter list when this function is called, so I feel like we need it.

        public shellVer(args: string[]) {
            _StdOut.putText(APP_NAME + " version " + APP_VERSION);
        }

        public shellHelp(args: string[]) {
            _StdOut.putText("Commands:");
            for (var i in _OsShell.commandList) {
                _StdOut.advanceLine();
                _StdOut.putText("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description);
            }
        }

        public shellShutdown(args: string[]) {
             _StdOut.putText("Shutting down...");
             // Call Kernel shutdown routine.
            _Kernel.krnShutdown();
            // TODO: Stop the final prompt from being displayed. If possible. Not a high priority. (Damn OCD!)
        }

        public shellCls(args: string[]) {         
            _StdOut.clearScreen();     
            _StdOut.resetXY();
        }

        public shellMan(args: string[]) {
            if (args.length > 0) {
                var topic = args[0];
                switch (topic) {
                    case "ver":
                        _StdOut.putText("'ver' displays the current running version.");
                        break;
                    case "help":
                        _StdOut.putText("'Help' displays a list of (hopefully) valid commands.");
                        break;
                    case "shutdown":
                        _StdOut.putText("'shutdown' turns off the operating system, however it leaves the hardware running.");
                        break;
                    case "cls":
                        _StdOut.putText("'cls' clears the terminal, and resets the cursor position to the top of the display.");
                        break;
                    case "man":
                        _StdOut.putText("'man' does this.");
                        break;
                    case "trace": 
                        _StdOut.putText("'trace' allows for toggling of the system trace, AKA the host log. input 'on' or 'off' to toggle.");
                        break;
                    case "rot13":
                        _StdOut.putText("'rot13' shifts the input string by 13 characters.");
                        break;
                    case "prompt":
                        _StdOut.putText("'prompt' changes the prompt symbol. By default, this is set to '=C' (a Lego hand).");
                        break;
                    case "date":
                        _StdOut.putText("'date' displays the current date and time in your local time zone.");
                        break;
                    case "whereami":
                        _StdOut.putText("'whereami' displays the VM's current location.");
                        break;
                    case "legohey":
                        _StdOut.putText("'legohey' displays a little easter egg!");
                        break;
                    case "status":
                        _StdOut.putText("'status' allows you to alter the host system's status.");
                        break;
                    case "load":
                        _StdOut.putText("'load' allows you to load the inputted program, and verifies that it is a valid program.");
                        break;
                    case "run":
                        _StdOut.putText("'run <pid>' will execute the program loaded at the specefied program ID.");
                        break;
                    case "bsod":
                        _StdOut.putText("'bsod' initiates the process for handling a fatal system error. Requires a full reset.");
                        break;
                    case "clearmem":
                        _StdOut.putText("'clearmem' clears the memory and terminates all programs.");
                        break;
                    case "runall":
                        _StdOut.putText("'runall' runs all programs in the resident list.");
                        break;
                    case "ps":
                        _StdOut.putText("'ps' displays the PID and state for all proceses.");
                        break;
                    case "kill":
                        _StdOut.putText("'kill <pid>' kills the specified program.");
                        break;
                    case "killall":
                        _StdOut.putText("'killall' kills all running processes");
                        break;
                    case "quantum":
                        _StdOut.putText("'quantum <q>' updates the quantum for the Round Robin CPU scheduling.");
                        break;
                    case "format":
                        _StdOut.putText("'format' Initializes all blocks in all sectors in all tracks of the disk.");
                        break;
                    case "create":
                        _StdOut.putText("'create <filename>' creates a file on disk with that filename.");
                        break;
                    case "write":
                        _StdOut.putText("'write <filename> <data> writes the quotes surrounded data to the file specified on the disk.");
                        break;
                    case "ls":
                        _StdOut.putText("'ls [-a]' lists all files currently stored on disk. Adding -a shows hidden files and programs.");
                        break;
                    case "copy":
                        _StdOut.putText("'copy <existing file> <new file>' coppies the contents to a new file.");
                        break;
                    case "rename":
                        _StdOut.putText("'rename <existing file> <new file>' renames the file.");
                        break;
                    case "getschedule":
                        _StdOut.putText("'getschedule' gets the current scheduling algorithm.");
                        break;
                    case "setschedule":
                        _StdOut.putText("'setschedule <rr | fcfs>' sets the scheduling algorithm.");
                    default:
                        _StdOut.putText("No manual entry for " + args[0] + ".");
                }
            } else {
                _StdOut.putText("Usage: man <topic>  Please supply a topic.");
            }
        }

        public shellDate(args: string[]){
            const date = new Date();
            _StdOut.putText(date.toLocaleString());
        }

        public shellWhereAmI(args: string[]){
            _StdOut.putText("Lego City, Denmark");
        }

        public shellLegoHey(args:string[]){
            _StdOut.putText("    _ ");
            _StdOut.advanceLine();
            _StdOut.putText("   [_] ");
            _StdOut.advanceLine();
            _StdOut.putText(" /;   :\\");
            _StdOut.advanceLine();
            _StdOut.putText("() '___'()");
            _StdOut.advanceLine();
            _StdOut.putText("   | | |");
            _StdOut.advanceLine();
            _StdOut.putText("  [=|=]");
        }

        public shellStatus(args:string[]){
            document.getElementById("status").innerHTML = "status | " + args.join(" ");
        }

        public shellLoad(args:string[]){
            let inputBox = document.getElementById("taProgramInput") as HTMLTextAreaElement;//thanks Austin
            let program: string = inputBox.value; 
            const validSymbols: string = "1234567890ABCDEFabcdef ";
            let isValid: boolean = true;
            let invalidChars:string[] = [];
            //make sure program is not empty
            if (program == ""){
                isValid = false;
            }
            //loop through to confirm values are good
            for (const char of program){
                if (!validSymbols.includes(char)){
                    isValid=false;
                    invalidChars.push(char);
                }
            }
            if(isValid){
                _StdOut.putText("Program is Valid. Loading into Memory...");
                let programArray = program.split(" ");
                if (_MMU.PIDs[0] === 42069){ //initialize PIDs if empty
                    _MMU.PIDs = [0];
                } else {
                    _MMU.PIDs.push(_MMU.PIDs[_MMU.PIDs.length - 1] + 1); //pushes next PID to array
                }
                let segment: number = _MMU.findValidSpace();
                let status = _MMU.writeInit(programArray, segment)
                if (status === true){
                    _StdOut.putText(" Program Loaded. PID: " + _MMU.PIDs[_MMU.PIDs.length - 1]);
                    _PCB.addProgram(_MMU.PIDs[_MMU.PIDs.length -1], segment);
                    _RAMdisplay.updateDisplay();
                    console.log(_MMU.PIDs);
                } else if (status === false){
                    _StdOut.putText(` Program loaded to disk. PID: ${_MMU.PIDs[_MMU.PIDs.length - 1]}`);
                    _PCB.addProgram(_MMU.PIDs[_MMU.PIDs.length -1], segment);
                } else { //returns null if it's not formatted
                    _Kernel.krnTrapError("DISK NOT FORMAT");
                    _MMU.PIDs.pop();
                }
            }else{
                _Kernel.krnTrapError("NOT LOADED", invalidChars);
            }
        }

        public shellRun(args:string[]){
            const pidToRun: number = parseInt(args[0]);
            if (pidToRun in _PCB.processes && _PCB.processes[pidToRun].Status == "Resident") {
                // Add the program with the specified PID to the ready queue
                _Scheduler.readyQueue.enqueue(_PCB.processes[pidToRun]);
                // Start the CPU execution if not executing
                if (!_CPU.isExecuting) {
                    _Scheduler.CQ = 1;
                    _PCB.runningPID = pidToRun;
                    console.log(_PCB.runningPID);
                    _Scheduler.schedule();
                }
                document.getElementById("runningGIF").style.visibility = "visible";
            } else {
                _Kernel.krnTrapError("CANNOT RUN",[pidToRun]);
            }
        }

        public shellRunAll(args:string[]){
            for (const pid in _PCB.processes){
                if (_PCB.processes[pid].Status === "Resident") {
                    _Scheduler.readyQueue.enqueue(_PCB.processes[pid]);
                    _PCB.processes[pid].Status = "Ready"; // Update the status to "Ready"
                }
                // Start the CPU execution if not already executing
                if (!_CPU.isExecuting) {
                    _Scheduler.CQ = 1;
                    const nextProcess = _Scheduler.readyQueue.peek();
                    if (nextProcess) {
                        _PCB.runningPID = nextProcess.PID;
                        _Scheduler.schedule();
                    }
                }
            }
            document.getElementById("runningGIF").style.visibility = "visible";
        }

        public shellTrace(args: string[]) {
            if (args.length > 0) {
                var setting = args[0];
                switch (setting) {
                    case "on":
                        if (_Trace && _SarcasticMode) {
                            _StdOut.putText("Trace is already on, doofus.");
                        } else {
                            _Trace = true;
                            _StdOut.putText("Trace ON");
                        }
                        break;
                    case "off":
                        _Trace = false;
                        _StdOut.putText("Trace OFF");
                        break;
                    default:
                        _StdOut.putText("Invalid arguement.  Usage: trace <on | off>.");
                }
            } else {
                _StdOut.putText("Usage: trace <on | off>");
            }
        }

        public shellRot13(args: string[]) {
            if (args.length > 0) {
                // Requires Utils.ts for rot13() function.
                _StdOut.putText(args.join(' ') + " = '" + Utils.rot13(args.join(' ')) +"'");
            } else {
                _StdOut.putText("Usage: rot13 <string>  Please supply a string.");
            }
        }

        public shellPrompt(args: string[]) {
            if (args.length > 0) {
                _OsShell.promptStr = args[0];
            } else {
                _StdOut.putText("Usage: prompt <string>  Please supply a string.");
            }
        }

        public shellBSOD(args: string[]){
            _Kernel.krnTrapError("BSOD");
        }

        public shellClearMem(args: string[]){
            _Memory.reset();
            _PCB.terminateAll();
            _RAMdisplay.updateDisplay();
        }

        public shellPS(args: string[]){
            if(_PCB.processes[0]){ //if pcb has contents
                for (const pid in _PCB.processes){
                    const processInfo = _PCB.processes[pid];
                    _StdOut.putText(`PID: ${processInfo.PID} | State: ${processInfo.Status}`);
                    _StdOut.advanceLine();
                }
            } else {
                _Kernel.krnTrapError("PS");
            }
        }

        public shellKill(args: string[]){
            if ((_PCB.processes[parseInt(args[0])].Status != "Resident" && _PCB.processes[parseInt(args[0])].Status != "Terminated") && _PCB.processes[_PCB.runningPID] !== undefined){
                if (_PCB.processes[parseInt(args[0])].Status == "Running"){
                    _PCB.terminate(parseInt(args[0]));
                } else if (_PCB.processes[parseInt(args[0])].Status == "Ready"){ //if not active running program terminate differently
                    _PCB.processes[parseInt(args[0])].Status = "Terminated"; //set status terminated
                    _MA.deleteProgram(_PCB.processes[parseInt(args[0])].Segment); //delete that program from the RAM
                    
                }
            } else {
                _Kernel.krnTrapError("KILL");
            }
        }

        public shellKillAll(args: string[]){
            if (_PCB.processes[0]){
                for (const pid in _PCB.processes){
                    if ((_PCB.processes[pid].Status != "Resident" && _PCB.processes[pid].Status != "Terminated") && _PCB.processes[pid] !== undefined){
                        _PCB.terminate(_PCB.processes[pid].PID);
                    }
                }
            }
        }

        public shellQuantum(args: string[]){
            if (parseInt(args[0]) > 0){
                _Scheduler.updateQuantum(parseInt(args[0]));
            } else {
                _Kernel.krnTrapError("QUANTUM");
            }
        }

        public shellFormat(args: string[]){
            if (!_CPU.isExecuting || !_krnDiskDriver.isFormated){
                _krnDiskDriver.format();
                _StdOut.putText("Disk successfully formatted.");
            } else if (_krnDiskDriver.isFormated){
                _Kernel.krnTrapError("RUNTIME FORMAT");
            }
            
        }

        public shellCreate(args: string[]){
            if (_krnDiskDriver.isFormated){
                if (args[0].length <= 28){
                    _krnDiskDriver.createFile(args[0]);
                } else {
                    _Kernel.krnTrapError("FILENAME TOO LONG", args);
                }
            } else {
                _Kernel.krnTrapError("DISK NOT FORMAT"); 
            }
        }

        public shellWrite(args: string[]){
            if (_krnDiskDriver.isFormated){
                if((args[1][0]) === '"' && args[args.length-1][args[args.length-1].length-1] === '"'){ // 50/50 shot i got that right, but I think that checks if the args both start and end in quotes
                    if(_krnDiskDriver.findFATEntry(args[0])){
                        let fileName = args.shift();
                        let data = args.join(" ");
                        data = data.slice(1,-1);//slice the quotes off
                        _krnDiskDriver.write(fileName, data);
                        _StdOut.putText(`file ${fileName} written.`)
                    } else {
                        _Kernel.krnTrapError("FILE NOT FOUND", args);
                    }
                } else {
                    _Kernel.krnTrapError("QUOTES");
                }
            } else {
                _Kernel.krnTrapError("DISK NOT FORMAT");
            }
        }

        public shellRead(args: string[]){
            if (_krnDiskDriver.isFormated){
                if(_krnDiskDriver.findFATEntry(args[0])){
                    _StdOut.putText(_krnDiskDriver.read(args[0]));
                } else {
                    _Kernel.krnTrapError("FILE NOT FOUND", args);
                }
            } else {
                _Kernel.krnTrapError("DISK NOT FORMAT");
            }
        }

        public shellDelete(args: string[]){
            if (_krnDiskDriver.isFormated){
                if(_krnDiskDriver.findFATEntry(args[0])){
                    _krnDiskDriver.delete(args[0]);
                    _StdOut.putText(`File: ${args[0]} deleted.`);
                } else {
                    _Kernel.krnTrapError("FILE NOT FOUND", args);
                }
            } else {
                _Kernel.krnTrapError("DISK NOT FORMAT");
            }
        }

        public shellLS(args: string[]){
            if (_krnDiskDriver.isFormated){
                let isAll: boolean = args[0] === "-a"
                let fileList = _krnDiskDriver.fetchFileList(isAll);
                console.log(fileList);
                for (let file of fileList){
                    _StdOut.putText(file + "    ");
                }
            } else {
                _Kernel.krnTrapError("DISK NOT FORMAT");
            }
        }

        public shellCopy(args: string[]){
            if (_krnDiskDriver.isFormated){
                if(_krnDiskDriver.findFATEntry(args[0])){
                    _krnDiskDriver.copy(args[0], args[1]);
                    _StdOut.putText(`File ${args[0]} coppied to ${args[1]}`);                
                } else {
                    _Kernel.krnTrapError("FILE NOT FOUND", args);
                }
            } else {
                _Kernel.krnTrapError("DISK NOT FORMAT");
            }
        }

        public shellRename(args: string[]){
            if (_krnDiskDriver.isFormated){
                if (_krnDiskDriver.findFATEntry(args[0])){
                    if (args[1].length <= 28){
                        _krnDiskDriver.rename(args[0], args[1]);
                       
                    } else {
                        _Kernel.krnTrapError("FILENAME TOO LONG", [args[1]]);
                    }
                } else {
                    _Kernel.krnTrapError("FILE NOT FOUND", args);
                }
            } else {
                _Kernel.krnTrapError("DISK NOT FORMAT");
            }
        }

        public shellGetSchedule(args: string[]){
            if (_Scheduler.scheduleAlgorithm == "fcfs"){
                _StdOut.putText("Current Schedule: First-come First-serve");
            } else if (_Scheduler.scheduleAlgorithm == "rr"){
                _StdOut.putText("Current Schedule: Round Robin");
            } else {
                _StdOut.putText("Current Schedule: Non-preemptive Priority");
            }
        }

        public shellSetSchedule(args: string[]){
            if (args[0] == "rr"){
                _Scheduler.scheduleAlgorithm = "rr";
                _Scheduler.updateQuantum(6);
                _StdOut.putText("Schedule set: Round Robin");
            } else if (args[0] == "fcfs"){
                _Scheduler.scheduleAlgorithm = "fcfs";
                _Scheduler.updateQuantum(Infinity); //set the quantum infinatly high for fcfs
                _StdOut.putText("Schedule set: First-come First-serve");
            } //add priority if there is time
        }

    }
}
