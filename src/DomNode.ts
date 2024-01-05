import { FlexLayout, ImageConversionFlag, QImage, QImageFormat, QLabel, QPixmap, QWidget, WidgetEventTypes } from "@nodegui/nodegui";
import { HTMLElement, Node, TextNode } from "node-html-parser";
import BrowserApi from "./BrowserApi";

type StyleObject = {
    display?: "none" | "flex" | "block" | "inline-block" | "inline" | "grid" ;
    "font-size"?: string;
    color?: string;
}


export class DomNode {
    
    element: Node;
    style: StyleObject = {};

    constructor(el: Node){
        this.element = el;
        const styleString = this.getAttribute("style");
        if(styleString){
            try {
                //font-size: 32px; color: red;
                const styleArray = styleString.split(';');
                this.style = styleArray.reduce((obj: any, cssRule)=>{
                    cssRule = cssRule.trim();
                    if(cssRule){
                        const cssRuleSplitted = cssRule.split(":");
                        const cssKey = (cssRuleSplitted[0] || "").trim();
                        const cssValue = (cssRuleSplitted[1] || "").trim();
                        if(cssKey && cssValue){
                            obj[cssKey] = cssValue;
                        }
                    }
                    return obj;
                }, {}) as StyleObject;
            } catch(e){
                this.style = {};
            }
        }
    }
    addChildNode(node: DomNode) {
        this.element.childNodes.push(node.element);
    }

    getTagName(){
        return (this.element as HTMLElement).tagName?.toLowerCase();
    }

    getAttribute(key: string) {
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
        //console.log("[NODE] "+this.getTagName());

        /* Create Widget */
        const widget = new QWidget();
        widget.setObjectName("widget");
        const layout = new FlexLayout();
        widget.setInlineStyle("flex-direction: row;");
        
        widget.setLayout(layout);

        if(this.element instanceof TextNode){
            const label = new QLabel();
            label.setText(this.element.textContent.trim());
            layout.addWidget(label);
            return widget;
        }

        let pseudoBefore = new QWidget();
        const pseudoAfter = new QWidget();
        pseudoBefore.setObjectName("before");
        pseudoAfter.setObjectName("after");
        
        let childWidget : QWidget|QLabel = new QWidget();
        const childLayout = new FlexLayout();

        if(this.getTagName() === "head"){
            this.style.display = "none";
        } else if(this.getTagName() === "title"){
            this.style.display = "none";
        } else if(this.getTagName() === "script"){
            this.style.display = "none";
        } else if(this.getTagName() === "style"){
            this.style.display = "none";
        } else if(this.getTagName() === "h1"){
            this.style["font-size"] = "32px";
        } else if(this.getTagName() === "a"){

            childWidget.setObjectName("a");
            childWidget.setStyleSheet(`#a * {
                color: blue;
                text-decoration: underline;
            }`);
            
            childWidget.addEventListener(WidgetEventTypes.MouseButtonRelease, () => {
               console.log("[DEBUG] LINK CLICKED");
               console.log((this.element as HTMLElement).attributes);
               const url = this.getAttribute("href") as string || "";
               browserApi.loadPage(url);
            });
        } else if(this.getTagName() === "li"){
            if(this.element.parentNode.tagName.toLowerCase() === "ul"){
                pseudoBefore.setStyleSheet(`
                    width: 6px;
                    height: 6px;
                    background-color: #000000;
                    border-radius: 3px;
                `);
                pseudoBefore.resize(5,5);
            } else {
                const itemIndex = this.element.parentNode.childNodes.findIndex((el: Node)=>{
                    return el == this.element;
                });
                pseudoBefore = new QLabel();
                (pseudoBefore as QLabel).setText(itemIndex+".");
            }

        } else if(this.getTagName() === "hr"){

            childWidget.setObjectName("hr");
            childWidget.setInlineStyle(`
                border-bottom-color: grey;
                border-bottom-width: 1px;
                border-bottom-style: solid;
                flex: 1;
            `);
            //childWidget.setFixedHeight(10);
            widget.setFixedHeight(1);
            
        } else if(this.getTagName() === "img"){
            childWidget = new QLabel();
            browserApi.loadImage(this.getAttribute("src") as string, (buffer: Buffer)=>{
                
                childWidget.setObjectName("image");
                const qImage = new QImage();
                qImage.loadFromData(buffer);
                const pixelMap = QPixmap.fromImage(qImage, ImageConversionFlag.AutoColor);
                widget.setObjectName("debug");
                (childWidget as QLabel).setPixmap(pixelMap);

                
                childWidget.setInlineStyle("height: 50px;");
                childWidget.setFixedHeight(50);
                widget.setFixedHeight(50);
                
                //childWidget.setFixedSize(pixelMap.width(), pixelMap.height()); //[To-Do] : Not working
                //widget.setFixedSize(pixelMap.width(), pixelMap.height()); //[To-Do] : Not working
                //browserApi.getDocumentWidget().adjustSize();
                
                
                /*console.log("[DEBUG] Label", imageWidget.width(), imageWidget.height());
                console.log("[DEBUG] QImage", qImage.width(), qImage.height());
                console.log("[DEBUG] QPixmap", pixelMap.width(), pixelMap.height());*/
                //childWidget.resize(pixelMap.width(), pixelMap.height());
            });
            
            /*request({ method: "GET", uri: this.getAttribute("src") as string }, function (error:any, response:any, body) {


                
                if (!error && response.statusCode == 200) {
                    //const data = "data:" + response.headers["content-type"] + ";base64," + Buffer.from(body).toString('base64');
                    console.log("[IMAGE] Loaded" + body);
                    
                    
                } else {
                    console.error(response?.statusCode, error, response);
                }
            });*/
            
        }

        layout.addWidget(pseudoBefore);
        layout.addWidget(childWidget);
        try {
            childWidget.setLayout(childLayout);
            //childWidget.setStyleSheet("flex-direction: 'column';");
        } catch(e){
            console.warn(e);
        }
        (widget as any).childLayout = childLayout;
        
        this.applyStyle(widget, childWidget, pseudoBefore, pseudoAfter);
        layout.addWidget(pseudoAfter);
        return widget;
    }

    applyStyle(globalWidget: QWidget, childWidget: QWidget, pseudoBefore: QWidget, pseudoAfter: QWidget){
        console.log("[STYLE]", this.style);
        let childStyleSheet = "";
        let pseudoBeforeStyleSheet = pseudoBefore.styleSheet();
        if(this.style.display == "none"){
            globalWidget.hide();
        }
        if(this.style["font-size"]){
            childStyleSheet +=`font-size: ${this.style["font-size"]};`;
            //if li
            pseudoBeforeStyleSheet += `width: ${this.style["font-size"]};height: ${this.style["font-size"]};`;

        }
        if(this.style["color"]){
            childStyleSheet +=`color: ${this.style["color"]};`;
            //if li 
            pseudoBeforeStyleSheet += `background-color: ${this.style["color"]};`;
        }
        childWidget.setStyleSheet(childStyleSheet);
        pseudoBefore.setStyleSheet(pseudoBeforeStyleSheet);
    }

}