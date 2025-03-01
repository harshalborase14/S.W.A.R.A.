//elements

const startBtn = document.querySelector("#start");
const stopBtn = document.querySelector("#stop");
const speakBtn = document.querySelector("#speak");

//greets function
function greet() {
    const date = new Date();
    const hour = date.getHours();
    let greet;
    if (hour < 12) {
        greet = "Good Morning";
    } else if (hour < 18) {
        greet = "Good Afternoon";
    } else {
        greet = "Good Evening";
    }
    return greet;
}

// good night function
function goodNight() {
    const date = new Date();
    const hour = date.getHours();
    if (hour >= 22 || hour < 6) {
        return "Good Night";
    }
    else
    {
        return "have a nice day"
    }
}

//weather setup

function weather(location) {
    const weatherCont = document.querySelector(".temp").querySelectorAll("*");
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${location}&appid=48ddfe8c9cf29f95b7d0e54d6e171008`; // Replace YOUR_API_KEY with your actual API key
    const xhr = new XMLHttpRequest();

    xhr.open("GET", url, true);
    xhr.onload = function() {
        if (this.status === 200) {
            let data = JSON.parse(this.responseText);
            weatherCont[0].textContent = `Location: ${data.name}`;
            weatherCont[1].textContent = `Country: ${data.sys.country}`;
            weatherCont[2].textContent = `Weather Type: ${data.weather[0].main}`;
            weatherCont[3].textContent = `Weather Description: ${data.weather[0].description}`;
            weatherCont[4].src = `http://openweathermap.org/img/w/${data.weather[0].icon}.png`;
            weatherCont[5].textContent = `Temperature: ${ktc(data.main.temp)}°C`;
            weatherCont[6].textContent = `Feels Like: ${ktc(data.main.feels_like)}°C`;
            weatherCont[7].textContent = `Minimum Temperature: ${ktc(data.main.temp_min)}°C`;
            weatherCont[8].textContent = `Maximum Temperature: ${ktc(data.main.temp_max)}°C`;
            weatherStatement = `Sir the weather in ${data.name} is ${data.weather[0].description} and the temperature is ${ktc(data.main.temp)} degree celsius`;
        } else if (this.status === 401) {
            weatherCont[0].textContent = "Invalid API key";
            readOut("Invalid API key. Please check your API key.");
        } else {
            weatherCont[0].textContent = "Weather data not found";
        }
    };
    xhr.send();
}

function ktc(k) {
    return Math.floor(k - 273.15);
}

