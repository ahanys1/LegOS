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
                                    " - Displays current Date and Time.");
            this.commandList[this.commandList.length] = sc;

            // whereami
            sc = new ShellCommand(this.shellWhereAmI,
                "whereami",
                " - Displays current location.");
            this.commandList[this.commandList.length] = sc;

            //legohey
            sc = new ShellCommand(this.shellLegoHey,
                "legohey",
                " - There's a fire in Lego City!");
            this.commandList[this.commandList.length] = sc;

            //status <string>
            sc = new ShellCommand(this.shellStatus,
                "status",
                "<string> - sets the system status message.");
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellLoad,
                "load",
                " - loads the program from the program input.");
            this.commandList[this.commandList.length] = sc;
            
            sc = new ShellCommand(this.shellRun,
                "run",
                "<pid> - Runs the program loaded at pid");
            this.commandList[this.commandList.length] = sc;    

            sc = new ShellCommand(this.shellBSOD,
                "bsod",
                " - executes a Blue Screen of Death error.");
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
                    case "bsod":
                        _StdOut.putText("'bsod' initiates the process for handling a fatal system error. Requires a full reset.");
                        break;
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
                programArray.forEach((code,index) => {
                    _MMU.writeImm(index, parseInt(code,16));
                    index++;
                });
                if (_MMU.PIDs[0] === 42069){ //initialize PIDs if empty
                    _MMU.PIDs = [0];
                } else {
                    _MMU.PIDs.push(_MMU.PIDs[_MMU.PIDs.length - 1] + 1); //pushes next PID to array
                }
                _StdOut.putText(" Program Loaded. PID: " + _MMU.PIDs[_MMU.PIDs.length - 1]);
                _PCB.addProgram(_MMU.PIDs[_MMU.PIDs.length -1]);
                _RAMdisplay.updateDisplay();
                console.log(_MMU.PIDs);
            }else{
                _StdOut.putText("ERR: Program could not be loaded.");
                console.log(invalidChars);
            }
        }

        public shellRun(args:string[]){
            if (_MMU.PIDs.includes(parseInt(args[0]))){ //make sure it's a valid op code
                if(args[0] == "0"){
                    _CPU.init();
                    _SavedState = _Memory.ram;
                    _CPU.PC = partition.zero;
                }//TODO: allow for multiple programs. for now, just do 1.
                _CPU.isExecuting = true;
            } else{
                _StdOut.putText("ERR: Invalid Program ID.");
            }
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
            _Kernel.krnTrapError("BSOD executed. Good job, you broke it.");
            console.log("got to here");
        }

    }
}
