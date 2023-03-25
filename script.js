document.getElementById('word-form').addEventListener('submit', onSubmit);
document.getElementById('back-button').addEventListener('click', showStep1);

function onSubmit(event) {
  event.preventDefault();
  const words = document.getElementById('word-input').value.trim().split(' ').sort();
  displayWords(words);
  showStep2();
}

function displayWords(words) {
  const arrangedContainer = document.getElementById('arranged-words');
  arrangedContainer.innerHTML = '';

  const alphabeticalContainer = document.getElementById('alphabetical-words');
  alphabeticalContainer.innerHTML = '';

  words.forEach(word => {
    const wordElement = document.createElement('div');
    wordElement.className = 'word';
    wordElement.textContent = word;
    wordElement.addEventListener('click', () => moveWordToTop(wordElement));
    alphabeticalContainer.appendChild(wordElement);
  });
}

function moveWordToTop(wordElement) {
  const arrangedContainer = document.getElementById('arranged-words');
  const newWordElement = wordElement.cloneNode(true);

  newWordElement.addEventListener('click', () => {
    wordElement.style.display = 'block';
    arrangedContainer.removeChild(newWordElement);
  });

  newWordElement.addEventListener('touchstart', startDragging);
  newWordElement.addEventListener('touchmove', onTouchMove);
  newWordElement.addEventListener('touchend', stopDragging);

  newWordElement.addEventListener('mousedown', startDragging);
  newWordElement.addEventListener('mousemove', onMouseMove);
  newWordElement.addEventListener('mouseup', stopDragging);


  wordElement.style.display = 'none';
  arrangedContainer.appendChild(newWordElement);
}

let sourceElement = null;
let arrangedRows = 0;
let rowHeight = 0;

function startDragging1(event) {
  const wordElement = event.target.closest('.word');
  if (!wordElement) {
    return;
  }
  event.preventDefault();
  sourceElement = wordElement;
  sourceElement.style.transform = 'scale(1.4)';
  sourceElement.style.color = 'black';
}

function updateDraggedWordPosition1(clientX, clientY) {
  const targetElement = findTargetElement(clientX, clientY);

  if (!targetElement || targetElement === sourceElement) return;

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

  if (!targetElement) return;

  const arrangedWordsContainer = sourceElement.closest('#arranged-words');
  const targetRect = targetElement.getBoundingClientRect();

  const targetRow = Math.floor((clientY - targetRect.top) / rowHeight);
  let targetRowIndex = arrangedRows - 1;
  if (targetRow > 0) {
    targetRowIndex = Math.min(targetRowIndex, targetRow);
  }
  if (targetRowIndex < 0) {
    targetRowIndex = 0;
  }

  const currentRow = Math.floor((clientY - arrangedWordsContainer.getBoundingClientRect().top) / rowHeight);
  const currentRowIndex = Math.min(Math.max(currentRow, 0), arrangedRows - 1);

  if (targetElement === sourceElement) {
    const rowElements = arrangedWordsContainer.querySelectorAll('.word-row');
    const sourceIndex = Array.from(rowElements[currentRowIndex].querySelectorAll('.word')).indexOf(sourceElement);
    const targetIndex = Array.from(rowElements[currentRowIndex].querySelectorAll('.word')).indexOf(targetElement);

    if (sourceIndex === targetIndex || sourceIndex + 1 === targetIndex) {
      return;
    }

    if (sourceIndex < targetIndex) {
      targetElement.parentNode.insertBefore(sourceElement, targetElement.nextSibling);
    } else {
      targetElement.parentNode.insertBefore(sourceElement, targetElement);
    }
  } else if (targetElement.parentNode.classList.contains('word-row')) {
    arrangedWordsContainer.insertBefore(sourceElement, targetElement);
  } else {
    arrangedWordsContainer.insertBefore(sourceElement, arrangedWordsContainer.lastChild.nextSibling);
  }

  const newRowElements = arrangedWordsContainer.querySelectorAll('.word-row');
  if (newRowElements.length !== arrangedRows) {
    arrangedRows = newRowElements.length;
    rowHeight = arrangedWordsContainer.getBoundingClientRect().height / arrangedRows;
  }

  const newRowIndex = Array.from(newRowElements).indexOf(sourceElement.parentNode);
  if (newRowIndex !== currentRowIndex) {
    arrangedWordsContainer.insertBefore(sourceElement, newRowElements[newRowIndex].firstChild);
  }
}

function startDragging(event) {
  const wordElement = event.target.closest('.word');
  if (!wordElement) {
    return;
  }
  event.preventDefault();
  sourceElement = wordElement;
  sourceElement.style.transform = 'scale(1.4)';
  sourceElement.style.color = 'black';

  const arrangedWordsContainer = sourceElement.closest('#arranged-words');
  arrangedRows = arrangedWordsContainer.querySelectorAll('.word-row').length;
  rowHeight = arrangedWordsContainer.getBoundingClientRect().height / arrangedRows;
}

function onMouseMove(event) {
  if (!sourceElement) return;
  event.preventDefault();
  updateDraggedWordPosition(event.clientX, event.clientY);
}

function onTouchMove(event) {
  if (!sourceElement) return;
  event.preventDefault();
  updateDraggedWordPosition(event.touches[0].clientX, event.touches[0].clientY);
}

function stopDragging(event) {
  if (!sourceElement) {
    return;
  }
  sourceElement.style.transform = '';
  sourceElement.style.color = '';
  sourceElement = null;
}

function findTargetElement(x, y) {
  const touchPoint = document.elementFromPoint(x, y);
  return touchPoint ? touchPoint.closest('.word') : null;
}
function showStep1() {
  document.getElementById('step1').style.display = 'block';
  document.getElementById('step2').style.display = 'none';
}

function showStep2() {
  document.getElementById('step1').style.display = 'none';
  document.getElementById('step2').style.display = 'block';
}