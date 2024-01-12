import { FlexLayout, WidgetEventTypes, QMainWindow, QPainter, QWidget, QFontMetrics } from '@nodegui/nodegui';
import { DomNode } from '../DomNode';
import { Node, HTMLElement } from 'node-html-parser';

const win = new QMainWindow();
const center = new QWidget();
const layout = new FlexLayout();
center.setLayout(layout);
win.resize(200, 200);

const node = new HTMLElement("p", {});
node.setAttribute("innerText", "sdf qsdf qsdf qsdfqsdf qsdf qsd fqsdf qsdf qsdf qsdf qsdf");
const domNode = new DomNode(node as Node);

function render(n: DomNode, painter: QPainter){
   const width = win.width();
   const height = win.height();
   n.boundingClientRect.width = width;
   //console.log(n);
   const characterWidth = 5;
   const characterHeight = 16;
   const numberOfCharacters = Math.floor(n.boundingClientRect.width / characterWidth);
   console.log("char", numberOfCharacters);
   const lines = (n.getAttribute("innerText") || "").match(new RegExp(`.{1,${numberOfCharacters}}`, "g"));
   console.log(lines);
   if(lines){
      lines.forEach((line, index)=>{
         painter.drawText(1, n.boundingClientRect.height + ((index+1) * characterHeight), line);
      });
   }
   //painter.setFont
   
}

win.addEventListener(WidgetEventTypes.Paint, () => {
   const painter = new QPainter(win);
   
   render(domNode, painter);
   painter.end();
});
win.show();

(global as any).win = win;