import { DomNode } from "./DomNode";

export class DomTree {
    document?: DomNode;
    constructor(document?: DomNode) {
        this.document = document;
    }

    toString(){
        return JSON.stringify(this.document, ["element", "tagName", "childNodes", "attributes"], 2);
    }

}