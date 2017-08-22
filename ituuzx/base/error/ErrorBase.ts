namespace itz {
    /**
     * Exception superclass
     * @author ituuz
     * @since 2017.07.11
     */
    export class ErrorBase implements Error {
        public name:string = "itz.ErrorBase";
        constructor(public message:string) {
            console.error("[itz Error]" + message);
        }
    }
}