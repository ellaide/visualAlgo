var Color = net.brehaut.Color


Vue.component("cell-component", {
    props: ['position', 'dragging', 'x', 'y', 'hcells', 'vcells', 'disappear','columncolor'],
    data: function(){
        return {color : null, tweenedColor: {
            red: 0,
            green: 0,
            blue: 0,
            alpha: 1
        }}
    },
    computed: {
        cellSize: function(){
            return window.innerWidth / this.hcells;
        },
        posX: function(){
            return this.cellSize * ( this.position % this.hcells )
        },
        posY: function(){
            return this.cellSize * Math.floor((this.position / this.hcells))
        },
        testColor: function(){
            
            return new Color({red:this.tweenedColor.red, green:this.tweenedColor.green, blue:this.tweenedColor.blue, alpha:this.tweenedColor.alpha}).toCSS()
        }
    },
    watch: {
        x: function(val){
            if (this.dragging){
                if ((Math.floor(val / this.cellSize) == this.position % this.hcells) && (Math.floor(this.y / this.cellSize) == Math.floor(this.position/ this.hcells))){
                    this.color = "black"
                }
            }
        },
        y: function(val){
            if (this.dragging){
                if ((Math.floor(this.x / this.cellSize) == this.position % this.hcells) && (Math.floor(val / this.cellSize) == Math.floor(this.position/ this.hcells))){
                    this.color = "black"
                }
            }
        },
        color: function(val){
            if (val == 'black'){
            this.$emit('color-change', this.position)
            console.log("color change " + this.position)
            }
        },
        disappear: function(val){
            
            if (val && this.color != null && 'black' === this.color){
                
                function animate() {
                    if (TWEEN.update()){
                        
                        requestAnimationFrame(animate)
                    }
                }
                
                var tween = new TWEEN.Tween(this.tweenedColor)
                tween.to({red: 1, green: 1, blue: 1, alpha: 1}, 1500).start()
                
                animate()
                
            }
        },
        testColor: function(val){
            
            this.color = this.testColor
            
            
            
        },
        deep: true
        
    },
    template: `
    <div class="cell" v-bind:style="{'background-color': (columncolor ? columncolor : color), left: posX + 'px', top: posY + 'px', width: cellSize + 'px', height: cellSize + 'px'}"></div>
    `
})



Vue.component("column-component", {
    props: ['height', 'colnum','vcells', 'hcells'],
    data: function(){
        return {color: null, iscolcaller: true, tweenedColor: {red:1, green: 1, blue: 1, alpha: 1}, signal: false}
    },
    computed: {
        startPos: function(){
            this.signal = true
            return this.hcells * this.vcells - this.hcells + this.colnum
        },
        inc: function(){
            return this.hcells
        },
        testColor: function(){
            
            return new Color({red:this.tweenedColor.red, green:this.tweenedColor.green, blue:this.tweenedColor.blue, alpha:this.tweenedColor.alpha}).toCSS()
        }

    },
    watch: {
        signal: function(){
            function animate() {
                if (TWEEN.update()){
                    
                    requestAnimationFrame(animate)
                }
            }
            
            var tween = new TWEEN.Tween(this.tweenedColor)
            tween.to({red: 0, green: 0, blue: 0, alpha: 1}, 1500).start()
            
            animate()
        },

        testColor: function() {
            this.color = this.testColor
        },
        colnum: function(val){
            console.log(val)
        }
    },
    template: `
    <div>
    <transition-group name="go">
    <cell-component v-for="n in height" :key="n * height + 10000" :position="startPos-(n-1)*inc" dragging="false" x="-1" y="-1" :hcells="hcells" :vcells="vcells" disappear="false" :columncolor="color">
    </cell-component>
    </transition-group>
    </div>
    `



    
})


var vm = new Vue({
    el: '#app',
    data: {
        x: 0,
        y: 0,
        dragging: false,
        disappear: false,
        appear: false,
        pressed: 0,
        index: 0
    },
    computed: {
        cellSize: function(){
            return window.innerWidth / this.horizontalCells;
        },
        horizontalCells: function(){
            return 20
        },
        verticalCells: function(){
            return Math.floor(window.innerHeight * this.horizontalCells / window.innerWidth)
        },
        arr: function(){
            return new Array(this.horizontalCells).fill(0)
        },
        posArr: function(){
            res = []
            for (let i = 0; i < 20; i++){
                res.push(i)
            }
            return res
        }
    },
    methods: {
        startDrag(event){
            
            this.dragging = true
            this.x = event.clientX
            this.y = event.clientY
            
        },

        stopDrag(){
            this.dragging = false
        },

        doDrag(event){
            if (this.dragging){
                this.x = event.clientX
                this.y = event.clientY
            
            }
        },

        getArray(){
            console.log(this.arr)
            this.disappear = true

            setTimeout(() => {
                this.appear = true
            }, 2000)
            
        },

        incArray: function(position){
            this.arr[position % this.horizontalCells]++;
        },
        move(a, b){
            this.posArr[a] = b
        },

        swap(){
            this.move(3,19)
            this.$forceUpdate()
        },

        reSwap(){
            
            this.move(3,1)
            this.$forceUpdate()
        }
    },
    mounted(){
        window.addEventListener('mouseup', this.stopDrag);
    }
})