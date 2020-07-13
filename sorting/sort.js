Vue.component("cell-component", {
    props: ['position', 'dragging', 'x', 'y'],
    data: function(){
        return {color : null}
    },
    computed: {
        cellSize: function(){
            return window.innerWidth / 30;
        },
        posX: function(){
            return this.cellSize * ( this.position % 30 )
        },
        posY: function(){
            return this.cellSize * Math.floor((this.position / 30))
        }
    },
    watch: {
        x: function(val){
            if (this.dragging){
                if ((Math.floor(val / this.cellSize) == this.position % 30) && (Math.floor(this.y / this.cellSize) == Math.floor(this.position/ 30))){
                    this.color = "red"
                }
            }
        },
        y: function(val){
            if (this.dragging){
                if ((Math.floor(this.x / this.cellSize) == this.position % 30) && (Math.floor(val / this.cellSize) == Math.floor(this.position/ 30))){
                    this.color = "red"
                }
            }
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
            return window.innerWidth / 30;
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
        }
    },
    mounted(){
        window.addEventListener('mouseup', this.stopDrag);
    }
})