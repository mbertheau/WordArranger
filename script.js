const defaultSentences = {
    en: 'At this place I want to say a few words about how you can spend your time in Korea usefully.',
    de: 'An dieser Stelle möchte ich gerne ein paar Worte dazu sagen, wie sie eine nützliche Zeit in Korea verbringen können.',
    zh: '在 這裡 我想說 一些 關於 你可以 怎麼 在韓國 好好 利用 你的時間 的話',
    ko: '이 자리를 통해 여러분이 한국 생활을 보람 있게 보내는 데 도움이 되도록 몇 가지 말씀드리고 싶습니다.',
};

let currentLanguage = 'en';
let currentSentence = defaultSentences[currentLanguage];
document.addEventListener('DOMContentLoaded', () => {
    parseUrlAndGetSentence();
    displayStep1();
});

function changeLanguage(lang) {
    currentLanguage = lang;
    currentSentence = defaultSentences[currentLanguage];
    displayStep1();
}

function displayStep1() {
    document.getElementById('step1').style.display = 'flex';
    document.getElementById('step2').style.display = 'none';
    document.getElementById('input-sentence').value = currentSentence;
}

function startArranging() {
    currentSentence = document.getElementById('input-sentence').value;
    document.getElementById('step1').style.display = 'none';
    document.getElementById('step2').style.display = 'flex';
    displayWords();
}

function displayWords() {
    let words = currentSentence.split(/\s+/).sort((a, b) => a.localeCompare(b));
    let wordList = document.getElementById('word-list');
    wordList.innerHTML = '';

    for (let word of words) {
        let wordElement = document.createElement('div');
        wordElement.textContent = word;
        wordElement.classList.add('word');
        wordElement.addEventListener('click', () => {
            moveToArrangedWords(wordElement);
        });
        wordList.appendChild(wordElement);
    }
}

function moveToArrangedWords(wordElement) {
    let arrangedWords = document.getElementById('arranged-words');
    wordElement.removeEventListener('click', moveToArrangedWords);
    wordElement.addEventListener('click', () => {
        moveToWordList(wordElement);
    });
    wordElement.addEventListener('mousedown', startDragging);
    wordElement.addEventListener('touchstart', startDragging);
    arrangedWords.appendChild(wordElement);
}

function moveToWordList(wordElement) {
    let wordList = document.getElementById('word-list');
    wordElement.removeEventListener('click', moveToWordList);
    wordElement.addEventListener('click', () => {
        moveToArrangedWords(wordElement);
    });
    wordElement.removeEventListener('mousedown', startDragging);
    wordElement.removeEventListener('touchstart', startDragging);
    wordList.appendChild(wordElement);
}

function startDragging(e) {
    e.preventDefault();
    let wordElement = e.target;
    let arrangedWords = document.getElementById('arranged-words');
    let dragging = false;
    let dragX, dragY;

    let onMouseMove = (e) => {
        if (!dragging) {
            dragging = true;
            wordElement.classList.add('dragging');
        }

        dragX = e.clientX || e.touches[0].clientX;
        dragY = e.clientY || e.touches[0].clientY;

        let targetIndex = getTargetIndex(arrangedWords, dragX, dragY);
        arrangedWords.insertBefore(wordElement, arrangedWords.children[targetIndex]);
    };

    let onMouseUp = () => {
        if (dragging) {
            wordElement.classList.remove('dragging');
            dragging = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            document.removeEventListener('touchmove', onMouseMove);
            document.removeEventListener('touchend', onMouseUp);

            if (isInWordListArea(dragY)) {
                moveToWordList(wordElement);
            }
        }
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('touchmove', onMouseMove);
    document.addEventListener('touchend', onMouseUp);
}

function getTargetIndex(container, x, y) {
    let children = container.children;
    let targetIndex = children.length;

    for (let i = 0; i < children.length; i++) {
        let rect = children[i].getBoundingClientRect();
       
        if (y < rect.top + rect.height / 2) {
            targetIndex = i;
            break;
        } else if (y < rect.bottom) {
            if (x < rect.left + rect.width / 2) {
                targetIndex = i;
                break;
            } else if (x < rect.right) {
                targetIndex = i + 1;
                break;
            }
        }
    }

    return targetIndex;
}

function isInWordListArea(y) {
    let wordListRect = document.getElementById('word-list').getBoundingClientRect();
    return y >= wordListRect.top && y <= wordListRect.bottom;
}

function goBackToStep1() {
    displayStep1();
}

function parseUrlAndGetSentence() {
    let urlParams = new URLSearchParams(window.location.search);
    let sentenceParam = urlParams.get('sentence');
    if (sentenceParam) {
        currentSentence = sentenceParam;
        urlParams.delete('sentence');
        window.history.replaceState({}, '', '?' + urlParams.toString());
        startArranging();
    }
}

