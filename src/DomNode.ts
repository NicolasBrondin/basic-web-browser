export class DomNode {
    name: string = "";
    children: DomNode[] = [];
    value: string | null = null;
    innerHTML?: string;

    constructor(name: string, value: string|null, innerHTML?: string) {
        this.name = name.toLowerCase();
        this.value = value;
        this.innerHTML = innerHTML;
    }

    addChildNode(node: DomNode) {
        this.children.push(node);
    }
}