let wrapper, selectBtn, searchInp, durations1, optionsDiv;
wrapper = document.querySelector(".wrapper");
selectBtn = wrapper.querySelector(".select-btn");
searchInp = wrapper.querySelector("input");
durations1 = wrapper.querySelector(".durations");
optionsDiv = wrapper.querySelector(".options1");

selectBtn.addEventListener("click", () => {
    console.log("menu open");
    wrapper.classList.toggle("active");
});

/*const preconnect = document.createElement('link');
preconnect.rel = 'preconnect';
preconnect.href = 'https://audio.jukehost.co.uk';
document.head.appendChild(preconnect);*/

var musicIdToName = [
    { id: 999, name: "🇺🇸-----English Songs-----" },
    { id: 0, url: "https://audio.jukehost.co.uk/409qkq0tgEG5zYzq90F0OnuW2X03Va2S", name: "Cupid - FIFTY FIFTY" },
];

var selectedSongName, selectedSongId, selectedSongAudio;

function addSong(selectedSong) {
    optionsDiv.innerHTML = "";
    musicIdToName.forEach(song => {
        let isSelected = song.name === selectedSong ? "selected" : "";
        let li = document.createElement("li");
        li.textContent = song.name;
        li.className = isSelected;

        li.addEventListener("click", () => {
            updateName(li, song.id, song.name, song.url);
        });

        optionsDiv.appendChild(li);
    });
}

function updateName(selectedLi, songId, songName, songAudio) {
    if (!songAudio) return;

    selectedSongId = songId;
    selectedSongName = songName;
    selectedSongAudio = songAudio;

    let song = musicIdToName.find(s => s.id === songId && s.url);

    if (song && !song.audio) {
        song.audio = new Audio(song.url);
        song.audio.load();
    }

    searchInp.value = "";
    addSong(selectedLi.innerText);
    wrapper.classList.remove("active");
    selectBtn.firstElementChild.innerText = selectedLi.innerText;
}

window.updateName = updateName;
addSong(musicIdToName[0].name);

searchInp.addEventListener("keyup", () => {
    let arr = [];
    let searchWord = searchInp.value.toLowerCase();
    arr = musicIdToName.filter(data => {
        return data.name.toLowerCase().includes(searchWord);
    }).map(data => {
        let isSelected = data.name == selectBtn.firstElementChild.innerText ? "selected" : "";
        return `<li class="${isSelected}" data-id="${data.id}">${data.name}</li>`;
    }).join("");
    optionsDiv.innerHTML = arr ? arr : `<p style="font-size: 24px; margin-top: 5px; padding-left:25px;">the song you searched hasn't been found.</p><h4>DM .wolfi_dolfi. to make it :D</h4>`;
    optionsDiv.querySelectorAll("li").forEach(li => {
        let id = parseInt(li.dataset.id);
        let song = musicIdToName.find(s => s.id === id);
        li.addEventListener("click", () => {
            updateName(li, song.id, song.name, song.url);
        });
    });
});

function turnIntoMS(t, n) {
    let a = 0;
    a += 1e3 * n;
    a += 6e4 * t;
    return a;
}

let spamModeActive = false,
    messageTimeouts = [],
    chatMessages = [];

let currentlyPlaying = document.getElementById("currentlyPlaying");

let clearChat = document.getElementById('mutechat').checked;
let chatMuted = false;
let loopSong = false;

let currentAudio = null;
let audioStarting = false;

function scheduleMessages(messages) {
    let i = 0;

    function tick() {
        if (!currentAudio || currentAudio.paused) return;

        let currentMs = currentAudio.currentTime * 1000;

        while (i < messages.length && messages[i].delay <= currentMs) {
            if (!chatMuted) packet("6", messages[i].chat);
            i++;
        }

        requestAnimationFrame(tick);
    }

    tick();
}

let playCounts = JSON.parse(localStorage.getItem("plays") || "{}");
let countedThisPlay = false;
let lastWebhookTime = 0;
let onTimeUpdateHandler = null;
const webhookURL = "";

