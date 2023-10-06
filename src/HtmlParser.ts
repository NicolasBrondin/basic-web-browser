import { DomNode } from "./DomNode";
import { DomTree } from "./DomTree";

export class HtmlParser {
    parseHtmlDocumentFromText(html: string) : DomTree {
        const dom = new DomTree();
        const document = dom.document;
        dom.document.innerHTML = html;
        let currentNode = document;
        while(currentNode.innerHTML){
            try {
            const node = this.parseDomNodeFromText(currentNode.innerHTML);
            currentNode.addNode(node);
            currentNode = node;
            } catch (error) {
                console.log(error);
                break;
            }
        }
        return dom;
    }
    parseDomNodeFromText(text: string) : DomNode {
        const regex = /<(.+)>(.*)<\/\1>/;
        const result = regex.exec(text.replace(/[\n\r]/g, ''));
        if(!result){
            throw new Error("Invalid html tag");
        }
        return new DomNode(result[1], result[2], result[2]);
    }
}