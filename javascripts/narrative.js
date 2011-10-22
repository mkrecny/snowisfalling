var Narrative = {

  position : null,

  text : [
    "Hello.",
    "We've been expecting you.",
    "Let me explain.",
    "For billions of cycles our world has evolved.",
    "...deterministically plodding from one state to the next",
    "...increasing in complexity.",
    "From a simple fundamental algorithm emerged physics, chemistry, life & consciousness.",
    "...and snow.",
    "It doesn't make any sense ... but the stuff is falling UP!",
    "Makes it hard to build a decent snowman...",
    "But you have the power to access the source, and set things right.",
    "Please help us."
  ],

  init : function(){
    var self = this;
    jQuery('#continue').click(function(){
      self.play(self.position+1);
    });
  },

  play : function(position){
    var self = this;
    this.position = position;
    jQuery('#narrative-text').text(''); 
    jQuery('#continue').hide(); 
    this.renderNarrative(position, function(){
      if (position<self.text.length-1){
        jQuery('#continue').fadeIn();
      }
    });
  },

  renderNarrative : function(position, cb){
    this.recursivePrint(jQuery('#narrative-text'), this.text[position], 1, cb);
  },

  recursivePrint : function(el, string, position, cb){
    var self = this;
    if (position===string.length+1){
      return cb();
    }
    el.text(string.substr(0, position));
    setTimeout(function(){
      return self.recursivePrint(el, string, position+1, cb);
    }, 40);
  }

}
