/* --------
   Utils.ts

   Utility functions.
   -------- */

module TSOS {

    export class Utils {

        public static trim(str): string {
            // Use a regular expression to remove leading and trailing spaces.
            return str.replace(/^\s+ | \s+$/g, "");
            /*
            Huh? WTF? Okay... take a breath. Here we go:
            - The "|" separates this into two expressions, as in A or B.
            - "^\s+" matches a sequence of one or more whitespace characters at the beginning of a string.
            - "\s+$" is the same thing, but at the end of the string.
            - "g" makes is global, so we get all the whitespace.
            - "" is nothing, which is what we replace the whitespace with.
            */
        }

        public static rot13(str: string): string {
            /*
               This is an easy-to understand implementation of the famous and common Rot13 obfuscator.
               You can do this in three lines with a complex regular expression, but I'd have
               trouble explaining it in the future.  There's a lot to be said for obvious code.
            */
            var retVal: string = "";
            for (var i in <any>str) {    // We need to cast the string to any for use in the for...in construct.
                var ch: string = str[i];
                var code: number = 0;
                if ("abcedfghijklmABCDEFGHIJKLM".indexOf(ch) >= 0) {
                    code = str.charCodeAt(Number(i)) + 13;  // It's okay to use 13.  It's not a magic number, it's called rot13.
                    retVal = retVal + String.fromCharCode(code);
                } else if ("nopqrstuvwxyzNOPQRSTUVWXYZ".indexOf(ch) >= 0) {
                    code = str.charCodeAt(Number(i)) - 13;  // It's okay to use 13.  See above.
                    retVal = retVal + String.fromCharCode(code);
                } else {
                    retVal = retVal + ch;
                }
            }
            return retVal;
        }

        public static hexLog(num: number, isAddress: boolean){ //this is my hex logging function from Org and Arch!
            let hexString = num.toString(16).toUpperCase();
    
            if(isAddress){
                //if is address, should have 4 val places
                while(hexString.length < 4){
                    hexString = "0" + hexString;
                }
                hexString = "0x" + hexString;
                return hexString;
            }
            else{
                while(hexString.length < 2){
                    hexString = "0" + hexString;
                }
                hexString = "0x" + hexString;
                return hexString;
            }
    
        }

        public static splitEveryOther(str: string): string[]{
            return str.match(/.{1,2}/g) || []; //some regex black magic that chatgpt gave me
        }
        /* Explanation:
        In the regular expression /.{1,2}/g:
        .{1,2} matches any character (except for a newline) between 1 and 2 times.
        g is the global flag that makes the regular expression match all occurrences in the string, rather than just the first one.
        */

    }
}