function toggleChatSpamMode() {
    chatMessages = initializeChats(selectedSongId);

    if (spamModeActive) {
        spamModeActive = false;
        messageTimeouts.forEach(clearTimeout);
        messageTimeouts = [];

        currentlyPlaying.innerHTML = "Currently Playing: none";
        musicStatus.innerHTML = `Music Status: OFF`;

        if (selectedSongAudio) {
            let selectedAudio = musicIdToName.find(song => song.url === selectedSongAudio);
            if (selectedAudio && selectedAudio.audio) {
                selectedAudio.audio.pause();
                selectedAudio.audio.currentTime = 0;
                selectedAudio.audio.loop = false;
            }
        }
    } else if (selectedSongId !== undefined) {
        spamModeActive = true;
        currentlyPlaying.innerHTML = `Currently Playing: ${selectedSongName}`;
        musicStatus.innerHTML = `Music Status: ${spamModeActive}`;

        let selectedAudio = musicIdToName.find(song => song.url === selectedSongAudio);

        if (selectedAudio) {
            if (!selectedAudio.audio) {
                selectedAudio.audio = new Audio(selectedAudio.url);
            }

            if (currentAudio instanceof Audio) {
                currentAudio.pause();
                currentAudio.currentTime = 0;
                currentAudio.loop = false;
            }

            currentAudio = selectedAudio.audio;
            countedThisPlay = false;

            if (onTimeUpdateHandler && currentAudio) {
                currentAudio.removeEventListener("timeupdate", onTimeUpdateHandler);
            }

            onTimeUpdateHandler = function () {
                if (!currentAudio || !currentAudio.duration) return;

                let progress = currentAudio.currentTime / currentAudio.duration;

                if (!countedThisPlay && progress >= 0.25) {
                    countedThisPlay = true;

                    if (!playCounts[selectedSongId]) {
                        playCounts[selectedSongId] = 0;
                    }
                    playCounts[selectedSongId]++;

                    localStorage.setItem("plays", JSON.stringify(playCounts));
                    sendTopSongs();
                    currentAudio.removeEventListener("timeupdate", onTimeUpdateHandler);
                }
            };

            currentAudio.addEventListener("timeupdate", onTimeUpdateHandler);

            if (!audioStarting) {
                audioStarting = true;
                currentAudio.loop = loopSong;
                currentAudio.play().catch(() => {}).finally(() => {
                    audioStarting = false;
                });
            }
        }

        scheduleMessages(chatMessages);

    } else {
        console.log('select a song by pressing "Select Song" in the Mod Menu');
    }
}

document.getElementById('mutechat').addEventListener('change', function () {
    chatMuted = this.checked;
    if (chatMuted) packet("6", "");
});

document.getElementById('loopsong').addEventListener('change', function () {
    loopSong = this.checked;
    if (currentAudio) currentAudio.loop = loopSong;
});

const sendMessageToDiscord = async (data, webhookURL) => {
    const params = {
        embeds: [{
            title: `x Top Songs`,
            description: "🎵 Top 10 Played Songs",
            timestamp: new Date().toISOString(),
            color: 5814783,
            fields: [{ name: "Ranking", value: data || "No data yet", inline: false }]
        }]
    };

    const request = await fetch(webhookURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
    });

    if (!request.ok) {
        console.error('failed to send webhook:', request.statusText);
    }
};

function buildTopSongsText() {
    let topSongs = Object.entries(playCounts)
        .map(([id, count]) => {
            let song = musicIdToName.find(s => s.id == id);
            return { name: song ? song.name : "Unknown", count: count };
        })
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

    return topSongs.map((s, i) => `**${i + 1}. ${s.name}** — ${s.count} plays`).join("\n");
}

async function sendTopSongs() {
    let now = Date.now();
    if (now - lastWebhookTime < 30000) return;
    lastWebhookTime = now;
    let text = buildTopSongsText();
    await sendMessageToDiscord(text, webhookURL);
}

let pingpong1 = false, interval;
function pingpong() {
    packet("6", window.pingTime + "'pingpong");
}

function togglepingpong() {
    if (pingpong1) {
        clearInterval(interval);
    } else {
        interval = setInterval(pingpong, 1000);
    }
    pingpong1 = !pingpong1;
}

window.addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() === "c") {
        e.preventDefault();
        e.stopPropagation();
        toggleChatSpamMode();
    }
    if (e.key.toLowerCase() === "p") {
        e.preventDefault();
        e.stopPropagation();
        $(".modmenu").toggle('fade-out');
    }
    if (e.key.toLowerCase() === "u") {
        togglepingpong();
    }
}, true);

