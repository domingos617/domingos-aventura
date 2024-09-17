const storyTextElement = document.getElementById('story-text');
const optionsContainer = document.getElementById('options-container');
const inventoryList = document.getElementById('inventory-list');

let state = {
  inventory: []
};

function startGame() {
  state = { inventory: [] };
  showStoryNode(1);
  updateInventory();
}

function showStoryNode(storyNodeIndex) {
  const storyNode = storyNodes.find(node => node.id === storyNodeIndex);
  storyTextElement.innerText = storyNode.text;

  while (optionsContainer.firstChild) {
    optionsContainer.removeChild(optionsContainer.firstChild);
  }

  storyNode.options.forEach(option => {
    if (showOption(option)) {
      const button = document.createElement('button');
      button.innerText = option.text;
      button.addEventListener('click', () => selectOption(option));
      optionsContainer.appendChild(button);
    }
  });
}

function showOption(option) {
  return option.requiredState == null || option.requiredState(state);
}

function selectOption(option) {
  const nextNodeId = option.nextNode;
  if (option.setState) {
    state = Object.assign(state, option.setState);
  }
  if (option.addItem) {
    state.inventory.push(option.addItem);
    updateInventory();
  }
  if (option.removeItem) {
    const index = state.inventory.indexOf(option.removeItem);
    if (index > -1) {
      state.inventory.splice(index, 1);
      updateInventory();
    }
  }

  if (nextNodeId <= 0) {
    return startGame();
  }

  showStoryNode(nextNodeId);
}

function updateInventory() {
  while (inventoryList.firstChild) {
    inventoryList.removeChild(inventoryList.firstChild);
  }

  state.inventory.forEach(item => {
    const li = document.createElement('li');
    li.innerText = item;
    inventoryList.appendChild(li);
  });
}

const storyNodes = [
  {
    id: 1,
    text: 'Você acorda em uma floresta densa, sem lembrar como chegou aqui. Há dois caminhos à sua frente: um à esquerda, que parece levar a uma cabana, e um à direita, que vai para uma colina.',
    options: [
      {
        text: 'Seguir o caminho da esquerda',
        nextNode: 2
      },
      {
        text: 'Seguir o caminho da direita',
        nextNode: 3
      }
    ]
  },
  {
    id: 2,
    text: 'Você chega a uma cabana. A porta está entreaberta. Você pode entrar ou seguir adiante.',
    options: [
      {
        text: 'Entrar na cabana',
        nextNode: 4
      },
      {
        text: 'Seguir adiante',
        nextNode: 5
      }
    ]
  },
  {
    id: 3,
    text: 'Você sobe a colina e encontra uma espada cravada no chão. Você pode pegá-la ou continuar subindo.',
    options: [
      {
        text: 'Pegar a espada',
        addItem: 'Espada',
        nextNode: 6
      },
      {
        text: 'Continuar subindo',
        nextNode: 7
      }
    ]
  },
  {
    id: 4,
    text: 'Dentro da cabana, você encontra uma chave antiga em cima de uma mesa.',
    options: [
      {
        text: 'Pegar a chave',
        addItem: 'Chave',
        nextNode: 5
      },
      {
        text: 'Sair da cabana',
        nextNode: 5
      }
    ]
  },
  {
    id: 5,
    text: 'Você continua seu caminho e encontra um portão trancado. Parece que a chave que você encontrou pode abrir o portão.',
    options: [
      {
        text: 'Usar a chave para abrir o portão',
        requiredState: (currentState) => currentState.inventory.includes('Chave'),
        removeItem: 'Chave',
        nextNode: 8
      },
      {
        text: 'Voltar e explorar outro caminho',
        nextNode: 1
      }
    ]
  },
  {
    id: 6,
    text: 'Você pegou a espada! Ela parece ter um poder especial.',
    options: [
      {
        text: 'Voltar para a floresta',
        nextNode: 1
      },
      {
        text: 'Continuar subindo a colina',
        nextNode: 7
      }
    ]
  },
  {
    id: 7,
    text: 'No topo da colina, você encontra um dragão! Ele parece ameaçador, mas com sua espada mágica, você tem uma chance de vencê-lo.',
    options: [
      {
        text: 'Lutar contra o dragão',
        requiredState: (currentState) => currentState.inventory.includes('Espada'),
        nextNode: 9
      },
      {
        text: 'Fugir para a floresta',
        nextNode: 1
      }
    ]
  },
  {
    id: 8,
    text: 'Você usou a chave para abrir o portão e encontrou um tesouro escondido. Você venceu o jogo!',
    options: [
      {
        text: 'Recomeçar',
        nextNode: -1
      }
    ]
  },
  {
    id: 9,
    text: 'Você derrotou o dragão com a espada mágica e se torna o herói da terra! Você venceu o jogo!',
    options: [
      {
        text: 'Recomeçar',
        nextNode: -1
      }
    ]
  }
];

startGame();