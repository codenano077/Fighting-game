const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.2 
class Sprite {
    constructor({position,velocity}){
        this.position = position
        this.velocity = velocity
        this.height = 150
        this.lastkey
        
    }
 
    draw(){
        c.fillStyle = 'red'
        c.fillRect(this.position.x,this.position.y,50,this.height)
    }

    update(){
        this.draw()
        
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        
        if(this.position.y + this.height + this.velocity.y >= canvas.height){
            this.velocity.y = 0
        }else this.velocity.y += gravity  
    }
}

const player = new Sprite({
    position :{
        x:0,
        y:0
    },
    velocity: {
        x: 0,
        y: 10

    }
})

player.draw()

const enemy = new Sprite({
    position :{
    x:400,
    y:100
    },
    velocity: {
        x: 0,
        y: 0

    }
})

let lastkey
enemy.draw()

console.log(player)

function animate(){
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0,0, canvas.width, canvas.height)
    player.update()
    enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0

    //Player movement
    if(keys.a.pressed && lastkey === 'a'){
        player.velocity.x = -1
    }
    else if(keys.d.pressed && lastkey === 'd')
    {
        player.velocity.x = 1
    }
    
    //Enemy movement
    if(keys.ArrowLeft.pressed && enemy.lastkey === 'ArrowLeft'){
        enemy.velocity.x = -1
    }
    else if(keys.ArrowRight.pressed && enemy.lastkey === 'ArrowRight')
    {
        enemy.velocity.x = 1
    }
}

const keys = {
    a: {
        pressed:false
    },
    d: {
        pressed:false
    },
    w: {
        pressed: false
    },
    ArrowRight:{
                pressed: false
    },
    ArrowLeft: {
                pressed: false
    }
}

animate()

window.addEventListener('keydown',(event) => {
    switch(event.key){
        case 'd':
            keys.d.pressed = true
            lastkey = 'd'
            break 
        case 'a':
            keys.a.pressed = true
            lastkey = 'a'
            break
        case 'w':
            player.velocity.y = -10
            break
        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            enemy.lastkey = 'ArrowRight'
            break 
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            enemy.lastkey = 'ArrowLeft'
            break
        case 'ArrowUp':
            enemy.velocity.y = -10
            break
            
    }
    console.log(event.key)
})

window.addEventListener('keyup',(event) => {
    switch(event.key){
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
        case 'w':
            keys.w.pressed = false
            break
    }

    switch(event.key){
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break
        case 'w':
            keys.w.pressed = false
            break
    }
    console.log(event.key)
})