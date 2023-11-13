/* ------------
     Console.ts

     The OS Console - stdIn and stdOut by default.
     Note: This is not the Shell. The Shell is the "command line interface" (CLI) or interpreter for this console.
     ------------ */

module TSOS {
    let history: string[] = [];
    let histIndex: number = 0;
    export class Console {

        constructor(public currentFont = _DefaultFontFamily,
                    public currentFontSize = _DefaultFontSize,
                    public currentXPosition = 0,
                    public currentYPosition = _DefaultFontSize,
                    public buffer = "") {
            console.log(currentFontSize);
        }

        public init(): void {
            this.clearScreen();
            this.resetXY();
        }

        public clearScreen(): void {
            _DrawingContext.clearRect(0, 0, _Canvas.width, _Canvas.height);
            console.log("screen Cleared");
        }

        public resetXY(): void {
            this.currentXPosition = 0;
            this.currentYPosition = this.currentFontSize;
        }

        public handleInput(): void {
            
            while (_KernelInputQueue.getSize() > 0) {
                // Get the next character from the kernel input queue.
                var chr = _KernelInputQueue.dequeue();
                // Check to see if it's "special" (enter or ctrl-c) or "normal" (anything else that the keyboard device driver gave us).
                if (chr === String.fromCharCode(13)) { // the Enter key
                    // The enter key marks the end of a console command, so ...
                    history.push(this.buffer); //push buffer to history
                    histIndex = history.length; //set the hist index to the end of the array
                    // ... tell the shell ...
                    _OsShell.handleInput(this.buffer);

                    // ... and reset our buffer.
                    this.buffer = "";
                } else if(chr === String.fromCharCode(8)){ // Backspace
                    //needs to paint over last char, move cursor back by char width, remove char from buffer
                    let prevChar: String = this.buffer.charAt(this.buffer.length-1); //gets the character to delete
                    let prevCharWidth: number = _DrawingContext.measureText(this.currentFont, this.currentFontSize, prevChar) //gets width of previos character
                    let prevCharHeight: number = this.currentFontSize *1.5; //should be char height? same math I've used before
                    _DrawingContext.clearRect(this.currentXPosition - prevCharWidth - 1, this.currentYPosition - prevCharHeight, prevCharWidth + 1, prevCharHeight + 10); //should paint over character
                    //next remove from buffer
                    this.buffer = this.buffer.slice(0,this.buffer.length -1); //slices buffer to axe end
                    this.currentXPosition -= prevCharWidth; //moves cursor back

                } else if(chr === "UP"){ //up arrow
                    console.log(history);
                    console.log(histIndex);
                    if(history[histIndex -1] != undefined){ //make sure the previous item exists
                        //first, will need to clear current buffer, will do similar to backspace
                        histIndex --;
                        let bufferWidth: number = _DrawingContext.measureText(this.currentFont, this.currentFontSize, this.buffer);
                        let bufferHeight: number = this.currentFontSize * 1.5;
                        _DrawingContext.clearRect(this.currentXPosition - bufferWidth - 1, this.currentYPosition - bufferHeight, bufferWidth + 1, bufferHeight + 10);
                        this.currentXPosition -= bufferWidth;
                        //next, we need to set the buffer to this item
                        this.buffer = history[histIndex];
                        this.putText(this.buffer);
                        //lastly, move the prev index
                    }    
                } else if(chr === "DOWN"){ //down arrow
                    console.log(history);
                    console.log(histIndex);
                    if(history[histIndex + 1] != undefined){//make sure the next item exists
                        //first, will need to clear current buffer, will do similar to backspace and up arrow.
                        histIndex ++;
                        let bufferWidth: number = _DrawingContext.measureText(this.currentFont, this.currentFontSize, this.buffer);
                        let bufferHeight: number = this.currentFontSize * 1.5;
                        _DrawingContext.clearRect(this.currentXPosition - bufferWidth - 1, this.currentYPosition - bufferHeight, bufferWidth + 1, bufferHeight + 10);
                        this.currentXPosition -= bufferWidth;
                        //next, set buffer to the new item
                        this.buffer = history[histIndex];
                        this.putText(this.buffer);
                        //lastly, move the index
                    }
                } else if(chr === String.fromCharCode(9)){ //tab
                    //Implemented something similar at USAA using filter
                    let commands: string[] = _OsShell.commandList.map(cmd => cmd.command); //gets the commands
                    commands = commands.filter(cmd => cmd.startsWith(this.buffer)); //filters the list down to commands that start with the buffer
                    //now I have the valid command, but I need to find the best match. reorder array based on length, causing best match to be first
                    commands = commands.sort((a,b) => a.length - b.length); //sorts by length, placing shortest first. Used ChatGPT to learn that you can put an argument in the sort function! did not know that lol
                    console.log(commands);
                    //good, now the best match is at index 0. I can overwrite the buffer and reset the screen.
                    // same code from using the up and down arrows:
                    let bufferWidth: number = _DrawingContext.measureText(this.currentFont, this.currentFontSize, this.buffer);
                    let bufferHeight: number = this.currentFontSize * 1.5;
                    _DrawingContext.clearRect(this.currentXPosition - bufferWidth - 1, this.currentYPosition - bufferHeight, bufferWidth + 1, bufferHeight + 10);
                    this.currentXPosition -= bufferWidth;
                    this.buffer = commands[0];
                    this.putText(this.buffer);
                } else if(chr === "^C"){
                    this.advanceLine();
                    this.putText("^C");
                    this.advanceLine();
                    this.putText("=C ");
                    _OsShell.shellKillAll(null);
                
                }else {
                    // This is a "normal" character, so ...
                    // ... draw it on the screen...
                    this.putText(chr);
                    // ... and add it to our buffer.
                    this.buffer += chr;
                }
            }
        }

        public putText(text): void {
            /*  My first inclination here was to write two functions: putChar() and putString().
                Then I remembered that JavaScript is (sadly) untyped and it won't differentiate
                between the two. (Although TypeScript would. But we're compiling to JavaScipt anyway.)
                So rather than be like PHP and write two (or more) functions that
                do the same thing, thereby encouraging confusion and decreasing readability, I
                decided to write one function and use the term "text" to connote string or char.
            */
            if (text !== "") {
                if(this.currentXPosition >= 785){
                    this.advanceLine();
                }
                // Draw the text at the current X and Y coordinates.
                _DrawingContext.drawText(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition, text);
                // Move the current X position.
                var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, text);
                this.currentXPosition = this.currentXPosition + offset;
            }
         }

        public advanceLine(): void {
            this.currentXPosition = 0;
            /*
             * Font size measures from the baseline to the highest point in the font.
             * Font descent measures from the baseline to the lowest point in the font.
             * Font height margin is extra spacing between the lines.
             */
            this.currentYPosition += _DefaultFontSize + 
                                     _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) +
                                     _FontHeightMargin;

            // TODO: Handle scrolling. (iProject 1) - DONE
            if (this.currentYPosition >= _Canvas.height){
                //convert the current canvas into an image.
                let canvasData = _DrawingContext.getImageData(0, 0, _Canvas.width, _Canvas.height);
                this.clearScreen(); //clear canvas
                _DrawingContext.putImageData(canvasData, 0, 0 - (_DefaultFontSize * 1.5)); //now draw the context shifted up by the font size, and an aditional half for spacing
                this.currentYPosition = _Canvas.height - _DefaultFontSize; //put the current position at the bottom of the canvas
                
            }
        }
    }
 }
