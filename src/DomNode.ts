export class DomNode {
    name: string = "";
    children: DomNode[] = [];
    value?: string;
    innerHTML?: string;

    constructor(name: string, value?: string, innerHTML?: string) {
        this.name = name;
        this.value = value;
        this.innerHTML = innerHTML;
    }

    addNode(node: DomNode) {
        this.children.push(node);
    }
}