window.stopMusic = function () {
    spamModeActive = false;
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio.loop = false;
        currentAudio = null;
    }
    if (onTimeUpdateHandler && currentAudio) {
        currentAudio.removeEventListener("timeupdate", onTimeUpdateHandler);
    }
    messageTimeouts.forEach(clearTimeout);
    messageTimeouts = [];
    messageTimeouts.length = 0;
    currentlyPlaying.innerText = "Currently Playing: none";
    musicStatus.innerText = "Music Status: OFF";
};

window.addEventListener("beforeunload", () => {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio.loop = false;
        currentAudio = null;
    }
    messageTimeouts.forEach(clearTimeout);
    messageTimeouts = [];
    messageTimeouts.length = 0;
});

function initializeChats(songId) {
    if (songId === 0) {
        return [{chat:"La, la, la, la-la-la",delay:1290},{chat:"La, la-la-la, la, la-la-la",delay:3480},{chat:"A hopeless romantic",delay:8350},{chat:"all my life",delay:9890},{chat:"Surrounded by couples",delay:11520},{chat:"all the time",delay:13180},{chat:"I guess I should take it",delay:14850},{chat:"as a sign",delay:16610},{chat:"(Oh why, oh why, oh why?)",delay:18290},{chat:"I'm feeling lonely",delay:20300},{chat:"(Lonely)",delay:21730},{chat:"Oh, I wish I'd find a lover",delay:22310},{chat:"that could hold me",delay:23660},{chat:"(Hold me)",delay:24980},{chat:"Now, I'm crying in my room",delay:25690},{chat:"So skeptical of love",delay:27650},{chat:"But still, I want it",delay:30400},{chat:"more, more, more",delay:30990},{chat:"I gave a second chance",delay:33350},{chat:"to Cupid",delay:34250},{chat:"But now, I'm left here",delay:36330},{chat:"feeling stupid",delay:37340},{chat:"Oh, the way he makes me feel",delay:40290},{chat:"That love isn't real",delay:42410},{chat:"Cupid is so dumb",delay:44120},{chat:"I look for his arrow every day",delay:48310},{chat:"I guess he got lost",delay:51520},{chat:"or flew away",delay:53020},{chat:"Waiting around is",delay:54560},{chat:"a waste",delay:54870},{chat:"(Waste)",delay:55480},{chat:"Been counting the days",delay:55810},{chat:"since November",delay:56430},{chat:"Is loving as good as they say?",delay:57570},{chat:"Now I'm so lonely",delay:62740},{chat:"(Lonely)",delay:61790},{chat:"Oh, I wish I'd find a lover",delay:62320},{chat:"that could hold me",delay:63940},{chat:"(Hold me)",delay:64990},{chat:"Now, I'm crying in my room",delay:65600},{chat:"So skeptical of love",delay:67676},{chat:"But still, I want it",delay:70040},{chat:"more, more, more",delay:70880},{chat:"I gave a second chance",delay:72850},{chat:"to Cupid",delay:74030},{chat:"But now, I'm left here",delay:76230},{chat:"feeling stupid",delay:77400},{chat:"Oh, the way he makes me feel",delay:80130},{chat:"That love isn't real",delay:82190},{chat:"Cupid is so dumb",delay:83920},{chat:"Hopeless girl is seeking",delay:100840},{chat:"Someone who will",delay:104120},{chat:"share this feeling",delay:105500},{chat:"I'm a fool",delay:107590},{chat:"A fool for love,",delay:109900},{chat:"a fool for love",delay:111510},{chat:"I gave a second chance",delay:114450},{chat:"to Cupid",delay:115750},{chat:"But now, I'm left here",delay:117780},{chat:"feeling stupid",delay:118840},{chat:"Oh, the way he makes me feel",delay:121740},{chat:"That love isn't real",delay:123780},{chat:"Cupid is so dumb",delay:125700},{chat:"I gave a second chance",delay:127900},{chat:"to Cupid",delay:129140},{chat:"But now, I'm left here",delay:121310},{chat:"feeling stupid",delay:132200},{chat:"Oh, the way he makes me feel",delay:135140},{chat:"That love isn't real",delay:137150},{chat:"Cupid is so dumb",delay:139070},{chat:"Lyrics Made By Wolfi-chan",delay:143180}];
    } else if (songId === 1) {
        return [{
                chat: "songid1",
                delay: 0
            }
        ];
    }
    return [];
}
