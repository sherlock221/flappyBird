
cc.Class({
    extends: cc.Component,

    properties: {
       gravity : 0,
       animName : '',
       birdJump : 0
    },



    onLoad () {

       //播放 
       this.getComponent(cc.Animation).play(this.animName);
       //初始速度0
       this.veloctiy = 0;


    },

    onStartDrop(){

        this.schedule(this.onDrop,0.01);

    },

    /**
     * 下落
     */
    onDrop(){

        this.veloctiy -= this.gravity;
        this.node.y  +=  this.veloctiy;
    },

    /**
     * 跳跃
     */
    onJump(){
        this.veloctiy  = this.birdJump;       
    }

    
});
