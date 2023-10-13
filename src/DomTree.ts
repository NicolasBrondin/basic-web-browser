import { DomNode } from "./DomNode";

export class DomTree {
    document: DomNode = new DomNode("html", null);
    constructor() {
    }

    findNodeByName(name: string, startNode?: DomNode) : DomNode | undefined {
        if(!startNode){
            startNode = this.document;
        }
        if(startNode.name == name){
            return startNode;
        }
        for (const child of startNode.children) {
            const node = this.findNodeByName(name, child);
            if(node){
                return node;
            }
        }
        
    }

}