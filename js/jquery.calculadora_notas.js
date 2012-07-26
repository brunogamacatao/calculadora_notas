(function ($) {
  'use strict';
  var that = {};
  
  that.calculadoraNotas = function(element) {
    var id = element.id;
    var id_container = '#' + id;
    var calculadora = new Object();

    calculadora.notas = null;

    calculadora.createDialogCalculadora = function() {
      var dialogHtml = '<img src="img/calculator.png" id="nota_${id}_btn" style="position: fixed; margin: 3px 0 0 -3px"/>' +
      '<div id="nota_${id}_dlg">' +
      '  <fieldset>' +
      '    <legend>Cálculo da Nota</legend>' +
      '    <table border="0">' +
      '      <thead>' +
      '        <tr>' +
      '          <th></th>' +
      '          <th>Nota</th>' +
      '          <th>Peso</th>' +
      '        </tr>' +
      '      </thead>' +
      '      <tbody>' +
      '        <tr>' +
      '          <th>Teórica</td>' +
      '          <td><input type="text" class="nota" id="nota_${id}_1" value="0"/></td>' +
      '          <td><input type="text" class="peso" id="peso_${id}_1" value="50"/><span>%</span></td>' +
      '        </tr>' +
      '        <tr>' +
      '          <th>Prática</td>' +
      '          <td><input type="text" class="nota" id="nota_${id}_2" value="0"/></td>' +
      '          <td><input type="text" class="peso" id="peso_${id}_2" value="50"/><span>%</span></td>' +
      '        </tr>' +
      '        <tr>' +
      '          <th>Média</td>' +
      '          <th style="text-align:right; padding-right: 5px"><span id="media_${id}" style="text-align:right">0,0</span></th>' +
      '          <td></td>' +
      '        </tr>' +
      '      </tbody>' +
      '      <tfoot>' +
      '        <tr>' +
      '          <th colspan="3">' +
      '            <input type="button" value="Ok" id="btn_${id}_ok"/>' +
      '            <input type="button" value="Cancelar" id="btn_${id}_cancelar"/>' +
      '          </th>' +
      '        </tr>' +
      '      </tfoot>' +
      '    </table>' +
      '  </fieldset>' +
      '</div>';

      var dialogTemplate = $.template(null, dialogHtml);
      var divCalculadora = $('<span/>', {id: 'calculadora_container'}).insertAfter(id_container);
      $.tmpl(dialogTemplate, {id: id}).appendTo(divCalculadora);
    };

    calculadora.roundNumber = function(num, dec) {
      var result = Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
      return result.toFixed(1);
    };

    calculadora.recalculaMedia = function() {
      var media = calculadora.notas.nota_1 * calculadora.notas.peso_1 * 0.01 + calculadora.notas.nota_2 * calculadora.notas.peso_2 * 0.01;
      $('#media_' + id).text(calculadora.formatNumber(media, 1));
      return media;
    };

    calculadora.getValue = function(element_id) {
      var val = $(element_id).val();

      if (val === '') {
        return 0;
      } else {
        return parseFloat(val.replace(",", ".")).toFixed(1);
      }
    };

    calculadora.formatNumber = function(num, dec) {
      return (calculadora.roundNumber(num, dec) + '').replace(".", ",");
    };

    calculadora.createNota = function() {
      return {
        nota_1: calculadora.getValue('#nota_' + id + '_1'),
        peso_1: calculadora.getValue('#peso_' + id + '_1'),
        nota_2: calculadora.getValue('#nota_' + id + '_2'),
        peso_2: calculadora.getValue('#peso_' + id + '_2')
      };
    };

    calculadora.notaBlur = function(prefix, i) {
      return function() {
        var value = calculadora.getValue('#' + prefix + '_' + id + '_' + i);

        if (prefix === 'nota') {
          if (isNaN(value) || value < 0 || value > 10) {
            $('#' + prefix + '_' + id + '_' + i).val(calculadora.formatNumber(calculadora.notas[prefix + '_' + i], 1));
          } else {
            calculadora.notas[prefix + '_' + i] = value;
          }
        } else {
          if (isNaN(value) || value < 0 || value > 100) {
            $('#' + prefix + '_' + id + '_' + i).val(calculadora.formatNumber(calculadora.notas[prefix + '_' + i], 0));
          } else {
            calculadora.notas[prefix + '_' + i] = value;
            var j = i == 1 ? 2 : 1;
            calculadora.notas[prefix + '_' + j] = 100 - value;
            $('#' + prefix + '_' + id + '_' + j).val(calculadora.formatNumber(calculadora.notas[prefix + '_' + j], 0));
          }
        }

        calculadora.recalculaMedia();
      };
    };

    calculadora.createDialogCalculadora();
    calculadora.notas = calculadora.createNota();

    for (var i = 1; i <= 2; i++) {
      $('#nota_' + id + '_' + i).blur(calculadora.notaBlur('nota', i));
      $('#nota_' + id + '_' + i).maskMoney({thousands:'', decimal:',', allowZero:false, defaultZero:true, precision: 1});
      $('#peso_' + id + '_' + i).blur(calculadora.notaBlur('peso', i));
      $('#peso_' + id + '_' + i).maskMoney({thousands:'', decimal:'',  allowZero:false, defaultZero:true, precision: 0});
    }

    $('#nota_' + id + '_dlg').dialog({ autoOpen: false, minWidth: 500 });

    $('#nota_' + id + '_btn').click(function() {
      $('#nota_' + id + '_dlg').dialog('open');
    });

    $('#btn_' + id + '_ok').click(function() {
      $(id_container).val(calculadora.formatNumber(calculadora.recalculaMedia(), 1));
      $('#nota_' + id + '_dlg').dialog('close');
    });

    $('#btn_' + id + '_cancelar').click(function() {
      $('#nota_' + id + '_dlg').dialog('close');
    });

    return calculadora;
  }  
  
  that.methods = {
    init : function (options) {
      return this.each(function () {
        $.extend(that.parameters, options);
        that.calculadoraNotas(this);
      });
    }
  };
  
  $.fn.calculadora = function (method) {
      if (that.methods[method]) {
          return that.methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
      } else if (typeof method === 'object' || !method) {
          return that.methods.init.apply(this, arguments);
      } else {
          $.error('Method ' + method + ' does not exist on jQuery.calculadora_notas');
      }
  };
})(jQuery);