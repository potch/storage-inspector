const {Cu} = require("chrome");
Cu.import("resource:///modules/devtools/gDevTools.jsm");
Cu.import("resource:///modules/devtools/shared/event-emitter.js");

let data = require("sdk/self").data;

console.log([f for (f in gDevTools)]);

gDevTools.registerTool({
  id: "storage",
  url: data.url("index.html"),
  label: 'Storage',

  isTargetSupported: function(target) {
    return !target.isRemote;
  },

  build: function(iframeWindow, toolbox, node) {
    console.log('build');
    return new StoragePanel(iframeWindow, toolbox);
  }
});

console.log('init');

function StoragePanel(iframeWindow, toolbox) {
  this._toolbox = toolbox;
  this._target = toolbox._target;
  this.panelDoc = iframeWindow.document;
  this.panelWin = iframeWindow;
  this.panelWin.inspector = this;
}

StoragePanel.prototype = {
  open: function StoragePanel_open() {
    let deferred = Promise.defer();

    this._toolbox.emit("ready");

    console.log('open!');

    this.panelDoc.addEventListener('load', function() {
      console.log('loaded');
      this._toolbox.raise();
      deferred.resolve(this);
    });

    return deferred.promise;
  },

  destroy: function StoragePanel_destroy() {

  }
};