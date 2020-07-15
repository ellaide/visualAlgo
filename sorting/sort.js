var Color = net.brehaut.Color


Vue.component("cell-component", {
    props: ['position', 'dragging', 'x', 'y', 'hcells', 'vcells', 'disappear'],
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
                tween.to({red: 1, green: 0.9804, blue: 0.9804, alpha: 1}, 300).start()
                
                animate()
                
            }
        },
        testColor: function(val){
            
            this.color = this.testColor
            
            
            
        },
        deep: true
        
    },
    template: `
    <div class="cell" v-bind:style="{'background-color': color, left: posX + 'px', top: posY + 'px', width: cellSize + 'px', height: cellSize + 'px'}"></div>
    `
})






new Vue({
    el: '#app',
    data: {
        x: 0,
        y: 0,
        dragging: false,
        disappear: false
    },
    computed: {
        cellSize: function(){
            return window.innerWidth / horizontalCells;
        },
        horizontalCells: function(){
            return 20
        },
        verticalCells: function(){
            return Math.floor(window.innerHeight * this.horizontalCells / window.innerWidth)
        },
        arr: function(){
            return new Array(this.horizontalCells).fill(0)
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
            
        },

        incArray: function(position){

            this.arr[position % this.horizontalCells]++;
        }
    },
    mounted(){
        window.addEventListener('mouseup', this.stopDrag);
    }
})