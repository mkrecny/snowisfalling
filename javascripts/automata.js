var Automata = {

  resolution : 100,
  state : null,
  state_b : null,
  frequency : 0.001,
  speed : 10,
  world : null,
  law : {},

  init : function(law){
    var self = this;
    this.world = jQuery('#world')[0];
    this.law = law;
    this.state = this.createState(this.resolution);
    this.state_b = this.createState(this.resolution);
    this.state = this.populateState(this.state, this.frequency);
    this.run(this.state, this.state_b, this.law, this.world, this.resolution);
  },

  run : function(oldState, newState, law, world, resolution){
    var self = this;
    this.renderState(oldState, world, resolution);
    newState = this.writeNewState(oldState, newState, law);
    setTimeout(function(){
      self.run(newState, oldState, law, world, resolution);
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
          // Editing the css on this line is a cheap and dirty way to 'solve' the problem without really thinking about it 
          html+='<div class="cell" style="height:'+cellSize+'%;width:'+cellSize+'%;left:'+cellSize*i+'%;top:'+cellSize*j+'%"></div>';
        }
      }
    }
    jQuery(world).html(html);
  }
}
