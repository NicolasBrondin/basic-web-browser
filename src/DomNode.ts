import { FlexLayout, QLabel, QWidget } from "@nodegui/nodegui";
import { HTMLElement, Node, TextNode } from "node-html-parser";
export class DomNode {
    
    element: Node;

    constructor(el: Node){
        this.element = el;
    }
    addChildNode(node: DomNode) {
        this.element.childNodes.push(node.element);
    }
    
    findNodeByName(name: string) : DomNode | undefined {
        for (const child of this.element.childNodes) {
            const domNode = new DomNode(child as HTMLElement);
            if((domNode.element as HTMLElement).tagName == name){
                return domNode;
            }
        }
        for (const child of this.element.childNodes)
        {
            const domNode = new DomNode(child as HTMLElement);
            const el = domNode.findNodeByName(name);
            
            if(el){
                return el;
            }
        }
    }

    render(): QWidget{
        const widget = new QWidget();
        widget.setObjectName("widget");
        const layout = new FlexLayout();
        widget.setLayout(layout);
        (widget as any).xLayout = layout;

        if(this.element instanceof TextNode){
            const label = new QLabel();
            label.setText(this.element.textContent);
            layout.addWidget(label);
        }
        /*widget.setStyleSheet(`#widget {
            border: 1px solid red;
            padding: 5px;
        }`);*/
        /*if(this.attributes.style.display == "none"){
            widget.hide();
        }
        if(this.attributes.style.height){
            // Doesn't work, still taking space
            widget.setFixedHeight(parseInt(this.attributes.style.height, 10));
        }*/

        return widget;
    }
}