// Function to fetch news headlines
async function getNewsHeadlines() {
    const apiKey = "242312338c1a4a8383605999653e4cf5";
    const url = `https://newsapi.org/v2/top-headlines?country=in&apiKey=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.status === "ok") {
            let headlines = data.articles.slice(0, 5).map(article => article.title).join(". ");
            readOut(`Here are the top news headlines: ${headlines}`);
        } else {
            readOut("Sorry, I couldn't fetch the news at the moment.");
        }
    } catch (error) {
        console.error("Error fetching news:", error);
        readOut("Sorry, I couldn't fetch the news at the moment.");
    }
}

// Function to tell a Hindi joke
async function tellJoke() {
    try {
        const response = await fetch("https://hindi-jokes-api.onrender.com/jokes?api_key=cc9f2853f6218e4eac7ec8ebdca3"); // Replace with your actual API key
        const data = await response.json();
        readOut(data.jokeContent);
    } catch (error) {
        console.error("Error fetching joke:", error);
        readOut("Sorry, I couldn't fetch a joke at the moment.");
    }
}

// Function to parse and convert voice command time input
function parseTimeInput(timeInput) {
    const now = new Date();
    let alarmTime = new Date(now);

    const timeParts = timeInput.match(/(\d+)(?::(\d\d))?\s*(p?)/);
    if (!timeParts) {
        return null;
    }

    let hours = parseInt(timeParts[1], 10);
    const minutes = parseInt(timeParts[2], 10) || 0;
    const isPM = timeParts[3];

    if (isPM && hours < 12) {
        hours += 12;
    } else if (!isPM && hours === 12) {
        hours = 0;
    }

    alarmTime.setHours(hours);
    alarmTime.setMinutes(minutes);
    alarmTime.setSeconds(0);

    if (timeInput.includes("tomorrow")) {
        alarmTime.setDate(alarmTime.getDate() + 1);
    }

    return alarmTime;
}

// Function to set an alarm
function setAlarm(timeInput) {
    const alarmTime = parseTimeInput(timeInput);
    if (!alarmTime) {
        readOut("Sorry, I couldn't understand the time you provided. Please try again.");
        return;
    }

    const now = new Date();
    const timeToAlarm = alarmTime - now;

    if (timeToAlarm >= 0) {
        setTimeout(() => {
            const alarmSound = new Audio('alarm_sound.mp3');
            alarmSound.play();
            readOut("Sir, your alarm is ringing.");
        }, timeToAlarm);
        readOut(`Alarm set for ${alarmTime.toLocaleTimeString()}`);
    } else {
        readOut("The time you set is in the past. Please set a future time.");
    }
}

// Function to get the meaning of a word
async function getMeaning(word) {
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data[0] && data[0].meanings[0]) {
            const meaning = data[0].meanings[0].definitions[0].definition;
            readOut(`The meaning of ${word} is: ${meaning}`);
        } else {
            readOut("Sorry, I couldn't find the meaning of that word.");
        }
    } catch (error) {
        console.error("Error fetching meaning:", error);
        readOut("Sorry, I couldn't fetch the meaning at the moment.");
    }
}

// Function to translate text to Hindi
async function translateToHindi(text) {
    const url = "https://api.mymemory.translated.net/get?q=" + encodeURIComponent(text) + "&langpair=en|hi";

    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.responseData && data.responseData.translatedText) {
            readOut(`The translation is: ${data.responseData.translatedText}`);
        } else {
            readOut("Sorry, I couldn't translate the text at the moment.");
        }
    } catch (error) {
        console.error("Error translating text:", error);
        readOut("Sorry, I couldn't translate the text at the moment.");
    }
}

// Function to get battery percentage
async function getBatteryPercentage() {
    try {
        const battery = await navigator.getBattery();
        const batteryLevel = Math.floor(battery.level * 100);
        readOut(`Your laptop battery is at ${batteryLevel} percent.`);
    } catch (error) {
        console.error("Error fetching battery percentage:", error);
        readOut("Sorry, I couldn't fetch the battery percentage at the moment.");
    }
}

//jarvis setup
if(localStorage.getItem("jarvis-setup") == null) {
    weather();
}

//jarvis information setup
const setup = document.querySelector(".jarvis-setup");
setup.style.display = "none";
if(localStorage.getItem("jarvis-setup") === null) {
    setup.style.display = "block";
    setup.querySelector("button").addEventListener("click", userInfo);
}

//userinfo function
function userInfo() {
    const startSound = new Audio('start_sound.mp3');
    startSound.play();
    let setupInfo = {
        name: setup.querySelectorAll("input")[0].value,
        dob: setup.querySelectorAll("input")[1].value,
        bio: setup.querySelectorAll("input")[2].value,
        location: setup.querySelectorAll("input")[3].value,
        instagram: setup.querySelectorAll("input")[4].value,
        github: setup.querySelectorAll("input")[5].value,
    };

    let testArray = [];
    setup.querySelectorAll("input").forEach((e) => {
        testArray.push(e.value);
    });

    if (testArray.includes("")) {
        readOut("Sir Kripaya apni puri information bhare");
    } else {
        localStorage.clear();
        localStorage.setItem("jarvis-setup", JSON.stringify(setupInfo));
        setup.style.display = "none";
        readOut("Apni information muze batane ke liye dhanyawad sir");
        weather(JSON.parse(localStorage.getItem("jarvis-setup")).location);
    }
}

//wather call
weather(JSON.parse(localStorage.getItem("jarvis-setup")).location);

//speech recognition setup

const Speechrecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new Speechrecognition();


//Birthday
function isBirthday(dob) {
    const today = new Date();
    const birthDate = new Date(dob);
    return today.getDate() === birthDate.getDate() && today.getMonth() === birthDate.getMonth();
}

//sr start
recognition.onstart = function() {
    const startSound = new Audio('start_sound.mp3');
    startSound.play();

    console.log("We are active now");
};

//sr result
recognition.onresult = function(event) {
    const startSound = new Audio('start_sound.mp3');
    startSound.play();

    let current = event.resultIndex;

    let transcript = event.results[current][0].transcript.toLowerCase();
    
    let userdata = localStorage.getItem("jarvis-setup");

    console.log(`my words : ${transcript}`);
    
    if (transcript.includes("hello.") || transcript.includes("hi.")) {
        // readOut(`Hello ${JSON.parse(userdata).name} Sir,${greet()}`);
        const userData = JSON.parse(userdata);
        let greetingMessage = `Hello ${userData.name}, ${greet()}`;
        if (isBirthday(userData.dob)) {
            greetingMessage += `, Happy Birthday!`;
        }
        readOut(greetingMessage);
        (JSON.parse(userdata).name);
    }
    else if(transcript.includes("wake up"))
    {
        const userData = JSON.parse(userdata);
        readOut(`${greet()} ${userData.name}, I am Online, How can I help you?`);
    }
    else if(transcript.includes("my birthday"))
    {
        const userData = JSON.parse(userdata);
        readOut(`Aapne muze bataya tha, apki Birth date ${userData.dob} hai`);
        if(isBirthday(userData.dob)){
            readOut(`Aur yeh date toh aaj hai, isaka matalab aaj aapka Birthday hai`);
            readOut(`Wish you many many Happy Return of the day ${userData.name}, Aapka Din achha jaye`);
        }
    }
    else if(transcript.includes("what are you doing?"))
    {
        readOut("Nothing, Sirf apke Sawalo ke Jawab de rahi hoo")
    }
    else if(transcript.includes("i am fine.")){
        readOut("That's great, mai bhi thik hoo.");
    }
    else if (transcript.includes("how are you?")) {
        readOut("I am good Sir, aap kaise ho?");
    }
    else if(transcript.includes("okay.") || transcript.includes("ok.")){
        readOut("Okay Sir, Koi aur madad chahiye toh bataiye");
    }
    else if (transcript.includes("what is your name?") || transcript.includes("who are you?")) {
        readOut("मेरा नाम Swara है,मतलब Smart Women AI Responsive Assistant, मै एक speech recognition program हू");
    }
    else if (transcript.includes("kon ho") || transcript.includes("naam kya hai")) {
        readOut("मेरा नाम Swara है,मतलब Smart Women AI Responsive Assistant, मै एक speech recognition program हू");
    }
    else if (transcript.includes("open youtube")) {
        readOut("Youtube Open kar rahi hoo");
        window.open("https://www.youtube.com");
    }
    else if (transcript.includes("open google")) {
        readOut("Google Open kar rahi hoo");
        window.open("https://www.google.com");
    }
    else if (transcript.includes("chatgpt")) {
        readOut("Chat GPT Open kar rahi hoo");
        window.open("https://chatgpt.com");
    }
    else if (transcript.includes("open whatsapp")) {
        readOut("whatsapp Open kar rahi hoo");
        window.open("https://web.whatsapp.com");
    }
    else if (transcript.includes("open instagram")) {
        readOut("Instagram Open kar rhi hoo");
        window.open("https://www.instagram.com");
    }
    else if (transcript.includes("open github.")) {
        readOut("Github Open kar rahi hoo");
        window.open("https://www.github.com");
    }
    else if (transcript.includes("open my github profile.")) {
        readOut("apki Github profile Open kar rahi hoo");
        window.open(`https://www.github.com/${JSON.parse(userdata).github}`);
    }
    else if (transcript.includes("open facebook.")) {
        readOut("facebook open kar rhi hoo sir");
        window.open("https://www.facebook.com");
    }
    else if (transcript.includes("open amazone.")) {
        readOut("amazone open kar rhi hoo sir");
        window.open("https://www.amazone.in");
    }
    else if (transcript.includes("open flipkart.")) {
        readOut("flipkart open kar rhi hoo sir");
        window.open("https://www.flipkart.com");
    }
    else if (transcript.includes("ip address.") || transcript.includes("what is ypur ip address?")) {
        fetch('https://api.ipify.org?format=json').then(response => response.json()).then(data => {
        console.log(`My IP address is: ${data.ip}`);
        readOut(`My IP address is: ${data.ip}`);
        }).catch(error => {
            console.error('Error fetching IP address:', error);
        });
    }
    else if (transcript.includes("open twitter")) {
        readOut("Twitter Open kar rahi hoo");
        window.open("https://www.twitter.com");
    }
    else if (transcript.includes("open linkedin")) {
        readOut("LinkedIn Open kar rahi hoo");
        window.open("https://www.linkedin.com");
    }

    //goggle search
    else if (transcript.includes("search for")) {
        let search = transcript.split("search for");
        readOut(`here's the result for ${search[1]}`);
        window.open(`https://www.google.com/search?q=${search[1]}`);
    }
    //wiki search
    else if (transcript.includes("what is")) {
        let search = transcript.split("what is");
        readOut(`here's the result for ${search[1]}`);
        window.open(`https://en.wikipedia.org/wiki/${search[1]}`);
    }
    //who is
    else if (transcript.includes("who is")) {
        let search = transcript.split("who is");
        readOut(`here's the result for ${search[1]}`);
        window.open(`https://en.wikipedia.org/wiki/${search[1]}`);
    }
    //time
    else if (transcript.includes("time")) {
        const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true});
        readOut(`${time} ho rahe hai`);
    }
    //date
    else if (transcript.includes("date") || transcript.includes("taarikh")) {
        const options = { day: '2-digit', month: 'long', year: 'numeric' }; // Example: 12 February 2025
        const date = new Date().toLocaleDateString('en-IN', options);
        readOut(`Aaj ki taarikh ${date}`);
    }    
    //day
    else if (transcript.includes("day")) {
        const day = new Date().toLocaleDateString('en', { weekday: 'long' });
        readOut(`Aaj ${day} hai`);
    }
    //youtube search
    else if (transcript.includes("search on youtube")) {
        let search = transcript.split("search on youtube");
        readOut(`here's the result for ${search[1]}`);
        window.open(`https://www.youtube.com/results?search_query=${search[1]}`);
    }
    //play on youtube
    else if (transcript.includes("play")) {
        let search = transcript.split("play");
        readOut(`Searching on youtube ${search[1]}`);
        window.open(`https://www.youtube.com/results?search_query=${search[1]}`);
    }
    else if (transcript.includes("open notepad")) {
        readOut("Opening Notepad Sir");
        fetch('/open-notepad')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    readOut("Notepad opened successfully.");
                } else {
                    readOut("Sorry, I couldn't open Notepad.");
                }
            })
            .catch(error => {
                console.error('Error opening Notepad:', error);
                readOut("Sorry, I couldn't open Notepad.");
            });
    }
    else if(transcript.includes("khanna") || transcript.includes("khana")){
        readOut("Khane ke liye puchhne ke liye dhanyawad, lekin Mujhe maf karna, Mai ek speech recognition program hoo, mai khana nahi kha sakti");
    }
    else if(transcript.includes("kaise ho") || transcript.includes("kaisi ho")){
        readOut("Mai thik hoo, aap kaise ho?");
    }
    else if(transcript.includes("kya kar rahi ho") || transcript.includes("kya kar raha hai")){
        readOut("Mai aapki madad kar rahi hoo, aap kaise madad chahiye?");
    }
    else if(transcript.includes("kya kar sakti ho") || transcript.includes("kya kar sakti hai")){
        readOut("Mai aapki madad kar sakti hoo, aap kaise madad chahiye?");
    }
    else if(transcript.includes("tell me about you.") || transcript.includes("tell me about yourself."))
    {
        // readOut("mera naam Smart Women AI Responsive Assistant मतलब Swara hai, mai aapki madad karne ke liye bani hoo, muze Harshal Borase इंन्होने banaya hai, mai aapko kuch bhi bata sakti hoo, aap mujhse kuch bhi puch sakte hain");
        readOut("mera नाम Swara है,Swara ka मतलब Smart Women AI Responsive Assistant, isaka Short Form, S,W,A,R,A, मतलब Swara aisa hai, Muze harshal Borase इन्होने banaya hai, mai aapki madad karne ke liye bani hoo, mai aapko kuch bhi bata sakti hoo, aap mujhse kuch bhi puch sakte hain");
    }
    // clear local storage
    else if(transcript.includes("forget me")){
        localStorage.clear();
        readOut("Okay Sir");
        readOut("Aapki information delete kar di gayi hai");
    }
    //refresh
    else if(transcript.includes("refresh") /*|| transcript.includes("form")*/){
        location.reload();
    }
    //your fav song
    else if(transcript.includes("favorite music?"))
    {
        const song = new Audio("favsong.mp3");
        song.play();
    }
    //show local storage data
    else if (transcript.includes("my data")) {
        let localStorageData = localStorage.getItem("jarvis-setup");
        if (localStorageData) {
            let parsedData = JSON.parse(localStorageData);
            let dataString = `Name: ${parsedData.name},Janma din:${parsedData.dob}, Bio: ${parsedData.bio}, Location: ${parsedData.location}, Instagram: ${parsedData.instagram}, GitHub: ${parsedData.github}`;
            readOut("ji haa mere paas apki information hai,jo aapne muze di thi")
            readOut(`wo information hai ${dataString}`);
            console.log(`Local Storage Data: ${dataString}`);
        } else {
            readOut("I'm Sorry,mai nhi bata sakti,mere paas apka koi data nhi hai, kripaya apne information provide kare");
        }
    }
    //who is me
    else if (transcript.includes("tell me about me")) {
        let localStorageData = localStorage.getItem("jarvis-setup");
        if (localStorageData) {
            let parsedData = JSON.parse(localStorageData);
            readOut("Ji haa merepaas aapki information hai jo aapne muze di thi");
            readOut("Mai aapko batatati hoo");
            readOut(`आप मेरे boss ${parsedData.name} ho,Apka janma ${parsedData.dob} ko hua hai,aap ek ${parsedData.bio} ho,aap ${parsedData.location} sheher mai rehte ho, aur aapka instagram ${parsedData.instagram} hai`);
        } else {
            readOut("Muze apke baare me kuch nahi pata, please apni information provide kare");
        }
    }
    else if (transcript.includes("thank you")) {
        readOut("Welcome Sir, Koi aur madad chahiye toh bataiye");
    }
    else if(transcript.includes("weather")){
        readOut(weather(JSON.parse(localStorage.getItem("jarvis-setup")).location));
    }
    else if(transcript.includes("bye") || transcript.includes("shut down")) {
        readOut(`Okay sir, bye,${goodNight()}, Shutting down my program`);
        readOut("Agar aapko फिरसे meri jaroorat ho toh mera program run kijiye")
        recognition.stop();
    }
    // New commands
    else if (transcript.includes("news")) {
        readOut("Fetching the latest news headlines.");
        getNewsHeadlines();
    } 
    else if (transcript.includes("tell me a joke")) {
        readOut("Sure, here's a joke for you.");
        tellJoke();
    }
    else if (transcript.includes("set alarm for")) {
        let timeInput = transcript.split("set alarm for")[1].trim();
        setAlarm(timeInput);
    }
    else if (transcript.includes("meaning of")) {
        let word = transcript.split("meaning of")[1].trim();
        getMeaning(word);
    }
    else if (transcript.includes("translate to hindi")) {
        let text = transcript.split("translate to hindi")[1].trim();
        translateToHindi(text);
    }
    else if (transcript.includes("battery percentage")) {
        getBatteryPercentage();
    }
    else if (transcript.includes("shutdown")) {
        readOut("Okay Sir,Shutting down my self.");
        recognition.stop();
    }
    else if(transcript.includes("your birthday"))
    {
        readOut("My birthday is 1 February");
    }
    else if(transcript.includes(""))
    {
        readOut("");
    } 
    else 
    {
        let aiResponses = [
            "Mujhe samajh nahi aya, lekin mai seekhne ki koshish karungi!",
            "Ye command thoda naya lag raha hai, mai jaanne ki koshish kar rahi hoon!",
            "Main samajh nahi pai, lekin kya aap iske baare mein mujhe bata sakte ho?",
            "Kya aap mujhe aur detail de sakte ho? Shayad tab mai help kar paun!",
            "Hmm, mujhe ye nahi pata lekin mai try kar sakti hoon! Ek second...",
            "Aapki baat samajh nahi aayi, lekin mai seekhne ki koshish karungi!",
            "Is command ko samajhne mein thoda waqt lagega, lekin mai try karungi!",
            "Mujhe lagta hai ye command naya hai, mai iske baare mein jaanne ki koshish karungi!",
            "Main is command ko samajh nahi pai, lekin aap mujhe aur detail de sakte hain?",
            "Hmm, ye command thoda alag lag raha hai, mai try karungi!"
        ];

        let randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
        readOut(randomResponse); 

        // AI-based correction system
        let possibleCommands = {
            "youtube": "Aap kya YouTube open karna chah rahe the?",
            "weather": "Aapko weather ka update chahiye kya?",
            "date": "Aap date pooch rahe the?",
            "google": "Aapko Google pe kuch search karna hai?",
            "who is": "Aap kisi insaan ke baare mein jaan'na chah rahe hain kya?",
            "time": "Aapko waqt ka pata karna hai kya?"
        };

        for (let keyword in possibleCommands) {
            if (transcript.includes(keyword)) {
                readOut(possibleCommands[keyword]);
                break;
            }
        }

        // Store unknown command for learning
        let unknownCommands = JSON.parse(localStorage.getItem("unknownCommands")) || [];
        unknownCommands.push(transcript);
        localStorage.setItem("unknownCommands", JSON.stringify(unknownCommands));

        console.log(`Unknown command stored: ${transcript}`);

        readOut("I am Sorry, Filhal main bann rahi hoon, kripya thoda samay dejiye, kyuki kuchh hi commands mujhme manually program kiye gaye hai, Filhal mai AI nahi hoon, lekin muze AI Banane ki koshish jaaari hai");
    }
    
};

