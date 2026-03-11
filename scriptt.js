let wrapper, selectBtn, searchInp, durations1, optionsDiv;
wrapper = document.querySelector(".wrapper");
selectBtn = wrapper.querySelector(".select-btn");
searchInp = wrapper.querySelector("input");
durations1 = wrapper.querySelector(".durations");
optionsDiv = wrapper.querySelector(".options");

selectBtn.addEventListener("click", () => {
    console.log("menu open");
    wrapper.classList.toggle("active");
});

var musicIdToName = [{
        id: 0,
        audio: new Audio("https://audio.jukehost.co.uk/qRWB46i1xCaGI0hOJwRpTpYgNL5BmNm2"),
        name: "9mm"
    },
    {
        id: 1,
        audio: new Audio("https://audio.jukehost.co.uk/XeVOoimwpE2LBfutx2Snxv7KzGqUMtfc"),
        name: "money"
    },
    {
        id: 2,
        audio: new Audio("https://audio.jukehost.co.uk/Ryc9fFKSVSNh5NXd6AOyAlFLKxwLSaZK"),
        name: "ez4ence"
    },
    {
        id: 3,
        audio: new Audio("https://audio.jukehost.co.uk/EFTSbXMbUqo2inkLllWTDm6ZpN8cDxxv"),
        name: "valorent"
    },
    {
        id: 4,
        audio: new Audio("https://audio.jukehost.co.uk/nuX7JXzjbzqTe2zkS5T5NyDLQNugKjyI"),
        name: "rammstein"
    }
];
var selectedSongName, selectedSongId, selectedSongAudio;

function addSong(selectedSong) {
    optionsDiv.innerHTML = "";
    musicIdToName.forEach(song => {
        let isSelected = song.name === selectedSong ? "selected" : "";
        let li = `<li onclick="updateName(this, ${song.id}, '${song.name}', '${song.audio.src}')" class="${isSelected}">${song.name}</li>`;
        optionsDiv.insertAdjacentHTML("beforeend", li);
    });
}

function updateName(selectedLi, songId, songName, songAudio) {
    selectedSongId = songId;
    selectedSongName = songName;
    selectedSongAudio = songAudio;
    let goofyTable = [{
            name: "songId Selected:",
            value: selectedSongId
        },
        {
            name: "Selected song name:",
            value: selectedSongName
        },
    ]
    console.table(goofyTable)
    console.log("their audio file is:", selectedSongAudio)
    searchInp.value = "";
    addSong(selectedLi.innerText);
    wrapper.classList.remove("active");
    selectBtn.firstElementChild.innerText = selectedLi.innerText;
    //console.log(selectedLi.innerText, "is selected")
}
addSong(musicIdToName[0].name);

searchInp.addEventListener("keyup", () => {
    let arr = [];
    let searchWord = searchInp.value.toLowerCase();
    arr = musicIdToName.filter(data => {
        return data.name.toLowerCase().includes(searchWord);
    }).map(data => {
        let isSelected = data.name == selectBtn.firstElementChild.innerText ? "selected" : "";
        return `<li onclick="updateName(this)" class="${isSelected}">${data.name}</li>`;
    }).join("");
    optionsDiv.innerHTML = arr ? arr : `<p style="font-size: 24px; margin-top: 5px; padding-left:25px;">the song you searched hasn't been found.</p><h4>DM .wolfi_dolfi. to make it :D</h4>`;
    durations1.innerHTML = "";
});



window.addEventListener('wheel', function (e) {
    const scrollAmount = e.deltaY * 0.1;
    //const smootherScrolling = Math.cos(scrollAmount * Math.PI / 2);

    optionsDiv.scrollTop += scrollAmount;
    durations1.scrollTop += scrollAmount;
    //scrollbar.scrollTop += scrollAmount; 
});

//selectBtn.addEventListener("click", () => wrapper.classList.toggle("active"));
let durations = [];

