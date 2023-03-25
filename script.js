document.getElementById('word-form').addEventListener('submit', function(event) {
  event.preventDefault();
  const input = document.getElementById('word-input').value.trim();
  const words = input.split(' ').sort();
  displayWords(words);
  showStep2();
});

document.getElementById('back-button').addEventListener('click', function() {
  showStep1();
});

document.getElementById('arranged-words').addEventListener('mouseleave', onMouseUp);


function displayWords(words) {
  // Clear the arranged words container
  const arrangedContainer = document.getElementById('arranged-words');
  arrangedContainer.innerHTML = '';

  const alphabeticalContainer = document.getElementById('alphabetical-words');
  alphabeticalContainer.innerHTML = '';
  words.forEach(word => {
    const wordElement = document.createElement('div');
    wordElement.className = 'word';
    wordElement.textContent = word;
    wordElement.addEventListener('click', function() {
      moveWordToTop(wordElement);
    });
    alphabeticalContainer.appendChild(wordElement);
  });
}

function moveWordToTop(wordElement) {
  const arrangedContainer = document.getElementById('arranged-words');
  const newWordElement = wordElement.cloneNode(true);
  newWordElement.id = 'word-' + Math.random().toString(36).substr(2, 9);
  newWordElement.addEventListener('click', function() {
    wordElement.style.display = 'block';
    arrangedContainer.removeChild(newWordElement);
  });
  newWordElement.addEventListener('touchstart', onTouchStart);
  newWordElement.addEventListener('touchmove', onTouchMove);
  newWordElement.addEventListener('touchend', onTouchEnd);

  newWordElement.addEventListener('mousedown', onMouseDown);
  newWordElement.addEventListener('mousemove', onMouseMove);
  newWordElement.addEventListener('mouseup', onMouseUp);



  wordElement.style.display = 'none';
  arrangedContainer.appendChild(newWordElement);
}

let mouseDownTarget = null;
let mouseDown = false;

let sourceElement = null;
let initialMouseX = null;
let initialMouseY = null;

function onMouseDown(event) {
  const wordElement = event.target.closest('.word');
  if (!wordElement) {
    return;
  }
  event.preventDefault();
  sourceElement = wordElement;
  initialMouseX = event.clientX;
  initialMouseY = event.clientY;
  sourceElement.style.opacity = '0.5';
}

function onMouseMove(event) {
  if (!sourceElement) {
    return;
  }
  event.preventDefault();

  const dx = event.clientX - initialMouseX;
  const dy = event.clientY - initialMouseY;

  if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
    updateDraggedWordPosition(event.clientX, event.clientY);
  }
}

function onMouseUp(event) {
  if (!sourceElement) {
    return;
  }
  sourceElement.style.opacity = '1';
  sourceElement = null;
  initialMouseX = null;
  initialMouseY = null;
}


function updateDraggedWordPosition(clientX, clientY) {
  const targetElement = findTargetElement(clientX, clientY);
  const sourceElement = mouseDownTarget || touchStartTarget;

  if (!targetElement || targetElement === sourceElement) {
    return;
  }

  const arrangedWordsContainer = sourceElement.closest('#arranged-words');
  const targetRect = targetElement.getBoundingClientRect();
  const sourceRect = sourceElement.getBoundingClientRect();

  if (targetRect.left + targetRect.width / 2 < sourceRect.left + sourceRect.width / 2) {
    arrangedWordsContainer.insertBefore(sourceElement, targetElement);
  } else {
    arrangedWordsContainer.insertBefore(sourceElement, targetElement.nextSibling);
  }
}

function updateDraggedWordPosition(clientX, clientY) {
  const targetElement = findTargetElement(clientX, clientY);

  if (!targetElement || targetElement === sourceElement) {
    return;
  }

  const arrangedWordsContainer = sourceElement.closest('#arranged-words');
  const targetRect = targetElement.getBoundingClientRect();
  const sourceRect = sourceElement.getBoundingClientRect();

  if (targetRect.left + targetRect.width / 2 < sourceRect.left + sourceRect.width / 2) {
    arrangedWordsContainer.insertBefore(sourceElement, targetElement);
  } else {
    arrangedWordsContainer.insertBefore(sourceElement, targetElement.nextSibling);
  }
}


let touchStartTarget = null;
let touchStartTimeout = null;

function onTouchStart(event) {
  const wordElement = event.target.closest('.word');
  if (!wordElement) {
    return;
  }
  event.preventDefault();
  touchStartTarget = wordElement;
  touchStartTarget.style.opacity = '0.5';
}

function onTouchEnd(event) {
  if (!touchStartTarget) {
    return;
  }
  touchStartTarget.style.opacity = '1';
  touchStartTarget = null;
}

function onTouchMove(event) {
  if (!touchStartTarget) {
    return;
  }
  event.preventDefault();
  updateDraggedWordPosition(event.touches[0].clientX, event.touches[0].clientY);
}

function findTargetElement(x, y) {
  const touchPoint = document.elementFromPoint(x, y);
  if (!touchPoint) {
    return null;
  }
  return touchPoint.closest('.word');
}

function showStep1() {
  document.getElementById('step1').style.display = 'block';
  document.getElementById('step2').style.display = 'none';
}

function showStep2() {
  document.getElementById('step1').style.display = 'none';
  document.getElementById('step2').style.display = 'block';
}