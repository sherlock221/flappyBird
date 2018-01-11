cc.Class({
    extends: cc.Component,

    properties: {
      groundNode  : [cc.Node],
      groundImg  : cc.Sprite,
      move_interval : 0.05,
      move_speed : -5      
    },

    onLoad () {


      this._size = cc.winSize;

      console.log(cc.winSize);
      //获得地板宽度
      this.groundWidth = this.groundImg.spriteFrame.getRect().width;
      //定时
      this.schedule(this.onGroundMove,this.move_interval)

          
    },

    onGroundMove(){
      
        var nodeOne = this.groundNode[0];
        var nodeSecond = this.groundNode[1];

        //移动地板
        nodeOne.x += this.move_speed;
        nodeSecond.x += this.move_speed;
      
        
        if(nodeOne.x + this.groundWidth /2 < -this._size.width /2 ){
           nodeOne.x = nodeSecond.x + this.groundWidth;
        }

        if(nodeSecond.x + this.groundWidth /2 < -this._size.width /2 ){
         nodeSecond.x = nodeOne.x + this.groundWidth;
        }
      

    },

    start () {

    },


});
