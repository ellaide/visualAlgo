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
    props: ['height', 'colnum','vcells', 'hcells', 'moving', 'done'],
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
            tween.to({red: 0.5, green: 0, blue: 1, alpha: 1}, 1500).start()
            
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
    <cell-component  v-for="n in height" :key="n * height + 10000" :position="startPos-(n-1)*inc" dragging="false" x="-1" y="-1" :hcells="hcells" :vcells="vcells" disappear="false" :columncolor="(moving===colnum && !done) ? 'red' : color">
    </cell-component>
    </transition-group>
    </div>
    `



    
})


var vm = new Vue({
    el: '#main',
    data: {
        x: 0,
        y: 0,
        dragging: false,
        disappear: false,
        appear: false,
        pressed: 0,
        index: 0,
        expanded: true,
        options: [{value: "insertion", text: "Insertion Sort"}, {value: "selection", text: "Selection Sort"}, {value: "quick", text: "Quick Sort"}],
        selected: "selection",
        array: "",
        pairs: [],
        speed: 1,
        moving: -1,
        done: false
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
        },
        sortingSpeedInMs: function(){
            return Math.floor(2500/this.speed)
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

        async getArray(){
            if (this.array != ''){
                const strArr = this.array.toString().split(',')
                console.log(strArr)
                for (let i = 0; i < this.arr.length; i++){
                    this.arr[i] = 0
                    this.incrementFromInput(i, parseInt(strArr[i]))
                }
                
            }
            console.log(this.arr)
            this.disappear = true

            setTimeout(() => {
                this.appear = true
            }, 2000)
            this.expanded = false
            this.array = this.arr.join(",")
            console.log("array:" + this.array)
            axios.get("https://visualalgo-server.herokuapp.com/" + this.selected + "/?array=" + this.array)
            .then(res => {
                
                this.pairs = res.data.steps.split("#").map((pair) => {
                    pair.split("&").map(p => [parseInt(p[0]), parseInt(p[1])])
                })
                setTimeout(() => this.startAction(res.data.steps.split("#").map((x)=>x.split("&")).map((y) => [parseInt(y[0]), parseInt(y[1])])), 4000)
            })
            
        },
        startAction(pairs){
            let that = this
            console.log(pairs)
            function littleLoop(i){
                setTimeout(() => {
                    if (i < pairs.length){
                        let val1 = that.posArr[pairs[i][0]]
                        let val2 = that.posArr[pairs[i][1]]
                        that.moving = val2
                        that.swap(pairs[i][0], val2)
                        that.swap(pairs[i][1], val1)
                        console.log(that.posArr)
                        littleLoop(i+1)
                        
                    }else{
                        that.moving = -1
                        that.done = true
                    } 
                }, that.sortingSpeedInMs)
            }
            littleLoop(0)
            
        },
        incrementFromInput: function(pos, val){
            this.arr[pos] += val
        },
        incArray: function(position){
            this.arr[position % this.horizontalCells]++;
        },
        move(a, b){
            this.posArr[a] = b
        },

        swap(a, b){
            this.move(a,b)
            this.$forceUpdate()
        },

        reSwap(a, b){
            
            this.move(b,a)
            this.$forceUpdate()
        },

        randomize(){
            for (let i = 0; i < this.arr.length; i++){
                this.incrementFromInput(i, Math.floor(Math.random() * this.verticalCells))
            }
            this.array = this.arr.join(",")
        }
    },
    watch: {
        expanded: function(val){
            console.log(val)
        },
        speed: function(val){
            console.log(val)
        },
        sortingSpeedInMs: function(val){
            console.log(val)
        }
    },
    mounted(){
        this.$refs.playground.style.display = "block"
        window.addEventListener('mouseup', this.stopDrag);
    }
})


