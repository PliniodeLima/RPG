// Variáveis do jogo
let xp = 0;
let health = 100;
let gold = 50;
let currentWeaponIndex = 0;
let fighting;
let monsterHealth;
let inventory = ["um Pau Fuleiro"];
const button1 = document.querySelector("#button1");
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterName = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");

// Música de fundo
const backgroundMusic = document.getElementById("backgroundMusic");
const volumeControl = document.getElementById("volume");
backgroundMusic.volume = 0.5; // Define o volume inicial em 50%
backgroundMusic.play();
document.getElementById("volume").addEventListener("input", function () {
  var audio = document.getElementById("backgroundMusic");
  audio.volume = this.value;
});

// Inicialização do jogo
document.addEventListener("DOMContentLoaded", function () {
  const playerName = localStorage.getItem("playerName") || "Desconhecido";
  const playerClass = localStorage.getItem("playerClass") || "Nenhuma classe";

  document.getElementById("playerNameDisplay").innerText = playerName;
  document.getElementById("playerClassDisplay").innerText = playerClass;
});

const weapons = [
  {
    name: "um Pau Fuleiro ",
    power: 7,
  },
  {
    name: " uma Adaga Especial ",
    power: 35,
  },
  {
    name: " um Machado Lendário ",
    power: 60,
  },
  {
    name: " uma Espada Divina",
    power: 120,
  },
];

const monsters = [
  {
    name: "Gosma",
    level: 2,
    health: 20,
  },
  {
    name: "Fera Dentada",
    level: 9,
    health: 80,
  },
  {
    name: "Dragão",
    level: 30,
    health: 400,
  },
];

const locations = [
  {
    name: "town square",
    "button text": [
      "Ir para a loja",
      "Ir para a caverna",
      "Lutar contra o dragão",
    ],
    "button functions": [goStore, goCave, fightDragon],
    text: `Você se encontra na praça central da cidade, onde as sombras das construções antigas se estendem pelo chão. O vento traz um sussurro de perigo, misturado com o distante rugido de uma criatura temível. O ferreiro está no centro da praça, sua loja cheia de equipamentos que podem ajudá-lo em sua jornada. Olhe ao redor e escolha seu próximo passo com sabedoria.`,
  },
  {
    name: "store",
    "button text": [
      "Comprar 10 de vida (10 ouro)",
      "Comprar arma (30 ouro)",
      "Ir para a praça da cidade",
    ],
    "button functions": [buyHealth, buyWeapon, goTown],
    text: `Você entra na loja do ferreiro, o aroma de metal e fumaça o envolve. O ferreiro, um homem robusto com uma barba espessa, olha para você com um sorriso astuto. "Bem-vindo, viajante!" ele diz. "Aqui, você encontrará itens que podem ser cruciais para sua jornada. Olhe ao redor e veja o que eu tenho a oferecer."`,
  },
  {
    name: "cave",
    "button text": [
      "Lutar contra Gosma",
      "Lutar contra Fera Dentada",
      "Ir para a praça da cidade",
    ],
    "button functions": [fightSlime, fightBeast, goTown],
    text: `A caverna é um labirinto de túneis úmidos e escuros. O eco de gotas de água caindo nas paredes é o único som além de seu coração acelerado. Você sente a presença de criaturas perigosas à espreita nas sombras. Prepare-se para enfrentar os monstros que habitam este lugar sombrio.`,
  },
  {
    name: "fight",
    "button text": ["Atacar", "Esquivar", "Correr"],
    "button functions": [attack, dodge, goTown],
    text: `Você se depara com um monstro feroz, seus olhos brilhando com uma luz sinistra na escuridão. O cheiro de ferocidade e perigo preenche o ar. Agora é hora de mostrar sua coragem e habilidade em combate. O destino está nas suas mãos.`,
  },
  {
    name: "kill monster",
    "button text": [
      "Ir para a praça da cidade",
      "Ir para a praça da cidade",
      "Ir para a praça da cidade",
    ],
    "button functions": [goTown, goTown, easterEgg],
    text: `O monstro solta um último rugido de dor antes de cair pesadamente no chão. Você se sente exultante, mas também cansado. Enquanto examina o corpo do monstro, encontra alguns itens valiosos que podem ajudá-lo em sua jornada. A batalha foi dura, mas a vitória é sua!`,
  },
  {
    name: "lose",
    "button text": ["JOGAR NOVAMENTE?", "JOGAR NOVAMENTE?", "JOGAR NOVAMENTE?"],
    "button functions": [restart, restart, restart],
    text: `A derrota é amarga. O monstro, com um último golpe devastador, conseguiu vencer você. O mundo ao seu redor se torna turvo enquanto você sente a força esvair-se. Suas aventuras chegam ao fim por enquanto... mas lembre-se, cada derrota é uma lição. O que você aprendeu pode moldar um futuro mais brilhante.`,
  },
  {
    name: "win",
    "button text": ["JOGAR NOVAMENTE?", "JOGAR NOVAMENTE?", "JOGAR NOVAMENTE?"],
    "button functions": [restart, restart, restart],
    text: `Você triunfa sobre o dragão, seu rugido ecoando pela terra enquanto a paz retorna ao reino. As chamas e o caos dão lugar a um novo dia, e você se ergue como um herói. O reino celebra sua coragem e bravura. Parabéns, herói! Sua jornada fez história.`,
  },
  {
    name: "easter egg",
    "button text": ["2", "8", "Ir para a praça da cidade?"],
    "button functions": [pickTwo, pickEight, goTown],
    text: `Você descobriu um baú secreto, escondido entre as pedras e coberto de poeira. O baú brilha com uma aura mágica e misteriosa. Dentro, há um desafio: escolha um número entre 0 e 10. Se o número escolhido corresponder a um dos números aleatórios gerados, você será recompensado com uma surpresa! Boa sorte!`,
  },
];

