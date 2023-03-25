const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2');
const inputSentence = document.getElementById('inputSentence');
const btnProceed = document.getElementById('btnProceed');
const btnBack = document.getElementById('btnBack');
const topHalf = document.getElementById('topHalf');
const arrangedWords = document.getElementById('arrangedWords');
const wordList = document.getElementById('wordList');
const linkToSentence = document.getElementById('linkToSentence');

let draggingWord = null;
let draggingIndex = -1;

function showStep1() {
  step1.style.display = 'flex';
  step2.style.display = 'none';
}

function showStep2() {
  step1.style.display = 'none';
  step2.style.display = 'flex';
}

function getWords(sentence) {
  return sentence.trim().split(/\s+/).sort();
}

function createWordElement(text, clickHandler) {
  const word = document.createElement('span');
  word.classList.add('word');
  word.textContent = text;
  word.addEventListener('click', clickHandler);
  return word;
}

function arrangeWords() {
  const sentence = inputSentence.value || new URLSearchParams(window.location.search).get('sentence');
  if (sentence) {
    history.replaceState({}, '', location.pathname);
    const words = getWords(sentence);
    wordList.innerHTML = '';
    arrangedWords.innerHTML = '';

    words.forEach(word => {
      const wordElement = createWordElement(word, () => {
        wordList.removeChild(wordElement);
        arrangedWords.appendChild(wordElement);
      });
      wordList.appendChild(wordElement);
    });

    linkToSentence.href = `${location.pathname}?sentence=${encodeURIComponent(sentence)}`;
    showStep2();
  } else {
    showStep1();
  }
}

function updateDragging(e) {
  if (draggingWord) {
    const rect = topHalf.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    let newIndex = -1;
    let minDistance = Infinity;

    Array.from(arrangedWords.children).forEach((word, index) => {
      const wordRect = word.getBoundingClientRect();
      const dx = x - (wordRect.left + wordRect.width / 2 - rect.left);
      const dy = y - (wordRect.top + wordRect.height / 2 - rect.top);
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < minDistance) {
        newIndex = index;
        minDistance = distance;
      }
    });

    if (y < 0 || y > rect.height) {
      arrangedWords.removeChild(draggingWord);
      wordList.appendChild(draggingWord);
    } else if (newIndex !== draggingIndex) {
      arrangedWords.insertBefore(draggingWord, arrangedWords.children[newIndex] || null);
      draggingIndex = newIndex;
    }
  }
}

btnProceed.addEventListener('click', arrangeWords);
btnBack.addEventListener('click', showStep1);

topHalf.addEventListener('mousedown', e => {
  if (e.target.classList.contains('word')) {
    draggingWord = e.target;
    draggingWord.classList.add('dragging');
  }
});

topHalf.addEventListener('mousemove', updateDragging);

topHalf.addEventListener('mouseup', () => {
  if (draggingWord) {
    draggingWord.classList.remove('dragging');
    draggingWord = null;
    draggingIndex = -1;
  }
});

topHalf.addEventListener('touchstart', e => {
  if (e.target.classList.contains('word')) {
    draggingWord = e.target;
    draggingWord.classList.add('dragging');
  }
}, { passive: false });

topHalf.addEventListener('touchmove', e => {
  e.preventDefault();
  updateDragging(e.touches[0]);
}, { passive: false });

topHalf.addEventListener('touchend', () => {
  if (draggingWord) {
    draggingWord.classList.remove('dragging');
    draggingWord = null;
    draggingIndex = -1;
  }
});

arrangeWords();
