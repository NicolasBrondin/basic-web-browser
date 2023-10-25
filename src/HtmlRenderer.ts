import { FlexLayout, QLabel, QLayout, QWidget } from "@nodegui/nodegui";
import { DomTree } from "./DomTree";
import { DomNode } from "./DomNode";

export class HtmlRenderer {
    rootWidget?: QWidget;
    domTree?: DomTree;
    constructor(rootWidget: QWidget) {
        this.rootWidget = rootWidget;
    }

    render(domTree: DomTree) {
        this.domTree = domTree;
        if(!this.rootWidget || !this.domTree){
            return;
        }
        console.log("[RENDERER] Render started...");
        this.renderDomNode(this.rootWidget, this.domTree.document);
    }

    renderDomNode(parentWidget: QWidget, node: DomNode) {
        if(!node){
            return;
        }
        console.log(`[RENDERER] Rendering node ${node.name}`);
        const widget = node.render();
        if(!widget){
            return;
        }

        // Add current to parent widget
        if((parentWidget as any).xLayout){
            (parentWidget as any).xLayout.addWidget(widget);
        }

        
        node.children.forEach((childNode) => {
            this.renderDomNode(widget, childNode);
        });

    }
}