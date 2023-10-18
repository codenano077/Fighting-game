const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7
class Sprite {
    constructor({ position, velocity, color = 'red', offset }) {
        this.position = position
        this.velocity = velocity
        this.height = 150
        this.width = 50
        this.lastkey = null; // Initialize lastkey 
        this.attackbox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset,
            width: 100,
            height: 50
        }
        this.isAttacking = false; // Initialize isAttacking
        this.color = color
        this.health = 100 
    }

    draw() {
        c.fillStyle = this.color
        c.fillRect(this.position.x, this.position.y, 50, this.height)

        // Attack box
        if (this.isAttacking) {
            c.fillStyle = 'green'
            c.fillRect(this.attackbox.position.x, this.attackbox.position.y, this.attackbox.width, this.attackbox.height)
        }
    }

    update() {
        this.draw()
        this.attackbox.position.x = this.position.x + this.attackbox.offset.x
        this.attackbox.position.y = this.position.y

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if (this.position.y + this.height + this.velocity.y >= canvas.height) {
            this.velocity.y = 0
        } else this.velocity.y += gravity
    }

    attack() {
        this.isAttacking = true;
        setTimeout(() => {
            this.isAttacking = false;
        }, 100);
    }
}

const player = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 10
    },
    offset: {
        x: 0,
        y: 0
    }
})

const enemy = new Sprite({
    position: {
        x: 400,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'blue',
    offset: {
        x: -50,
        y: 0
    }
})

function rectangularCollision({ rectangle1, rectangle2 }) {
    return (
        rectangle1.attackbox.position.x + rectangle1.attackbox.width >= rectangle2.position.x &&
        rectangle1.attackbox.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.attackbox.position.y + rectangle1.attackbox.height >= rectangle2.position.y &&
        rectangle1.attackbox.position.y <= rectangle2.position.y + rectangle2.height &&
        rectangle1.isAttacking
    )
}

function determineWinner({player,enemy,timerId}){
    cancelTimeout(timerId)
    document.querySelector('#displayText').style.display = 'flex'  
    if(player.health == enemy.health){
        document.querySelector('#displayText').innerHTML = 'tie'   
    }else if(player.health>enemy.health){
        document.querySelector('#displayText').innerHTML = 'player 1 wins'
    }else if(player.health<enemy.health){
        document.querySelector('#displayText').innerHTML = 'player 2 wins'
    }
}

let timer = 60
let timerId
function decreaseTimer(){
    timerId=setTimeout(decreaseTimer , 1000)
    if(timer >0) {
        timer--
        document.querySelector('#timer').innerHTML  = timer
    }

    if(timer==0){
       
        determineWinner({player,enemy,timerId})
    }
}

decreaseTimer()

function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0

    // Player movement
    if (keys.a.pressed) {
        player.velocity.x = -5;
    } else if (keys.d.pressed) {
        player.velocity.x = 5;
    }


    // Enemy movement
    if (keys.ArrowLeft.pressed && enemy.lastkey === 'ArrowLeft') {
        enemy.velocity.x = -5
    } else if (keys.ArrowRight.pressed && enemy.lastkey === 'ArrowRight') {
        enemy.velocity.x = 5
    }

    // Detect for collision
    if (rectangularCollision({
        rectangle1: player,
        rectangle2: enemy
        })&&
        player.isAttacking
    ) {
      player.isAttacking = false
      enemy.health -= 10
      document.querySelector('#enemyHealth').style.width = enemy.health + '%' 
    }
    if (rectangularCollision({
            rectangle1: enemy,
            rectangle2: player
        })&&
        enemy.isAttacking
    ) {
        enemy.isAttacking =false
        player.health -= 10
        document.querySelector('#playerHealth').style.width = player.health + '%'
    }
    
    // end game based on health
    if(enemy.health <= 0 || player.health<=0) {
        determineWinner({player,enemy,timerId})
    }
}

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    }
}

animate()

let lastkey = null; // Initialize lastkey

window.addEventListener('keydown', (event) => {
    lastkey = event.key; // Update lastkey

    switch (event.key) {
        case 'd':
            keys.d.pressed = true
            break
        case 'a':
            keys.a.pressed = true
            break
        case 'w':
            player.velocity.y = -10
            break
        case ' ':
            player.attack()
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
        case 'ArrowDown':
            enemy.attack()
            break
    }
})

window.addEventListener('keyup', (event) => {
    switch (event.key) {
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

    switch (event.key) {
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
})
