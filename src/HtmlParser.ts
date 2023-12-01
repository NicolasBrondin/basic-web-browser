import { DomNode } from "./DomNode";
import { DomTree } from "./DomTree";
import { parse } from 'node-html-parser';

export class HtmlParser {
    constructor() {
    }

    parseHtmlDocumentFromText(html: string) : DomTree {
        
        //const document: DomNode = new DomNode(parse('<ul id="list"><li>Hello World</li><li>2</li><li>H3</li></ul>', {}).firstChild);
        const document = new DomNode(parse(html));
        const dom = new DomTree(document);
        //console.log(JSON.stringify(dom,null, 4));
        return dom;
    }
}