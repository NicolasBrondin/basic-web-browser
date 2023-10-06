import {
  QMainWindow,
  QWidget,
  QLabel,
  FlexLayout,
  QPushButton,
  QLineEdit
} from '@nodegui/nodegui';

const win = new QMainWindow();
win.setWindowTitle("Basic Web Browser");
win.setFixedWidth(800);
win.setFixedHeight(600);

const centralWidget = new QWidget();
centralWidget.setObjectName("myroot");
const rootLayout = new FlexLayout();
centralWidget.setLayout(rootLayout);

const label = new QLabel();
label.setObjectName("mylabel");
label.setText("Enter a url");

const button = new QPushButton();
button.setText("Go");

async function loadPage(url: string){
  
}

button.addEventListener('clicked', async () => {
  console.log("[REQUEST]"+textEdit.text());
  await loadPage(textEdit.text());
});

const textEdit = new QLineEdit();
textEdit.setText("http://info.cern.ch/hypertext/WWW/TheProject.html");

rootLayout.addWidget(label);
rootLayout.addWidget(textEdit);
rootLayout.addWidget(button);
win.setCentralWidget(centralWidget);
win.setStyleSheet(
  `
    #myroot {
      height: '100%';
      align-items: 'center';
      justify-content: 'center';
    }
    #mylabel {
      font-size: 16px;
      font-weight: bold;
      padding: 1;
    }
  `
);
win.show();

(global as any).win = win;
