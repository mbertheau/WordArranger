const languageIcons = document.querySelectorAll('.lang-icon');
const sentenceInput = document.getElementById('sentence-input');
const arrangeWordsBtn = document.getElementById('arrange-words-btn');
const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2');
const arrangedWords = document.getElementById('arranged-words');
const alphabeticalWords = document.getElementById('alphabetical-words');
const changeSentenceBtn = document.getElementById('change-sentence-btn');
const linkToSentence = document.getElementById('link-to-sentence');

const defaultSentences = {
  en: 'At this place I want to say a few words about how you can spend your time in Korea usefully.',
  de: 'An dieser Stelle möchte ich gerne ein paar Worte dazu sagen, wie sie eine nützliche Zeit in Korea verbringen können.',
  zh: '在 這裡 我想說 一些 關於 你可以 怎麼 在韓國 好好 利用 你的時間 的話',
  ko: '이 자리를 통해 여러분이 한국 생활을 보람 있게 보내는 데 도움이 되도록 몇 가지 말씀드리고 싶습니다.',
};

const uiText = {
  en: {
    arrangeWordsBtn: 'Arrange words',
    changeSentence: 'Change sentence',
    linkToSentence: 'Link to this sentence',
  },
  de: {
    arrangeWordsBtn: 'Wörter anordnen',
    changeSentence: 'Satz ändern',
    linkToSentence: 'Link zu diesem Satz',
  },
  zh: {
    arrangeWordsBtn: '排列文字',
    changeSentence: '更改句子',
    linkToSentence: '句子鏈接',
  },
  ko: {
    arrangeWordsBtn: '단어 정렬',
    changeSentence: '문장 변경',
    linkToSentence: '이 문장에 대한 링크',
  },
};

function updateLanguageUI() {
  arrangeWordsBtn.textContent = uiText[currentLanguage].arrangeWordsBtn;
  changeSentenceBtn.textContent = uiText[currentLanguage].changeSentence;
  linkToSentence.textContent = uiText[currentLanguage].linkToSentence;
}

let currentLanguage = 'en';
let sentence = defaultSentences[currentLanguage];
let words = [];
let draggingWord = null;

function setDefaultSentence() {
  sentenceInput.value = defaultSentences[currentLanguage];
}

function getWords(sentence) {
  return sentence.split(/\s+/).sort();
}

function createWordElement(word) {
  const wordElement = document.createElement('span');
  wordElement.classList.add('word');
  wordElement.textContent = word;
  return wordElement;
}

function clearWords() {
  arrangedWords.innerHTML = '';
  alphabeticalWords.innerHTML = '';
}

function populateWords() {
  clearWords();

  sentence = sentenceInput.value;
  words = getWords(sentence);

  words.forEach((word) => {
    const wordElement = createWordElement(word);
    alphabeticalWords.appendChild(wordElement);
  });
}

function startDragging(e, wordElement) {
  draggingWord = wordElement;
  wordElement.classList.add('dragging');
  arrangedWords.classList.add('dragging');
  moveWord(e);
}

function moveWord(e) {
  if (!draggingWord) return;

  const closest = Array.from(arrangedWords.children).reduce((prev, curr) => {
    const currRect = curr.getBoundingClientRect();
    const currDist = Math.hypot(currRect.x - e.clientX, currRect.y - e.clientY);
    return prev.dist < currDist ? prev : { dist: currDist, elem: curr };
  }, { dist: Infinity, elem: null });

  arrangedWords.insertBefore(draggingWord, closest.elem);
}

function stopDragging() {
  if (!draggingWord) return;

  draggingWord.classList.remove('dragging');
  arrangedWords.classList.remove('dragging');
  draggingWord = null;
}

function checkCorrectOrder() {
  const arrangedWordsArray = Array.from(arrangedWords.children);
  const correctWords = sentence.split(/\s+/);

  if (arrangedWordsArray.length !== correctWords.length) {
    arrangedWords.classList.remove('correct-order');
    return;
  }

  for (let i = 0; i < arrangedWordsArray.length; i++) {
    if (arrangedWordsArray[i].textContent !== correctWords[i]) {
      arrangedWords.classList.remove('correct-order');
      return;
    }
  }

  arrangedWords.classList.add('correct-order');
}

function updateLinkToSentence() {
  const url = new URL(window.location);
  url.searchParams.set('sentence', sentence);
  linkToSentence.href = url.href;
}

languageIcons.forEach((icon) => {
  icon.addEventListener('click', () => {
    currentLanguage = icon.dataset.lang;
    setDefaultSentence();
    updateLanguageUI();
  });
});


arrangeWordsBtn.addEventListener('click', () => {
  populateWords();
  step1.classList.add('hidden');
  step2.classList.remove('hidden');
});

changeSentenceBtn.addEventListener('click', () => {
  step1.classList.remove('hidden');
  step2.classList.add('hidden');
});

alphabeticalWords.addEventListener('click', (e) => {
  if (!e.target.matches('.word')) return;
  alphabeticalWords.removeChild(e.target);
  arrangedWords.appendChild(e.target);
  checkCorrectOrder();
});

arrangedWords.addEventListener('click', (e) => {
  if (!e.target.matches('.word')) return;
  arrangedWords.removeChild(e.target);
  alphabeticalWords.appendChild(e.target);
  checkCorrectOrder();
});

arrangedWords.addEventListener('mousedown', (e) => {
  if (!e.target.matches('.word')) return;
  startDragging(e, e.target);
});

arrangedWords.addEventListener('mousemove', moveWord);

arrangedWords.addEventListener('mouseup', stopDragging);

arrangedWords.addEventListener('mouseleave', stopDragging);

setDefaultSentence();

if (window.location.search) {
  const urlParams = new URLSearchParams(window.location.search);
  const sentenceParam = urlParams.get('sentence');
  if (sentenceParam) {
    sentenceInput.value = sentenceParam;
    arrangeWordsBtn.click();
    urlParams.delete('sentence');
    window.history.replaceState({}, '', `${window.location.pathname}${urlParams}`);
  }
}

updateLinkToSentence();
updateLanguageUI();
