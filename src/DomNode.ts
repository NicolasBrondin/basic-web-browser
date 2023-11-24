import { FlexLayout, QLabel, QWidget, WidgetEventTypes } from "@nodegui/nodegui";
import { HTMLElement, Node, TextNode } from "node-html-parser";
import BrowserApi from "./BrowserApi";
export class DomNode {
    
    element: Node;

    constructor(el: Node){
        this.element = el;
    }
    addChildNode(node: DomNode) {
        this.element.childNodes.push(node.element);
    }

    getTagName(){
        return (this.element as HTMLElement).tagName?.toLowerCase();
    }

    getAttribute(key: string){
        const keys = Object.keys((this.element as HTMLElement).attributes || {});
        const found = keys.find((k)=> k.toLowerCase() === key.toLowerCase());
        if(!found){
            return null;
        }
        return (this.element as HTMLElement).attributes[found];
    }
    
    findNodeByName(name: string) : DomNode | undefined {
        for (const child of this.element.childNodes) {
            const domNode = new DomNode(child as HTMLElement);
            if(domNode.getTagName() == name){
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

    render(browserApi: BrowserApi): QWidget{
        console.log("[NODE] "+this.getTagName());
        const widget = new QWidget();
        widget.setObjectName("widget");
        const layout = new FlexLayout();
        widget.setLayout(layout);
        (widget as any).xLayout = layout;

        if(this.element instanceof TextNode){
            const label = new QLabel();
            label.setText(this.element.textContent);
            layout.addWidget(label);
            return widget;
        }
        if(this.getTagName() === "a"){
            
            widget.setObjectName("a");
            widget.setStyleSheet(`#a * {
                color: blue;
                text-decoration: underline;
            }`);
            
            widget.addEventListener(WidgetEventTypes.MouseButtonRelease, () => {
               console.log("[DEBUG] LINK CLICKED");
               console.log((this.element as HTMLElement).attributes);
               const url = this.getAttribute("href") || "";
               browserApi.loadPage(url);
            });
            return widget;
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