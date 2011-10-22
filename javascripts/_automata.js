var Automata = {

  resolution : 100,
  state : null,
  state_b : null,
  n_hood_size : 9,
  dynamism : 0.2,
  frequency : 0.001,
  speed : 10,
  world : null,
  law : {},

  init : function(){
    var self = this;
    this.world = jQuery('#world')[0];
    //this.law = this.generateLaw(this.dynamism, this.n_hood_size);
    this.law = AutomataLaw;
    this.state = this.createState(this.resolution);
    this.state_b = this.createState(this.resolution);
    this.state = this.populateState(this.state, this.frequency);
    //this.initSave();
    this.run(this.state, this.state_b, this.law);
  },

  run : function(oldState, newState, law){
    var self = this;
    this.renderState(oldState, this.world, this.resolution);
    newState = this.writeNewState(oldState, newState, law);
    setTimeout(function(){
      self.run(newState, oldState, law);
    }, self.speed);
  },

  writeNewState : function(oldState, newState, law){
    var size = oldState.length;
    for (var i = 0; i < size; i++) {
      for (var j = 0; j < size; j++) {
        var antecedent = this.getAntecedent(oldState, i, j);
        newState[i][j] = law[antecedent];
      }
    }
    return newState;
  },

  getAntecedent : function(state, i, j){
    var max_index = state.length-1;
    var antecedent = '';
    for (var k = -1 ; k < 2 ; k++) {
      for (var l = -1 ; l < 2 ; l++) {
        var _i = (i+k < 0 || i+k > max_index) ? (i+k < 0 ? max_index : 0) : i+k;  
        var _j = (j+l < 0 || j+l > max_index) ? (j+l < 0 ? max_index : 0) : j+l;  
        antecedent += state[_i][_j];
      }
    }
    return antecedent;
  },

  generateLaw : function(dynamism, nHoodSize) {
    var map = {};  
    var antecedents = this.generateAntecedents('', nHoodSize, []);
    antecedents.forEach(function(a){
      map[a] = Math.random() < dynamism ? 1 : 0;
    });
    return map; 
  },

  generateAntecedents :  function(stem, size, cont){
    var self = this;
    if (size === 0) {
      return cont.push(stem);
    }
    for (var s = 0; s < 2; s++){ 
      var growth = stem+s.toString();
      self.generateAntecedents(stem+s.toString(), size-1, cont);
    } 
    return cont;
  },

  createState : function(resolution){
    var state = new Array(resolution);
    for (var i = 0 ; i < resolution ; i++) {
      state[i] = new Array(resolution);
    }
    return state;
  },

  populateState : function(state, frequency){
    var size = state.length;
    for (var i = 0; i < size; i++) {
      for (var j = 0 ; j < size; j++) {
        state[i][j] = Math.random()<frequency ? 1 : 0;  
      }
    }
    return state;
  },

  renderState : function(state, world, resolution){
    var html = '';
    var size = state.length;
    var cellSize = 100/resolution;
    for (var i = 0; i < size; i++){
      for (var j = 0; j < size; j++){
        if (state[i][j]){
          html+='<div class="cell" style="height:'+cellSize+'%;width:'+cellSize+'%;left:'+cellSize*i+'%;top:'+cellSize*j+'%"></div>';
        }
      }
    }
    jQuery(world).html(html);
  },

  initSave : function(){
    var self = this;
    jQuery(jQuery('#save-rule')[0]).click(function(){
      console.log('clickety');
      console.log(self.law);
      jQuery.ajax({
        type : 'POST',
        url : '/save',
        data : {name:'rule_name', law:JSON.stringify(self.law)}
      });
    });
  }
}
