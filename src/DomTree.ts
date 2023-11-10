import { DomNode } from "./DomNode";

export class DomTree {
    document?: DomNode;
    constructor(document?: DomNode) {
        this.document = document;
    }

}