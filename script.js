const storyTextElement = document.getElementById('story-text');
const optionsContainer = document.getElementById('options-container');

let state = {};  // Armazena o estado atual do jogador

function startGame() {
  state = {};
  showStoryNode(1);  // Começa no primeiro nó da história
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
  if (nextNodeId <= 0) {
    return startGame();  // Reinicia o jogo
  }

  state = Object.assign(state, option.setState);
  showStoryNode(nextNodeId);
}

const storyNodes = [
  {
    id: 1,
    text: 'Você está em uma floresta escura. Há dois caminhos à sua frente. Qual você escolhe?',
    options: [
      {
        text: 'Seguir pelo caminho da esquerda',
        nextNode: 2
      },
      {
        text: 'Seguir pelo caminho da direita',
        nextNode: 3
      }
    ]
  },
  {
    id: 2,
    text: 'Você seguiu pelo caminho da esquerda e encontrou um rio. Você pode atravessá-lo ou voltar.',
    options: [
      {
        text: 'Atravessar o rio',
        nextNode: 4
      },
      {
        text: 'Voltar para a bifurcação',
        nextNode: 1
      }
    ]
  },
  {
    id: 3,
    text: 'Você seguiu pelo caminho da direita e encontrou uma caverna escura. Você pode entrar ou voltar.',
    options: [
      {
        text: 'Entrar na caverna',
        nextNode: 5
      },
      {
        text: 'Voltar para a bifurcação',
        nextNode: 1
      }
    ]
  },
  {
    id: 4,
    text: 'Você atravessou o rio e chegou em uma vila. Você venceu!',
    options: [
      {
        text: 'Recomeçar',
        nextNode: -1
      }
    ]
  },
  {
    id: 5,
    text: 'Você entrou na caverna e encontrou um tesouro! Você venceu!',
    options: [
      {
        text: 'Recomeçar',
        nextNode: -1
      }
    ]
  }
];

startGame();