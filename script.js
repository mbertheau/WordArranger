const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2');
const sentenceInput = document.getElementById('sentence-input');
const proceedBtn = document.getElementById('proceed-btn');
const topHalf = document.getElementById('top-half');
const bottomHalf = document.getElementById('bottom-half');
const wordContainer = document.getElementById('word-container');
const backBtn = document.getElementById('back-btn');

function init() {
    const urlParams = new URLSearchParams(window.location.search);
    const sentence = urlParams.get('sentence');
    if (sentence) {
        sentenceInput.value = sentence;
        proceedToStep2();
    }
}

function proceedToStep2() {
    step1.style.display = 'none';
    step2.style.display = 'block';

    const sentence = sentenceInput.value.trim();
    const words = sentence.split(/\s+/).sort();

    // Update the link
    const linkToSentence = document.getElementById('link-to-sentence');
    const encodedSentence = encodeURIComponent(sentence);
    linkToSentence.href = `?sentence=${encodedSentence}`;

    words.forEach(word => {
        const wordElem = document.createElement('div');
        wordElem.textContent = word;
        wordElem.classList.add('word');
        wordContainer.appendChild(wordElem);

        wordElem.addEventListener('click', () => {
            if (wordElem.parentElement === wordContainer) {
                topHalf.appendChild(wordElem);
            } else {
                wordContainer.appendChild(wordElem);
            }
        });

        wordElem.addEventListener('mousedown', startDragging);
        wordElem.addEventListener('touchstart', startDragging);
    });
}

function startDragging(event) {
    const wordElem = event.target;
    if (wordElem.parentElement !== topHalf) return;

    event.preventDefault();

    wordElem.classList.add('dragging');

    const onMove = (event) => {
        event.preventDefault();
        const clientX = event.clientX || event.touches[0].clientX;
        const clientY = event.clientY || event.touches[0].clientY;
        const topHalfRect = topHalf.getBoundingClientRect();

        if (clientY > topHalfRect.bottom) {
            wordContainer.appendChild(wordElem);
            wordElem.classList.remove('dragging');
            return;
        }

        wordElem.style.position = 'absolute';
        wordElem.style.left = (clientX - topHalfRect.left - wordElem.clientWidth / 2) + 'px';
        wordElem.style.top = (clientY - topHalfRect.top - wordElem.clientHeight / 2) + 'px';

        const siblings = Array.from(topHalf.children).filter(elem => elem !== wordElem);
        let targetIndex = -1;

        for (let i = 0; i < siblings.length; i++) {
            const siblingRect = siblings[i].getBoundingClientRect();
            if (clientX < siblingRect.left + siblingRect.width / 2) {
                targetIndex = i;
                break;
            }
        }

        if (targetIndex === -1) {
            topHalf.appendChild(wordElem);
        } else {
            topHalf.insertBefore(wordElem, siblings[targetIndex]);
        }
    };

    const onEnd = () => {
        wordElem.classList.remove('dragging');
        wordElem.style.position = '';
        wordElem.style.left = '';
        wordElem.style.top = '';

        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onEnd);
        document.removeEventListener('touchmove', onMove);
        document.removeEventListener('touchend', onEnd);
        document.removeEventListener('touchcancel', onEnd);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onEnd);
    document.addEventListener('touchmove', onMove);
    document.addEventListener('touchend', onEnd);
    document.addEventListener('touchcancel', onEnd);
}

proceedBtn.addEventListener('click', proceedToStep2);
backBtn.addEventListener('click', () => {
    step1.style.display = 'block';
    step2.style.display = 'none';

    while (wordContainer.firstChild) {
        wordContainer.firstChild.remove();
    }
});

init();
