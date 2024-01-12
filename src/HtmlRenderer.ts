import { QWidget } from "@nodegui/nodegui";
import { DomTree } from "./DomTree";
import { DomNode } from "./DomNode";
import BrowserApi from "./BrowserApi";

export class HtmlRenderer {
    domTree?: DomTree;
    browserApi: BrowserApi;

    constructor(browserApi: BrowserApi) {
        this.browserApi = browserApi;
    }

    render(domTree: DomTree) {
        this.domTree = domTree;
        if(!this.domTree){
            return;
        }
        this.browserApi.createNewPage();
        console.log("[RENDERER] Render started...");
        this.renderDomNode(this.browserApi.getDocumentWidget(), this.domTree.document);
        this.browserApi.getDocumentWidget().adjustSize();
    }

    renderDomNode(parentWidget: QWidget, node?: DomNode) {
        if(!node){
            return;
        }
        //console.log(`[RENDERER] Rendering node ${(node.element as HTMLElement).tagName}`);
        const widget = node.generate(this.browserApi);
        if(!widget){
            return;
        }

        // Add current to parent widget
        if((parentWidget as any).childLayout){
            (parentWidget as any).childLayout.addWidget(widget);
        } else {
            console.log("[DEBUG] Layout missing");
        }

        
        node.element.childNodes.forEach((el) => {
            const childNode = new DomNode(el);
            this.renderDomNode(widget, childNode);
        });

    }
}