button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

function update(location) {
  monsterStats.style.display = "none";
  button1.innerText = location["button text"][0];
  button2.innerText = location["button text"][1];
  button3.innerText = location["button text"][2];

  button1.onclick = location["button functions"][0];
  button2.onclick = location["button functions"][1];
  button3.onclick = location["button functions"][2];

  text.innerHTML = `<p>${location.text}</p>`;
  if (location.narrative) {
    text.innerHTML += `<div id="narrative"><p>${location.narrative}</p></div>`;
  }
}

function updateStats() {
  xpText.innerText = xp;
  healthText.innerText = health;
  goldText.innerText = gold;
  weaponName.innerText = weapons[currentWeaponIndex].name;
  weaponPower.innerText = weapons[currentWeaponIndex].power;
}

function goTown() {
  update(locations[0]);
}

function goStore() {
  update(locations[1]);
}

function goCave() {
  update(locations[2]);
}

function buyHealth() {
  if (gold >= 10) {
    gold -= 10;
    health += 10;
    goldText.innerText = gold;
    healthText.innerText = health;
    updateStats();
  } else {
    text.innerHTML = `<p>Você não tem ouro suficiente para comprar vida!</p>`;
  }
}

function buyWeapon() {
  if (currentWeaponIndex < weapons.length - 1) {
    if (gold >= 30) {
      gold -= 30;
      currentWeaponIndex++;
      goldText.innerText = gold;
      let newWeapon = weapons[currentWeaponIndex].name;
      text.innerHTML = `<p>Você agora tem ${newWeapon} !</p>`;
      inventory.push(newWeapon);
      text.innerHTML += `<p>No seu inventário você tem: ${inventory}.</p>`;
      updateStats();
    } else {
      text.innerHTML = `<p>Você não tem ouro suficiente para comprar uma arma!</p>`;
    }
  } else {
    text.innerHTML = `<p>Você já tem a arma mais poderosa!</p>`;
    button2.innerText =
      "Vender as outras armas por 15 ouro cada? Os poderes delas não são somados.";
    button2.onclick = sellWeapon;
  }
}

