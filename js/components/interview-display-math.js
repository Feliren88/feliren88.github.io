/* Authored LaTeX is converted at build time; runtime values are escaped text. */
(function () {
  'use strict';
  var node=document.getElementById('iv-display-math');
  var formulas=node?(JSON.parse(node.textContent)||{}):{};
  function escape(value){return String(value).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
  function html(key,values,inline){
    if(!Object.prototype.hasOwnProperty.call(formulas,key))throw new Error('Missing display formula '+key);
    var result=formulas[key].replace(/SLOT_([A-Za-z0-9]+)/g,function(_,name){
      if(!values || !Object.prototype.hasOwnProperty.call(values,name))throw new Error('Missing formula value '+name+' in '+key);
      return escape(values[name]);
    });
    return inline?result.replace('display="block"','display="inline"'):result;
  }
  window.InterviewDisplayMath={html:html,set:function(host,key,values){host.innerHTML=html(key,values);}};
}());
