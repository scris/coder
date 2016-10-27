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

  function addLiteral(literal) {
    self.code.push(literal);
    var elem = createLiteral(literal, 'move');
    self.elemEditor.appendChild(elem);
  }

  function moveLiteral(from) {
    var literal = self.code.splice(from, 1)[0];
    self.code.push(literal);
    var elem = self.elemEditor.children[from];
    self.elemEditor.appendChild(elem);
  }

  function createLiteralsArea() {
    var elem = document.createElement('div');
    elem.classList.add('literals');
    return elem;
  }

  function createEditorArea() {
    var elem = document.createElement('div');
    elem.classList.add('editor');
    elem.addEventListener('dragover', function (event) {
      event.preventDefault();
    });
    elem.addEventListener('drop', function (event) {
      var index = parseInt(event.dataTransfer.getData('add-literal'));
      if (!isNaN(index)) return addLiteral(self.config.literals[index]);
      index = parseInt(event.dataTransfer.getData('move-literal'));
      if (!isNaN(index)) return moveLiteral(index);
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
