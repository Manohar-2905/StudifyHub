const GROQ_API_KEY = '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';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

async function translateText() {
    const text = document.getElementById('input-text').value.trim();
    if (!text) return;

    const fromLang = document.getElementById('from-language').value;
    const toLang = document.getElementById('to-language').value;

    try {
        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama3-70b-8192',
                messages: [
                    { role: 'system', content: `You are a translator that translates from ${fromLang} to ${toLang}.` },
                    { role: 'user', content: `Translate the following text from ${fromLang} to ${toLang}: ${text}` }
                ],
                temperature: 0.2
            })
        });

        const data = await response.json();

        if (data?.choices && data.choices[0]?.message?.content) {
            const result = data.choices[0].message.content.trim();
            document.getElementById('output-text').value = result || 'Translation failed.';
        } else {
            document.getElementById('output-text').value = 'Translation failed. Please try again.';
        }
    } catch (err) {
        console.error(err);
        document.getElementById('output-text').value = 'Error translating text. Please try again.';
    }
}

function switchLanguages() {
    const fromLang = document.getElementById('from-language');
    const toLang = document.getElementById('to-language');
    [fromLang.value, toLang.value] = [toLang.value, fromLang.value];
}

function speak(text, lang = 'auto') {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    speechSynthesis.speak(utterance);
}

document.getElementById('translate-button').addEventListener('click', translateText);
document.getElementById('switch-languages').addEventListener('click', switchLanguages);

document.getElementById('input-speak').addEventListener('click', () => {
    const text = document.getElementById('input-text').value;
    if (text) speak(text);
});

document.getElementById('output-speak').addEventListener('click', () => {
    const text = document.getElementById('output-text').value;
    if (text) speak(text);
});

document.getElementById('copy-button').addEventListener('click', () => {
    const text = document.getElementById('output-text').value;
    if (text) {
        navigator.clipboard.writeText(text).then(() => {
            console.log('Text copied to clipboard');
        }).catch(err => {
            console.error('Error copying text: ', err);
        });
    }
});
