window.Coder = function (parent, config) {
  'use strict';

  var self = this;

  self.parent = parent;
  self.config = config;
  self.code = [];

  function makeDragStart(literal, type) {
    switch(type) {
    case 'add': {
      return function (event) {
        var index = self.config.literals.indexOf(literal);
        event.dataTransfer.setData('add-literal', index);
      };
    }
    case 'move': {
      return function (event) {
        var index = self.code.indexOf(literal);
        event.dataTransfer.setData('move-literal', index);
      };
    }
    }
  }

  function createLiteral(literal, dragType) {
    var elem = document.createElement('div');
    elem.textContent = literal.name;
    elem.classList.add('literal');
    elem.classList.add(literal.style);
    elem.draggable = true;
    elem.addEventListener('dragstart', makeDragStart(literal, dragType));
    return elem;
  }

  function addLiteral(literal, to) {
    self.code.splice(to, 0, literal);
    var elem = createLiteral(literal, 'move');
    var predecessor = self.elemEditor.children[to];
    self.elemEditor.insertBefore(elem, predecessor);
  }

  function moveLiteral(from, to) {
    if (from === to) return;
    var literal = self.code.splice(from, 1)[0];
    self.code.splice(from < to ? to - 1 : to, 0, literal);
    var elem = self.elemEditor.children[from];
    var predecessor = self.elemEditor.children[to];
    self.elemEditor.insertBefore(elem, predecessor);
  }

  function removeLiteral(index) {
    self.code.splice(index, 1);
    var elem = self.elemEditor.children[index];
    self.elemEditor.removeChild(elem);
  }

  function createLiteralsArea() {
    var elem = document.createElement('div');
    elem.classList.add('literals');
    elem.addEventListener('dragover', function (event) {
      event.preventDefault();
    });
    elem.addEventListener('drop', function (event) {
      var index = parseInt(event.dataTransfer.getData('move-literal'));
      if (!isNaN(index)) return removeLiteral(index);
    });
    return elem;
  }

  function createEditorArea() {
    var elem = document.createElement('div');
    elem.classList.add('editor');
    elem.addEventListener('dragover', function (event) {
      event.preventDefault();
    });
    elem.addEventListener('drop', function (event) {
      var posY = event.pageY - elem.offsetTop;
      var to = Math.max(0, Math.floor((posY - 10) / 29));
      var index = parseInt(event.dataTransfer.getData('add-literal'));
      if (!isNaN(index)) return addLiteral(self.config.literals[index], to);
      index = parseInt(event.dataTransfer.getData('move-literal'));
      if (!isNaN(index)) return moveLiteral(index, to);
    });
    return elem;
  }

  function init() {

    // create root
    self.elemRoot = document.createElement('div');
    self.elemRoot.classList.add('coder');

    // create literals area
    self.elemLiterals = createLiteralsArea();
    self.elemRoot.appendChild(self.elemLiterals);

    // create literals
    config.literals.forEach(function (literal) {
      var elem = createLiteral(literal, 'add');
      self.elemLiterals.appendChild(elem);
    });

    // create editor area
    self.elemEditor = createEditorArea();
    self.elemRoot.appendChild(self.elemEditor);

    // attach to parent
    self.parent.appendChild(self.elemRoot);
  }

  init();

};
