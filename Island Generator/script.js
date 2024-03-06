const gameContainer = document.getElementById('game-container');
const resourceTypes = ['coal', 'iron', 'oil', 'forest', 'gold', 'sulfure', 'lake'];

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function checkSurroundingResources(x, y, resourceType, distance, resourceMap) {
    for (let i = Math.max(0, x - distance); i <= Math.min(99, x + distance); i++) {
        for (let j = Math.max(0, y - distance); j <= Math.min(99, y + distance); j++) {
            if (resourceMap[i][j] === resourceType) {
                return false;
            }
        }
    }
    return true;
}

const resourceMap = new Array(100).fill(null).map(() => new Array(100).fill(null));

const fragment = document.createDocumentFragment();

for (let i = 0; i < 100; i++) {
    for (let j = 0; j < 100; j++) {
        const cell = document.createElement('div');
        let terrainType = 'ground';

        if (i < 2 || i > 97 || j < 2 || j > 97) {
            terrainType = 'water';
        } else {
            const distToCenter = Math.sqrt((i - 49) * (i - 49) + (j - 49) * (j - 49));
            if (distToCenter > 48) {
                terrainType = 'water';
            } else if (distToCenter > 44) {
                terrainType = 'shallow-water';
            } else if (distToCenter > 40) {
                terrainType = 'sand';
            } else if (distToCenter > -1) {
                terrainType = 'grass';
            }
        }

        cell.classList.add('cell', terrainType);
        fragment.appendChild(cell);

        if (terrainType === 'grass') {
            const resourceChances = {
                forest: 0.10,
                lake: 0.04,
                iron: 0.04,
                coal: 0.06,
                oil: 0.03,
                gold: 0.004,
                sulfure: 0.008
            };
        
            resourceTypes.forEach(resourceType => {
                if (Math.random() < resourceChances[resourceType]) {
                    let resourceCount = getRandomInt(10, 20);
        
                    const clusterRadius = {
                        iron: 2,
                        coal: 3,
                        gold: 1,
                        sulfure: 4
                    };
        
                    let centerX = i;
                    let centerY = j;
                  
                    // Set resource in the center cell
                    cell.classList.add(resourceType);
                    resourceMap[i][j] = resourceType;
                    resourceCount--;
        
                    // Fill surrounding cells within cluster radius
                    for (let dx = -clusterRadius[resourceType]; dx <= clusterRadius[resourceType]; dx++) {
                        for (let dy = -clusterRadius[resourceType]; dy <= clusterRadius[resourceType]; dy++) {
                            let ni = centerX + dx;
                            let nj = centerY + dy;
                    
                            if (ni >= 0 && ni <= 99 && nj >= 0 && nj <= 99 && resourceMap[ni][nj] === null) {
                                const distanceToCenter = Math.sqrt(dx * dx + dy * dy);
                                if (distanceToCenter <= clusterRadius[resourceType]) {
                                    cell.classList.add(resourceType);
                                    resourceMap[ni][nj] = resourceType;
                                    resourceCount--;
                    
                                    if (resourceCount === 0) {
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
            });
        }
    }
}

gameContainer.appendChild(fragment);

const dateDisplay = document.getElementById('date-display');

function moveDate(days) {
    let currentDate = new Date(dateDisplay.innerText);
    
    if (days === 'M') {
        currentDate.setDate(1);
        currentDate.setMonth(currentDate.getMonth() + 1);
    } else {
        currentDate.setDate(currentDate.getDate() + days);
    }

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const updatedDate = `${monthNames[currentDate.getMonth()]} ${currentDate.getDate()}, ${currentDate.getFullYear()}`;

    dateDisplay.innerText = updatedDate;
}

const cells = document.querySelectorAll('.cell');

cells.forEach(cell => {
    cell.addEventListener('click', function() {
        cells.forEach(cell => {
            cell.classList.remove('selected');
        });

        cell.classList.add('selected');
    });
});

const cityCellX = 49;
const cityCellY = 49;

function buildResidence() {
    buildBuilding(cityCellX, cityCellY, 'residence', {
        cost: 16000,
        requiredPeople: 0,
        buildTime: 7,
        buildableOn: ['ground', 'sand', 'grass'],
        lifespan: 10,
        resourcesPerDay: {
            consumed: 0,
            produced: 0,
            housingCapacity: 10
        }
    });
}

function buildWindmill() {
    buildBuilding(cityCellX, cityCellY, 'windmill', {
        cost: 23000,
        requiredPeople: 10,
        buildTime: 10,
        buildableOn: ['ground', 'sand', 'grass', 'water', 'shallow-water'],
        lifespan: 20,
        resourcesPerDay: {
            consumed: 0,
            produced: 1,
            housingCapacity: 0
        },
        seasonalEffect: {
            summer: false,
            autumn: true,
            winter: true,
            spring: true
        }
    });
}

function buildMine() {
    buildBuilding(cityCellX, cityCellY, 'mine', {
        cost: 32000,
        requiredPeople: 28,
        buildTime: 14,
        buildableOn: ['iron'],
        lifespan: 15,
        resourcesPerDay: {
            consumed: 1,
            produced: 10,
            housingCapacity: 0
        },
        seasonalEffect: {
            summer: true,
            autumn: false,
            winter: false,
            spring: false
        }
    });
}

function buildBuilding(x, y, type, specs) {
    // Проверка наличия ресурсов и проверка доступности ячейки для строительства здания по его спецификациям
    // Реализация постройки здания
    // Обновление интерфейса и информации об острове
}