//sr end
recognition.onend = function() {
    console.log("We are inactive now");
};

//sr continous
recognition.continuous = true;

startBtn.addEventListener("click", () => {
    recognition.start();
});

stopBtn.addEventListener("click", () => {
    recognition.stop();
});

//jarvis speech
function readOut(message) {
    const speech = new SpeechSynthesisUtterance();
    //diff voices
    const allVoices = speechSynthesis.getVoices();
    speech.text = message;
    speech.voice = allVoices[10];
    //speech.voice = allVoices[167]; //hindi swara
    // speech.voice = allVoices[211]; //marathi arohi
    speech.volume = 1;
    speech.rate = 1.1;

    window.speechSynthesis.speak(speech);

    console.log("Speaking out");
}

//example

speakBtn.addEventListener("click", () => {
    const startSound = new Audio('start_sound.mp3');
    startSound.play();
    readOut("Hellow World, I am Smart Women AI Responsive Assistant, Swara, by Harshal Borase, I am here to help you with your queries, please feel free to ask me anything.");
});

// Check if the page is reloaded
if (performance.navigation.type === 1) {
    // If the page is reloaded, redirect to another page
    const startSound = new Audio('start_sound.mp3');
    startSound.play();
    readOut(" ");
}

// window.onload = function() {
//     const startSound = new Audio('start_sound.mp3');
//     startSound.play();
//     readOut("    ");
// }
