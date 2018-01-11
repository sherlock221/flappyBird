const Bird = require("./Bird");
const Background = require("./Background");
const Storage = require("./Storage");

cc.Class({
    extends: cc.Component,
    properties: {       
         //上下管道最小间隙
        pipeMinGap : 80,
        //上下管道最大间隙
        pipeMaxGap : 200,
        //管道生产屏幕外偏移位置(x)
        pipeSpawnOffsetX : 30,
        //管道纵向最大偏移量(y)
        pipeSpawnOffsetY : 150,
        //管道生成时间
        pipeSpawnInterval :  4.5,

        pipesNode : cc.Node,
        pipePerfabs : [cc.Prefab],

        gameMenu : cc.Node,
        bird : Bird,
        backGround : Background,
        
        gameOver : cc.Sprite,
        gameRetry : cc.Button,

        scoreLab : cc.Label,
        highscoreLab : cc.Label,

        scoreScaleDuration : 0.2


    },

 

    onLoad () {
        //屏幕点击事件
        this.setInputControl();

        this.score = 0;

        //获取地板包围盒
        var groundBox = this.backGround.groundNode[0].getBoundingBox();
        //计算地板顶部坐标
        this.groundTop = groundBox.y + groundBox.height;
        
        this.gameOver.node.active = false;
        this.gameRetry.node.active = false;

        //初始化管道数组
        this.pipes = [];
        this.size = cc.winSize;

       

        //显示历史最高分
        if(Storage.getHighScore() > 0){
            this.highscoreLab.string = "HighScore:"+Storage.getHighScore();
        }

    },

    setInputControl(){

        this.node.on(cc.Node.EventType.TOUCH_START,this.birdJump.bind(this))
        

    },

    birdJump(){
        this.bird.onJump();
    },

    onStartGame(){
        this.gameMenu.active = false;
        this.bird.onStartDrop();

        //管道生成定时器
        this.schedule(this.spawnPipes,this.pipeSpawnInterval);

        //游戏逻辑更新(对象更新)
        this.schedule(this.gameUpdate,0.05);
        
    },

    onRetryGame(){
        cc.director.loadScene("Game")
    },

    spawnPipes(){

        //上管道
        var pipeUp = cc.instantiate(this.pipePerfabs[0]);
        pipeUp.getComponent("Pipe").init(0);
        //管道高度
        var pipeHeight = pipeUp.getComponent(cc.Sprite).spriteFrame.getRect().height;
        //管道生成位置X 屏幕外
        pipeUp.x = this.size.width /2 + this.pipeSpawnOffsetX;        
        //160 - 310 之间随机数
        pipeUp.y = Math.floor(Math.random() * this.pipeSpawnOffsetY) + pipeHeight/2;

        //下管道
        var pipeDown = cc.instantiate(this.pipePerfabs[1]);
        pipeDown.getComponent("Pipe").init(1);
        pipeDown.x = this.size.width /2 + this.pipeSpawnOffsetX;

        //上下管道间隙随机
        var pipeGap = Math.floor(Math.random() * (this.pipeMaxGap - this.pipeMinGap)) + this.pipeMinGap + 20;

        pipeDown.y = pipeUp.y - pipeGap - pipeHeight;

        this.pipesNode.addChild(pipeUp);
        this.pipesNode.addChild(pipeDown);
        this.pipes.push(pipeUp);
        this.pipes.push(pipeDown);

    },
    gameUpdate (){

        var birdBox = this.bird.node.getBoundingBox();
        
        for(var i=0;i<this.pipes.length; i++){
            var currentPipe  = this.pipes[i];
            currentPipe.x += -5;   
             //管道移动到屏幕外 删除节点
            if(currentPipe.x < -(this.size/2 + this.pipeSpawnOffsetX)){
                this.pipes.splice(i,1);
                this.pipesNode.removeChild(currentPipe,true);
            }

            //当前管道对象
            var pipeObj = currentPipe.getComponent("Pipe");
            if(currentPipe.x < this.bird.node.x && pipeObj.isPassed == false && pipeObj.type == 0){
                pipeObj.isPassed = true;
                this.addScore();
            }

            
            //当前管道包围盒
            var pipeBox = currentPipe.getBoundingBox();
            //与管道碰撞
            if(pipeBox.intersects(birdBox)){
                this.onGameOver();
                return;
            }
        }
        
        //小鸟触地 或 撞天花板 则死亡
        if(this.bird.node.y - this.bird.node.height /2  <= this.groundTop ||  this.bird.node.y  + this.bird.height /2 >= this.size.height / 2){
            this.onGameOver();   
            return;        
        }

    },

    addScore(){
        this.score++;      
        this.scoreLab.string = this.score;
    
        var action1 = cc.scaleTo(this.scoreScaleDuration,1.1,0,6);
        var action2 = cc.scaleTo(this.scoreScaleDuration,0.8,1.2);
        var action3 = cc.scaleTo(this.scoreScaleDuration,1,1);
        this.scoreLab.node.active  = true;
        this.scoreLab.node.runAction(cc.sequence(action1,action2,action3));

    },

    onGameOver(){

        this.gameOver.node.active = true;
        this.gameRetry.node.active = true;

        

        //关闭所有计数器       
        this.unscheduleAllCallbacks();
        this.bird.unscheduleAllCallbacks();
        this.backGround.unscheduleAllCallbacks();  
        
        //记录保存
        var highScore = Storage.getHighScore() || 0;

        if(this.score > highScore){
            Storage.setHighScore(this.score);
        }
             
        
    }

    
  
});
