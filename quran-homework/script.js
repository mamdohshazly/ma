const surahNames = ["","Al-Fatiha","Al-Baqara","Aali Imran","An-Nisa","Al-Ma'ida","Al-An'am","Al-A'raf","Al-Anfal","At-Tawba","Yunus","Hud","Yusuf","Ar-Ra'd","Ibrahim","Al-Hijr","An-Nahl","Al-Isra","Al-Kahf","Maryam","Ta-Ha","Al-Anbiya","Al-Hajj","Al-Mu'minun","An-Nur","Al-Furqan","Ash-Shu'ara","An-Naml","Al-Qasas","Al-Ankabut","Ar-Rum","Luqman","As-Sajda","Al-Ahzab","Saba","Fatir","Ya-Sin","As-Saffat","Sad","Az-Zumar","Ghafir","Fussilat","Ash-Shura","Az-Zukhruf","Ad-Dukhan","Al-Jathiya","Al-Ahqaf","Muhammad","Al-Fath","Al-Hujurat","Qaf","Adh-Dhariyat","At-Tur","An-Najm","Al-Qamar","Ar-Rahman","Al-Waqia","Al-Hadid","Al-Mujadila","Al-Hashr","Al-Mumtahina","As-Saff","Al-Jumua","Al-Munafiqun","At-Taghabun","At-Talaq","At-Tahrim","Al-Mulk","Al-Qalam","Al-Haqqa","Al-Ma'arij","Nuh","Al-Jinn","Al-Muzzammil","Al-Muddathir","Al-Qiyama","Al-Insan","Al-Mursalat","An-Naba","An-Nazi'at","Abasa","At-Takwir","Al-Infitar","Al-Mutaffifin","Al-Inshiqaq","Al-Buruj","At-Tariq","Al-A'la","Al-Ghashiya","Al-Fajr","Al-Balad","Ash-Shams","Al-Lail","Ad-Duha","Ash-Sharh","At-Tin","Al-'Alaq","Al-Qadr","Al-Bayyina","Az-Zalzala","Al-Adiyat","Al-Qari'a","At-Takathur","Al-Asr","Al-Humaza","Al-Fil","Quraish","Al-Ma'un","Al-Kawthar","Al-Kafirun","An-Nasr","Al-Masad","Al-Ikhlas","Al-Falaq","An-Nas"];
const surahAyahCounts = [0,7,286,200,176,120,165,206,75,129,109,123,111,43,52,99,128,111,110,98,135,112,78,118,64,77,227,93,88,69,60,34,30,73,54,45,83,182,88,75,85,54,53,89,59,37,35,38,29,18,45,60,49,62,55,78,96,29,22,24,13,14,11,11,18,12,12,30,52,52,44,28,28,20,56,40,31,50,40,46,42,29,19,36,25,22,17,19,26,30,20,15,21,11,8,8,19,5,8,8,11,11,8,3,9,5,4,7,3,6];

const surahSelect = document.getElementById('surahSelect');
surahNames.forEach((name, index) => {
  if (index === 0) return;
  const opt = document.createElement('option');
  opt.value = index;
  opt.textContent = `${index}. ${name}`;
  surahSelect.appendChild(opt);
});

const fromAyahInput = document.getElementById('fromAyah');
const toAyahInput = document.getElementById('toAyah');
const loadAyahsBtn = document.getElementById('loadAyahs');
const ayahsDiv = document.getElementById('ayahs');
const audioPlayer = document.getElementById('mainPlayer');

const partLinks = [
  "https://archive.org/download/1-6-quran-6236-ayah-by--alhosary--morattal---part1",
  "https://archive.org/download/2-6-quran-6236-ayah-by--alhosary--morattal---part2",
  "https://archive.org/download/3-6-quran-6236-ayah-by--alhosary--morattal---part3",
  "https://archive.org/download/4-6-quran-6236-ayah-by--alhosary--morattal---part4",
  "https://archive.org/download/ayaat-koran-5-6-quran-6236-ayah-by--alhosary--morattal____part5",
  "https://archive.org/download/6-6-quran-6236-ayah-by--alhosary--morattal---part6"
];
const partStarts = [1, 1048, 2055, 3111, 4154, 5253];

let ayahTexts = {};
fetch('ayahTexts.json').then(res => res.json()).then(data => ayahTexts = data);

function getPartIndex(globalID) {
  for (let i = partStarts.length - 1; i >= 0; i--) {
    if (globalID >= partStarts[i]) return i;
  }
  return 0;
}

const recorderBar = document.getElementById('recorderBar');

