Vue.component("cell-component", {
    props: ['position', 'dragging', 'x', 'y', 'hcells', 'vcells'],
    data: function(){
        return {color : null}
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
        }
    },
    watch: {
        x: function(val){
            if (this.dragging){
                if ((Math.floor(val / this.cellSize) == this.position % this.hcells) && (Math.floor(this.y / this.cellSize) == Math.floor(this.position/ this.hcells))){
                    this.color = "red"
                }
            }
        },
        y: function(val){
            if (this.dragging){
                if ((Math.floor(this.x / this.cellSize) == this.position % this.hcells) && (Math.floor(val / this.cellSize) == Math.floor(this.position/ this.hcells))){
                    this.color = "red"
                }
            }
        },
        color: function(val){
            this.$emit('color-change', this.position)
            console.log("color change " + this.position)
        }
        
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
        dragging: false
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
        },

        incArray: function(position){

            this.arr[position % this.horizontalCells]++;
        }
    },
    mounted(){
        window.addEventListener('mouseup', this.stopDrag);
    }
})