import { FlexLayout, QLabel, QWidget } from "@nodegui/nodegui";

export class DomNode {
    name: string = "";
    children: DomNode[] = [];
    value: string | null = null;
    innerHTML?: string;
    attributes: {[key: string]: any} = {
        style: {
            display: "block",
        }
    };

    constructor(name: string, value: string|null, innerHTML?: string) {
        this.name = name.toLowerCase();
        this.value = value;
        this.innerHTML = innerHTML;
    }

    addChildNode(node: DomNode) {
        this.children.push(node);
    }
    
    findNodeByName(name: string) : DomNode | undefined {
        for (const child of this.children) {
            if(child.name == name){
                return child;
            }
        }
        for (const child of this.children)
        {   const el = child.findNodeByName(name);
            
            if(el){
                return el;
            }
        }
    }

    render(): QWidget{
        const widget = new QWidget();
        const layout = new FlexLayout();
        widget.setLayout(layout);
        (widget as any).childLayout = layout;

        if(this.value){
            const label = new QLabel();
            label.setText(this.value);
            layout.addWidget(label);
        }

        if(this.attributes.style.display == "none"){
            widget.hide();
        }
        if(this.attributes.style.height){
            // Doesn't work, still taking space
            widget.setFixedHeight(parseInt(this.attributes.style.height, 10));
        }

        return widget;
    }
}