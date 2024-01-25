import { FlexLayout, WidgetEventTypes, QMainWindow, QPainter, QWidget, QFontMetrics, QColor } from '@nodegui/nodegui';
import { DomNode } from '../DomNode';
import { Node, HTMLElement } from 'node-html-parser';
const PNG = require('pngjs').PNG;
const parseDataUri = require('parse-data-uri');

const win = new QMainWindow();
const center = new QWidget();
const layout = new FlexLayout();
center.setLayout(layout);
win.resize(200, 200);

// Element 1
const node = new HTMLElement("p", {});
node.setAttribute("innerText", "Hello world, je suis un texte de test");
const domNode = new DomNode(node as Node);

// Element 2
const imageSrc = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANCSURBVEiJtZZPbBtFFMZ/M7ubXdtdb1xSFyeilBapySVU8h8OoFaooFSqiihIVIpQBKci6KEg9Q6H9kovIHoCIVQJJCKE1ENFjnAgcaSGC6rEnxBwA04Tx43t2FnvDAfjkNibxgHxnWb2e/u992bee7tCa00YFsffekFY+nUzFtjW0LrvjRXrCDIAaPLlW0nHL0SsZtVoaF98mLrx3pdhOqLtYPHChahZcYYO7KvPFxvRl5XPp1sN3adWiD1ZAqD6XYK1b/dvE5IWryTt2udLFedwc1+9kLp+vbbpoDh+6TklxBeAi9TL0taeWpdmZzQDry0AcO+jQ12RyohqqoYoo8RDwJrU+qXkjWtfi8Xxt58BdQuwQs9qC/afLwCw8tnQbqYAPsgxE1S6F3EAIXux2oQFKm0ihMsOF71dHYx+f3NND68ghCu1YIoePPQN1pGRABkJ6Bus96CutRZMydTl+TvuiRW1m3n0eDl0vRPcEysqdXn+jsQPsrHMquGeXEaY4Yk4wxWcY5V/9scqOMOVUFthatyTy8QyqwZ+kDURKoMWxNKr2EeqVKcTNOajqKoBgOE28U4tdQl5p5bwCw7BWquaZSzAPlwjlithJtp3pTImSqQRrb2Z8PHGigD4RZuNX6JYj6wj7O4TFLbCO/Mn/m8R+h6rYSUb3ekokRY6f/YukArN979jcW+V/S8g0eT/N3VN3kTqWbQ428m9/8k0P/1aIhF36PccEl6EhOcAUCrXKZXXWS3XKd2vc/TRBG9O5ELC17MmWubD2nKhUKZa26Ba2+D3P+4/MNCFwg59oWVeYhkzgN/JDR8deKBoD7Y+ljEjGZ0sosXVTvbc6RHirr2reNy1OXd6pJsQ+gqjk8VWFYmHrwBzW/n+uMPFiRwHB2I7ih8ciHFxIkd/3Omk5tCDV1t+2nNu5sxxpDFNx+huNhVT3/zMDz8usXC3ddaHBj1GHj/As08fwTS7Kt1HBTmyN29vdwAw+/wbwLVOJ3uAD1wi/dUH7Qei66PfyuRj4Ik9is+hglfbkbfR3cnZm7chlUWLdwmprtCohX4HUtlOcQjLYCu+fzGJH2QRKvP3UNz8bWk1qMxjGTOMThZ3kvgLI5AzFfo379UAAAAASUVORK5CYII="
const imageNode = new HTMLElement("img", {});
imageNode.setAttribute("src", imageSrc);

const imageDomNode = new DomNode(imageNode);
imageDomNode.style.width = "25px";
imageDomNode.style.height = "25px";

// Element 3
const node3 = new HTMLElement("p", {});
node3.setAttribute("innerText", "lorem ispum doloret sit amet lorem ispum doloret sit amet lorem ispum doloret sit amet lorem ispum doloret sit amet ");
const domNode3 = new DomNode(node3 as Node);

// Element 4
const imageSrc4 = "data:image/png;base64,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"
const imageNode4 = new HTMLElement("img", {});
imageNode4.setAttribute("src", imageSrc4);
const imageDomNode4 = new DomNode(imageNode4);
imageDomNode4.style.width = "120px";
imageDomNode4.style.height = "120px";

// Fake DOM
let domRoot = new HTMLElement("body", {});
let domRootNode = new DomNode(domRoot);

let dom : DomNode[] = [domNode, imageDomNode, domNode3, imageDomNode4];

function renderParagraphNode(widget: QWidget, n: DomNode, painter: QPainter){
   const brush = new QColor("black");
   painter.setPen(brush);
   const characterWidth = 5;
   const characterHeight = 16;
   const numberOfCharacters = Math.floor(n.boundingClientRect.width / characterWidth);
   const lines = (n.getAttribute("innerText") || "").match(new RegExp(`.{1,${numberOfCharacters}}`, "g"));
   if(lines){
      lines.forEach((line, index)=>{
         painter.drawText(1, n.boundingClientRect.top + ((index+1) * characterHeight), line);
      });
   }
}

function renderImageNode(widget: QWidget, n: DomNode, painter: QPainter){
   let data = parseDataUri(n.getAttribute("src"));

   const img = PNG.sync.read(data.data);
   for (var y = 0; y < img.height; y++) {
      for (var x = 0; x < img.width; x++) {
         var idx = (img.width * y + x) << 2;
         const brush = new QColor();
         brush.setRed(img.data[idx]);
         brush.setBlue(img.data[idx + 2]);
         brush.setGreen(img.data[idx + 1]);
         brush.setAlpha(img.data[idx + 3]);
         painter.setPen(brush);
         painter.drawPoint(n.boundingClientRect.left + x, n.boundingClientRect.top + y);
      }
   }
}

function render(widget: QWidget, n: DomNode, painter: QPainter){
   if(n.getTagName() === "p"){
      renderParagraphNode(widget, n, painter);
   } else if(n.getTagName() === "img"){
      renderImageNode(widget, n, painter);
   }
}

win.addEventListener(WidgetEventTypes.Paint,  () => {
   const painter = new QPainter(win);

   //hack
   domRootNode.boundingClientRect.width = win.width();
   domRootNode.boundingClientRect.height = win.height();
   //Go through dom tree and render
   // BoundingClientRect must be computed before
   dom.forEach((el, index)=>{
      const previousEl = index  > 0 ? dom[index-1] : undefined;
      el.updateBoundingClientRect(domRootNode, previousEl);
   })
   dom.forEach((el, index)=>{
      render(win, el, painter);
   });
   console.log("=======");
   painter.end();
});

win.show();

(global as any).win = win;