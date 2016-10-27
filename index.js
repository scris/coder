(function () {
  'use strict';

  var parent = document.getElementById('fullscreen');

  var config = {
    literals: [
      { name: 'Create Random Transport', style: 'red' },
      { name: 'Sleep', style: 'green' },
      { name: 'Repeat forever', style: 'blue' }
    ]
  };

  var coder = new Coder(parent, config);

}());