loadAyahsBtn.onclick = () => {
  const surahId = parseInt(surahSelect.value);
  const from = parseInt(fromAyahInput.value);
  const to = parseInt(toAyahInput.value);

  if (!surahId || !from || !to || from > to || to > surahAyahCounts[surahId]) {
    alert('Please enter valid values.');
    return;
  }

  ayahsDiv.innerHTML = '';

  for (let i = from; i <= to; i++) {
    let globalCounter = surahAyahCounts.slice(1, surahId).reduce((a, b) => a + b, 0) + i;
    const surahNum = String(surahId).padStart(3, '0');
    const ayahNum = String(i).padStart(3, '0');
    const fileName = `${surahNum}${ayahNum}.mp3`;
    const partIndex = getPartIndex(globalCounter);
    const audioUrl = `${partLinks[partIndex]}/${fileName}`;

    const div = document.createElement('div');
    div.className = 'ayah';

    const text = ayahTexts[`${surahId}:${i}`]?.text || `Ayah ${i}`;
    const span = document.createElement('span');
    span.textContent = `[${i}] ${text}`;

    const controls = document.createElement('div');
    controls.className = 'controls';

    const playBtn = document.createElement('button');
    playBtn.innerHTML = `<svg width="20" height="20" fill="blue" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg> Play`;
    playBtn.onclick = () => {
      audioPlayer.src = audioUrl;
      audioPlayer.play();
      positionRecorder(div);
    };

    const pauseBtn = document.createElement('button');
    pauseBtn.innerHTML = `<svg width="20" height="20" fill="blue" viewBox="0 0 24 24"><path d="M6 19h4V5H6zm8-14v14h4V5h-4z"/></svg> Pause`;
    pauseBtn.onclick = () => {
      if (audioPlayer.paused) audioPlayer.play();
      else audioPlayer.pause();
    };

    const stopBtn = document.createElement('button');
    stopBtn.innerHTML = `<svg width="20" height="20" fill="blue" viewBox="0 0 24 24"><path d="M6 6h12v12H6z"/></svg> Stop`;
    stopBtn.onclick = () => {
      audioPlayer.pause();
      audioPlayer.currentTime = 0;
    };

    const backBtn = document.createElement('button');
    backBtn.innerHTML = `<svg width="20" height="20" fill="blue" viewBox="0 0 24 24"><path d="M11 19V5l-7 7zm10 0V5l-7 7z"/></svg> -5s`;
    backBtn.onclick = () => {
      audioPlayer.currentTime = Math.max(0, audioPlayer.currentTime - 5);
    };

    const fwdBtn = document.createElement('button');
    fwdBtn.innerHTML = `<svg width="20" height="20" fill="blue" viewBox="0 0 24 24"><path d="M13 5v14l7-7zm-10 0v14l7-7z"/></svg> +5s`;
    fwdBtn.onclick = () => {
      audioPlayer.currentTime = Math.min(audioPlayer.duration, audioPlayer.currentTime + 5);
    };

    [playBtn, pauseBtn, stopBtn, backBtn, fwdBtn].forEach(b => controls.appendChild(b));
    div.appendChild(span);
    div.appendChild(controls);
    ayahsDiv.appendChild(div);
  }
};

function positionRecorder(ayahDiv) {
  const rect = ayahDiv.getBoundingClientRect();
  recorderBar.style.top = (window.scrollY + rect.top - recorderBar.offsetHeight - 10) + 'px';
  recorderBar.style.left = (window.scrollX + rect.left + 20) + 'px';
}

function setMode(mode) {
  document.body.classList.toggle('dark-mode', mode === 'dark');
}

const startRec = document.getElementById('startRec');
const pauseRec = document.getElementById('pauseRec');
const stopRec = document.getElementById('stopRec');
const progress = document.getElementById('recProgress');
const recordedAudio = document.getElementById('recordedAudio');

let mediaRecorder, recordedChunks = [], stream, timer, duration = 0;

async function initRec() {
  stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  mediaRecorder = new MediaRecorder(stream);
  mediaRecorder.ondataavailable = e => recordedChunks.push(e.data);
  mediaRecorder.onstop = () => {
    const blob = new Blob(recordedChunks, { type: 'audio/webm' });
    recordedAudio.src = URL.createObjectURL(blob);
    recordedAudio.style.display = 'block';
    clearInterval(timer);
    progress.style.width = '0%';
    startRec.classList.remove('recording');
  };
}

startRec.onclick = async () => {
  if (!mediaRecorder || mediaRecorder.state === 'inactive') {
    recordedChunks = [];
    await initRec();
    mediaRecorder.start();
    duration = 0;
    timer = setInterval(() => {
      duration++;
      progress.style.width = Math.min(duration * 2, 100) + '%';
    }, 1000);
    startRec.classList.add('recording');
  } else if (mediaRecorder.state === 'paused') {
    mediaRecorder.resume();
    startRec.classList.add('recording');
    timer = setInterval(() => {
      duration++;
      progress.style.width = Math.min(duration * 2, 100) + '%';
    }, 1000);
  }
  startRec.disabled = true;
  pauseRec.disabled = false;
  stopRec.disabled = false;
};

pauseRec.onclick = () => {
  if (mediaRecorder.state === 'recording') {
    mediaRecorder.pause();
    clearInterval(timer);
    startRec.classList.remove('recording');
  } else if (mediaRecorder.state === 'paused') {
    mediaRecorder.resume();
    startRec.classList.add('recording');
    timer = setInterval(() => {
      duration++;
      progress.style.width = Math.min(duration * 2, 100) + '%';
    }, 1000);
  }
};

stopRec.onclick = () => {
  mediaRecorder.stop();
  startRec.disabled = false;
  pauseRec.disabled = true;
  stopRec.disabled = true;
};
