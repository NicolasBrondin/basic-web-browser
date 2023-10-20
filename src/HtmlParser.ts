import { DomNode } from "./DomNode";
import { DomTree } from "./DomTree";
import HtmlHeadNode from "./HtmlNodes/HtmlHeadNode";

export class HtmlParser {
    parseHtmlDocumentFromText(html: string) : DomTree {
        const dom = new DomTree();
        const document = dom.document;
        document.innerHTML = html;
        this.parseChildrenDomNodes(document);
        //console.log(JSON.stringify(dom,null, 4));
        return dom;
    }
    parseChildrenDomNodes(node: DomNode) {
        if(!node.innerHTML){
            return [];
        }
        node.innerHTML = node.innerHTML.trim();
        const regex = /<(.+)>(.*)<\/\1>/gmsi;
        const groups = node.innerHTML.match(regex);
        groups?.forEach((nodeRaw) => {
            regex.lastIndex = 0; //https://stackoverflow.com/questions/38910334/regular-expression-exec-function-does-not-work-multiple-times
            const parsedNode = regex.exec(nodeRaw);
            if(parsedNode){
                const [_, el, content] = parsedNode;

                let newNode;
                if(el.toLowerCase() == "head" || el.toLowerCase() == "header"){
                    newNode = new HtmlHeadNode(el, null, content);
                } else {
                    newNode = new DomNode(el, null, content);
                }
                node.addChildNode(newNode);
                this.parseChildrenDomNodes(newNode);
            }
        });
        if(!groups){
            node.value = node.innerHTML;
        }
    }
}