

var Color = net.brehaut.Color


Vue.component("cell-component", {
    props: ['position', 'dragging', 'x', 'y', 'hcells', 'vcells', 'disappear','columncolor', 'size'],
    data: function(){
        return {width: window.innerWidth, color : null, tweenedColor: {
            red: 0,
            green: 0,
            blue: 0,
            alpha: 1
        }}
    },
    computed: {
        cellSize: function(){
            return this.size;
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
    props: ['height', 'colnum','vcells', 'hcells', 'moving', 'done', 'pivot', 'comparing', 'size', 'sorted'],
    data: function(){
        return {color: null, iscolcaller: true, tweenedColor: {red:1, green: 1, blue: 1, alpha: 1}, signal: false, isSorted: false}
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

        sorted: function(val) {
            if (this.done){
                this.isSorted = false
            }
            if (val === this.colnum){
                console.log(this.colnum)
                this.isSorted = true
            }
        }
    },
    template: `
    <div>
    <transition-group name="go">
    <cell-component  v-for="n in height" :key="n * height + 10000" :position="startPos-(n-1)*inc" dragging="false" x="-1" y="-1" :hcells="hcells" :size="size" :vcells="vcells" disappear="false" :columncolor="!done ? (isSorted ? 'green' : (pivot===colnum ? 'orange' : (moving===colnum ? 'red' : (comparing===colnum ? 'blue' : color)))) : color">
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
        selected: "insertion",
        array: "",
        pairs: [],
        speed: 3,
        moving: -1,
        done: true,
        moreThanOnce: false,
        pivot: -1,
        comparing: -1,
        isSomethingDrawn: false,
        sorted: -1,
        width: window.innerWidth,
        height: window.innerHeight
    },
    computed: {
        cellSize: function(){
            return this.width / this.horizontalCells;
        },
        horizontalCells: function(){
            return 15
        },
        verticalCells: function(){
            return Math.floor(this.height * this.horizontalCells / this.width)
        },
        arr: function(){
            return new Array(this.horizontalCells).fill(0)
        },
        posArr: function(){
            res = []
            for (let i = 0; i < this.horizontalCells; i++){
                res.push(i)
            }
            return res
        },
        sortingSpeedInMs: function(){
            return Math.floor(2500/this.speed)
        }
    },

    methods: {
        onResize(){
            this.width = window.innerWidth
            this.height = window.innerHeight
        },
        startDrag(event){
            if (!this.done) return
            if (this.moreThanOnce) return
/*            if (this.moreThanOnce){
                this.appear = false
                this.disappear = false
                for (let i = 0; i < this.arr.length; i++){
                    this.arr[i] = 0
                    this.posArr[i] = i
                }
                this.array = ''
            }*/
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
            if (this.array != '' || (this.arr.some(x => x > 0) && !this.isSomethingDrawn)){
                const strArr = this.array.toString().split(',')
                
                for (let i = 0; i < this.arr.length; i++){
                    this.arr[i] = 0
                    this.posArr[i] = i
                    if (parseInt(strArr[i]) < 0){
                        strArr[i] = '0'
                    }
                    if (parseInt(strArr[i]) > this.verticalCells){
                        strArr[i] = this.verticalCells + ""
                    }
                    this.incrementFromInput(i, parseInt(strArr[i]))
                }
                this.array = strArr.join(",")
                
            }
            
            this.disappear = true

            setTimeout(() => {
                this.appear = true
            }, 2000)
            this.expanded = false
            this.array = this.arr.join(",")
            
            axios.get("https://visualalgo-server.herokuapp.com/" + this.selected + "/?array=" + this.array)
            .then(res => {
                
                if (this.selected === 'quick'){
                    let steps = res.data.steps.split(';').map((x) => x.split(",")).map(y => y.map(z => z.split("&").map(w => parseInt(w))))
                    setTimeout(() => this.quick(steps), 4000)
                }
                else if (this.selected === 'selection'){
                    let steps = res.data.steps.split("#").map((x)=>x.split("&")).map((y) => [parseInt(y[0]), parseInt(y[1])])
                    let highlight = res.data.highlight.split("#").map(x => x.split(",")).map(y => y.map(z => parseInt(z)))
                    setTimeout(() => this.selection(
                        steps, 
                        highlight), 4000)
                }
                else{
                    let steps = res.data.steps.split("#").map((x)=>x.split("&")).map((y) => [parseInt(y[0]), parseInt(y[1])])
                    setTimeout(() => this.insertion(steps), 4000)
                }
            })
            this.done = false
            
        },
        insertion(pairs){
            let that = this
            async function littleLoop(i){
                setTimeout(() => {
                    if (i < pairs.length){
                        let val1 = that.posArr[pairs[i][0]]
                        let val2 = that.posArr[pairs[i][1]]
                        that.moving = val2
                        that.swap(pairs[i][0], val2)
                        that.swap(pairs[i][1], val1)
                        littleLoop(i+1)
                        
                    }else{
                        that.moving = -1
                        setTimeout(() => that.done = true, 1000)
                    } 
                }, that.sortingSpeedInMs)
            }
            littleLoop(0)
        },
        selection(pairs, highlight){
            let that = this
            highlight = highlight || []
            
            async function littleLoop(i){
                setTimeout(() => {
                    if (i < pairs.length){
                        async function helper(){
                            if (highlight.length == 0) return
                            for (let k = 0; k < highlight[i].length; k++){
                                await new Promise(resolve => setTimeout(() => {
                                    that.comparing = that.posArr[highlight[i][k]]
                                    resolve()
                                }, that.sortingSpeedInMs/3))
                            }
                        }
                        let val1 = that.posArr[pairs[i][0]]
                        let val2 = that.posArr[pairs[i][1]]
                        that.moving = val1
                        helper().then(() => {
                            that.swap(pairs[i][0], val2)
                            that.swap(pairs[i][1], val1)
                            littleLoop(i+1)
                        })
                        
                        
                    }else{
                        that.comparing = -1
                        that.moving = -1
                        setTimeout(() => that.done = true, 1000)
                    } 
                }, 500)
            }
            littleLoop(0)
            
        },
        quick(steps){
            
            let that = this
            let x = 0
            function action(resolve, step){
                that.pivot = that.posArr[step[step.length-1][1]]
                function actionLoop(i){
                    setTimeout(() => {
                        if (i < step.length){
                            if (step[i].length > 1){
                                let val1 = that.posArr[step[i][0]]
                                let val2 = that.posArr[step[i][1]]
                                
                                that.moving = val2
                                that.comparing = val1
                                that.swap(step[i][0], val2)
                                that.swap(step[i][1], val1)
                            }
                            else{
                                that.comparing = that.posArr[step[i][0]]
                                
                            }
                            actionLoop(i+1)
                            x++
                        }else{
                            resolve()
                        }
                    }, that.sortingSpeedInMs/1.5)
                }
                actionLoop(0)
            }
            async function ultimate(){
                for (let i = 0; i < steps.length; i++){
                    await new Promise(resolve => action(resolve, steps[i])).then(() => {
                        that.moving = -1
                        that.sorted = that.posArr[steps[i][steps[i].length - 1][1]]
                        that.pivot = -1
                        that.comparing = -1
                    })
                }
            }

            ultimate().then(() =>{
                setTimeout(() => that.done = true, 1000)
            })

        },
        incrementFromInput: function(pos, val){
            if (val < 0 || isNaN(val)) val = 1
            if (val > this.verticalCells) val = this.verticalCells
            this.arr[pos] += val
        },
        incArray: function(position){
            
            this.arr[position % this.horizontalCells]++;
            this.isSomethingDrawn = true
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
                this.arr[i] = 0
                this.posArr[i] = i
                this.incrementFromInput(i, Math.floor(Math.random() * (this.verticalCells)))
            }
            this.array = this.arr.join(",")
        }
    },
    watch: {
        done: function(val){
            if (val){
                this.moreThanOnce = true
            }
        },
        width: function(val){
            console.log(val)
        }
    },
    mounted(){
        this.$refs.playground.style.display = "block"
        window.addEventListener('mouseup', this.stopDrag);
        this.$nextTick(() => {
            window.addEventListener('resize', this.onResize);
          })
    },


    beforeDestroy() { 
      window.removeEventListener('resize', this.onResize); 
    }
})