function sellWeapon() {
  if (inventory.length > 1) {
    gold += 15;
    goldText.innerText = gold;
    let currentWeapon = inventory.shift();
    text.innerHTML = `<p>Você vendeu ${currentWeapon}.</p>`;
    text.innerHTML += `<p>No seu inventário você tem: ${inventory}.</p>`;
    updateStats();
  } else {
    text.innerHTML = `<p>Você não pode vender sua única arma!</p>`;
  }
}

function fightSlime() {
  fighting = 0;
  goFight();
}

function fightBeast() {
  fighting = 1;
  goFight();
}

function fightDragon() {
  fighting = 2;
  goFight();
}

function goFight() {
  update(locations[3]);
  monsterHealth = monsters[fighting].health;
  monsterStats.style.display = "block";
  monsterName.innerText = monsters[fighting].name;
  monsterHealthText.innerText = monsterHealth;
}

function attack() {
  text.innerHTML = `<p>O ${monsters[fighting].name} ataca.</p>`;
  text.innerHTML += `<p>Você ataca com ${weapons[currentWeaponIndex].name}!</p>`;
  if (isMonsterHit()) {
    health -= getMonsterAttackValue(monsters[fighting].level);
    healthText.innerText = health;
  } else {
    text.innerHTML += `<p>Você esquiva do ataque do ${monsters[fighting].name}!</p>`;
  }

  monsterHealth -=
    weapons[currentWeaponIndex].power + Math.floor(Math.random() * xp) + 1;
  monsterHealthText.innerText = monsterHealth;
  if (health <= 0) {
    lose();
  } else if (monsterHealth <= 0) {
    if (fighting === 2) {
      winGame();
    } else {
      defeatMonster();
    }
  }
  if (Math.random() <= 0.1 && inventory.length !== 1) {
    text.innerHTML += `<p>Sua ${inventory.pop()} quebrou.</p>`;
    currentWeaponIndex--;
  }
}

function getMonsterAttackValue(level) {
  const hit = level * 5 - Math.floor(Math.random() * xp);
  return hit > 0 ? hit : 0;
}

function isMonsterHit() {
  return Math.random() > 0.2 || health < 20;
}

function dodge() {
  text.innerHTML = `<p>Você esquiva do ataque do ${monsters[fighting].name}!</p>`;
}

function lose() {
  update(locations[5]);
}

function winGame() {
  update(locations[6]);
}

function defeatMonster() {
  gold += Math.floor(monsters[fighting].level * 6.7);
  xp += monsters[fighting].level;
  goldText.innerText = gold;
  xpText.innerText = xp;
  update(locations[4]);
  updateStats();
}

function restart() {
  xp = 0;
  health = 100;
  gold = 50;
  currentWeaponIndex = 0;
  inventory = ["stick"];
  goldText.innerText = gold;
  healthText.innerText = health;
  xpText.innerText = xp;
  goTown();
}

function easterEgg() {
  update(locations[7]);
}

function pick(guess) {
  const numbers = [];
  while (numbers.length < 10) {
    numbers.push(Math.floor(Math.random() * 11));
  }
  text.innerHTML = `<p>Você escolheu ${guess}. Aqui estão os números aleatórios:</p>`;
  for (let i = 0; i < 10; i++) {
    text.innerHTML += `<p>${numbers[i]}</p>`;
  }
  if (numbers.includes(guess)) {
    text.innerHTML += `<p>Sorte! Você ganha 20 ouro!</p>`;
    gold += 20;
    goldText.innerText = gold;
  } else {
    text.innerHTML += `<p>Azar! Você perde 10 de vida!</p>`;
    health -= 10;
    healthText.innerText = health;
    if (health <= 0) {
      lose();
    }
  }
}

function pickTwo() {
  pick(2);
}

function pickEight() {
  pick(8);
}