musicIdToName.forEach(song => {
    song.audio.addEventListener('canplaythrough', function () {
        durations.push(song.audio.duration);
        if (durations.length === musicIdToName.length) {
            durations1.innerHTML = generateAudioOptions();
        }
    });
});

function generateAudioOptions() {
    var optionsHTML = '';
    musicIdToName.forEach((song, index) => {
        optionsHTML += `
            <li id="${song.audio.src}">${formatTime(durations[index])}</li>
        `;
    });
    return optionsHTML;
}

//formarts the time so it doesn't show for example: 108.744
function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    let secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs} minutes`;
}

function initializeChats(songId) {
    if (songId === 0) {
        return [{
            chat: "Ah yeah, testin'",
            delay: 6528
        }, {
            chat: "one two, one two",
            delay: 7540
        }, {
            chat: "This a lil' something for you",
            delay: 10550
        }, {
            chat: "you lil' biatch",
            delay: 11160
        }, {
            chat: "Watch my 9mm go bang",
            delay: 12620
        }, {
            chat: "Wa-da-da-dang",
            delay: 15700
        }, {
            chat: "wa-da-da-da-dang",
            delay: 16930
        }, {
            chat: "Watch my 9mm go bang",
            delay: 18960
        }, {
            chat: "Wa-da-da-dang",
            delay: 22020
        }, {
            chat: "wa-da-da-da-da-dang",
            delay: 23230
        }, {
            chat: "Player haters",
            delay: 24790
        }, {
            chat: "Player haters, masturbators",
            delay: 25550
        }, {
            chat: "bitches all up in my shit",
            delay: 26440
        }, {
            chat: "Living scared",
            delay: 27973
        }, {
            chat: "you know you dead",
            delay: 28645
        }, {
            chat: "walkin' around with",
            delay: 29450
        }, {
            chat: "a crippled leg",
            delay: 30370
        }, {
            chat: "That bitch boy tried to",
            delay: 31050
        }, {
            chat: "test my shit",
            delay: 31900
        }, {
            chat: "fucking with the rizzo click",
            delay: 32530
        }, {
            chat: "M-A-G-N-O-L-I-A",
            delay: 34160
        }, {
            chat: "that is where yo' ass will lay",
            delay: 36045
        }, {
            chat: "You player haters on my dick",
            delay: 37273
        }, {
            chat: "tryin' to put me in a click",
            delay: 38690
        }, {
            chat: "I'll buck you twice",
            delay: 40230
        }, {
            chat: "I'll buck one more",
            delay: 41310
        }, {
            chat: "All you cowards hit the floor",
            delay: 42210
        }, {
            chat: "These jealous fellas",
            delay: 43365
        }, {
            chat: "in a gang knowing",
            delay: 44260
        }, {
            chat: "that they ass is lame",
            delay: 45380
        }, {
            chat: "Big-ass smile",
            delay: 46520
        }, {
            chat: "but still as lame",
            delay: 47250
        }, {
            chat: "You got a Glock?",
            delay: 48080
        }, {
            chat: "Then buck me, bitch",
            delay: 48860
        }, {
            chat: "When that smoke",
            delay: 49650
        }, {
            chat: "is in my nose",
            delay: 50520
        }, {
            chat: "I be wantin' to kidnap hoes",
            delay: 51210
        }, {
            chat: "Talkin' shit about Da Click?",
            delay: 52670
        }, {
            chat: "You gon' get yo ass kicked",
            delay: 54360
        }, {
            chat: "I hop out my fuckin' ride",
            delay: 55610
        }, {
            chat: "and put my Glock",
            delay: 57224
        }, {
            chat: "to yo sidÐµ",
            delay: 58100
        }, {
            chat: "Lockin' the fucking trunk",
            delay: 58890
        }, {
            chat: "and then I'll hit that blunt",
            delay: 60260
        }, {
            chat: "Now-",
            delay: 61910
        }, {
            chat: "Watch my 9mm go bang",
            delay: 62440
        }, {
            chat: "Wa-da-da-dang",
            delay: 65270
        }, {
            chat: "wa-da-da-da-dang",
            delay: 66320
        }, {
            chat: "Watch my 9mm go bang",
            delay: 68460
        }, {
            chat: "Wa-da-da-dang",
            delay: 71470
        }, {
            chat: "wa-da-da-da-da-dang",
            delay: 72540
        }, {
            chat: "This a lil' something for you",
            delay: 75050
        }, {
            chat: "you lil' biatch",
            delay: 76328
        }];
    } else if (songId === 1) {
        return [{
                chat: "songid1",
                delay: 0
            },
            {
                chat: "lets lets songid 1",
                delay: 1500
            },
            {
                chat: "index 1 thats the number songid1",
                delay: 4334
            }
        ];
    }
    return [];
}
// chat varibles
let spamModeActive = false,
    messageTimeouts = [],
    startAudio,
    chatMessages = [];

// chat display varible
let /*chatDisplay = document.getElementById("chatDisplay"),*/
    currentlyPlaying = document.getElementById("currentlyPlaying");

// how to spell varible
let clearChat = document.getElementById('mutechat').checked;
let chatMuted = false;
let loopSong = false;

function toggleChatSpamMode() {
    chatMessages = initializeChats(selectedSongId);

    if (spamModeActive) {
        //clear varible to false
        spamModeActive = false;
        messageTimeouts.forEach(clearTimeout);
        messageTimeouts = [];

        //falsing status
        currentlyPlaying.innerHTML = "Currently Playing: none";
        musicStatus.innerHTML = `Music Status: OFF`
        //chatDisplay.innerHTML = "";

        //audio deactivation
        if (selectedSongAudio) {
            let selectedAudio = musicIdToName.find(song => song.audio.src === selectedSongAudio);
            if (selectedAudio) {
                selectedAudio.audio.pause();
                selectedAudio.audio.currentTime = 0;
                selectedAudio.audio.loop = false;
            }
        }
    } else if (selectedSongId !== undefined) {
        //variable stuff
        spamModeActive = true;
        currentlyPlaying.innerHTML = `Currently Playing: ${selectedSongName}`;
        musicStatus.innerHTML = `Music Status: ${spamModeActive}`
        //chatDisplay.innerHTML = "";


        //audio output
        if (selectedSongAudio) {
            let selectedAudio = musicIdToName.find(song => song.audio.src === selectedSongAudio);
            if (selectedAudio) {
                selectedAudio.audio.loop = loopSong;
                selectedAudio.audio.play();
            }
        }
        //chat output
        chatMessages.forEach((message) => {
            let timeoutId = setTimeout(() => {
                if (!chatMuted) { // check (if you delete this it wont work for some reason)
                    //chatDisplay.innerHTML = message.chat;
                    packet("6", message.chat)
                }
            }, message.delay);
            messageTimeouts.push(timeoutId);
        });

    } else { //if there isnt a song selected output this
        console.log('select a song by pressing "Select Song in the Mod Menu"');
    }
}

function handleKeyBind(e) {
    if (e.key === "c" && "chatbox" !== document.activeElement.id.toLowerCase()) {
        toggleChatSpamMode();
    }
}
window.addEventListener("keydown", handleKeyBind);

function handleMuteChat() {
    chatMuted = this.checked;
    console.log("chat muted status", chatMuted);
    if (chatMuted) {
        //chatDisplay.innerHTML = "";
        packet("6", "")
    }
}
document.getElementById('mutechat').addEventListener('change', handleMuteChat);

function handleLoogSong() {
    loopSong = this.checked;
    console.log("loop song status", loopSong);
}
document.getElementById('loopsong').addEventListener('change', handleLoogSong);

function handleSongSelection() {
    let pressedOnStatus = this.checked ? "opened" : "closed";
    console.log("selection song menu status", pressedOnStatus);
}

document.addEventListener("keydown", (event) => {
    let key = event.key.toLowerCase();
    if (key == "p") {
        let modMenu = $(".modmenu");
        modMenu.toggle('fade-out'); //adds cool fade-out
    }
});
