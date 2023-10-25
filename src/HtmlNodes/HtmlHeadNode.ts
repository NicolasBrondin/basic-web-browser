import { DomNode } from "../DomNode";

export default class HtmlHeadNode extends DomNode {
    constructor(name: string, value: string|null, innerHTML?: string) {
        super(name, value,  innerHTML);
        this.attributes.style.display = "none";
        this.attributes.style.height = "0px";
    }
}