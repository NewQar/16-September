document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const startButton = document.getElementById('start-button');
    const menu = document.getElementById('menu');

    let world = {
        size: 0,
        background: 'area1.png'
    };

    const originalPoints = [
        { x: 100, y: 100, width: 50, height: 50, background: 'area2.png' },
        { x: 700, y: 700, width: 50, height: 50, background: 'area1.png' }
    ];

    const originalCharacter = {
        x: 400,
        y: 400,
        width: 50,
        height: 50,
        speed: 10
    };

    const originalObstacles = [
        { x: 200, y: 200, width: 50, height: 50 }
    ];

    let points = [];
    let obstacles = [];
    let character = {};

    function scaleWorld() {
        const scaleFactor = world.size / 900;
        // console.log("Scale: "+scaleFactor);

        points = originalPoints.map(point => ({
            ...point,
            x: point.x * scaleFactor,
            y: point.y * scaleFactor,
            width: point.width * scaleFactor,
            height: point.height * scaleFactor
        }));

        obstacles = originalObstacles.map(obs => ({
            ...obs,
            x: obs.x * scaleFactor,
            y: obs.y * scaleFactor,
            width: obs.width * scaleFactor,
            height: obs.height * scaleFactor
        }));
        
        character = {
            x: originalCharacter.x * scaleFactor,
            y: originalCharacter.y * scaleFactor,
            width: originalCharacter.width * scaleFactor,
            height: originalCharacter.height * scaleFactor,
            speed: originalCharacter.speed * scaleFactor
        };
    
    }

    function drawCharacter() {
        ctx.fillStyle = 'blue';
        ctx.fillRect(character.x - character.width / 2, character.y - character.height / 2, character.width, character.height);
    }

    function drawObstacles() {
        ctx.fillStyle = 'gray';
        obstacles.forEach(obs => {
            ctx.fillRect(obs.x - obs.width/2, obs.y - obs.height/2, obs.width, obs.height);
        });
    }

    function drawPoints() {
        ctx.fillStyle = 'green';
        points.forEach(point => {
            ctx.fillRect(point.x - point.width/2, point.y-point.height/2, point.width, point.height);
        });
    }

    function drawWorld() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawObstacles();
        drawCharacter();
        drawPoints();
    }

    function moveCharacter(dx, dy) {
        originalCharacter.x += dx;
        originalCharacter.y += dy;
        scaleWorld();
        const newX = character.x;
        const newY = character.y;
        console.log((newX-(character.width/2))<world.size&&(newY-(character.height/2))<world.size);
        console.log((newX-(character.width/2))>0&&(newY-(character.height/2))>0);
        // console.log((newX+character.width)>0);
    
        if (!checkCollision(newX, newY) && (newX-(character.width/2))>0&&(newY-(character.height/2))>0 && (newX+(character.width/2))<world.size&&(newY+(character.height/2))<world.size) {

            console.log(newX, newY);
            
            // Check interaction with points
            checkPointInteraction(character.x, character.y);
            drawWorld();
        } else {
            originalCharacter.x -= dx;
            originalCharacter.y -= dy;
            scaleWorld();
            const newX = character.x;
            const newY = character.y;
            console.log("Collision detected at:", newX, newY);
        }
    }
    

    function checkCollision(x, y) {
        return obstacles.some(obs => {
            console.log(obs.x , obs.width);
            console.log(obs.y , obs.height);
            return (
                x < obs.x + obs.width &&
                x + character.width > obs.x &&
                y < obs.y + obs.height &&
                y + character.height > obs.y
            );
        });
    }

    function checkPointInteraction(x, y) {
        points.forEach(point => {
            if (Math.abs(x - point.x) <= character.width && Math.abs(y - point.y) <= character.height) {
                canvas.style.backgroundImage = `url('${point.background}')`;
            }
        });
    }

    function updateCanvas() {
        const containerSize = Math.min(canvas.parentElement.offsetWidth, canvas.parentElement.offsetHeight);
        canvas.width = containerSize;
        canvas.height = containerSize;
    
        // Update world size to match canvas dimensions
        world.size = containerSize;
    
        scaleWorld(); // Apply scaling to points, obstacles, and character
        drawWorld();
    }
    

    startButton.addEventListener('click', () => {
        menu.classList.add('hidden');
        updateCanvas();
    });

    document.addEventListener('keydown', (event) => {
        switch (event.key) {
            case 'w':
            case 'ArrowUp':
                console.log(originalCharacter.x);
                moveCharacter(0, -originalCharacter.speed);
                console.log(originalCharacter.x);
                break;
            case 's':
            case 'ArrowDown':
                moveCharacter(0, originalCharacter.speed);
                break;
            case 'a':
            case 'ArrowLeft':
                moveCharacter(-originalCharacter.speed, 0);
                break;
            case 'd':
            case 'ArrowRight':
                moveCharacter(originalCharacter.speed, 0);
                break;
        }
    });

    window.addEventListener('resize', updateCanvas);
});
