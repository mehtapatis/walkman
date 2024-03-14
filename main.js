/* Elementlere ulasmak */

const prevButton = document.getElementById('prev')
const nextButton = document.getElementById('next')
const repeatButton = document.getElementById('repeat')
const shuffleButton = document.getElementById('shuffle')
const audio = document.getElementById('audio')
const songImage = document.getElementById('song-image')
const songName = document.getElementById('song-name')
const songArtist = document.getElementById('song-artist')
const pauseButton = document.getElementById('pause')
const playButton = document.getElementById('play')
const playListButton = document.getElementById('playlist')

const maxDuration = document.getElementById('max-duration')
const currentTimeRef = document.getElementById('current-time')

const progressBar = document.getElementById('progress-bar')
const playListContainer = document.getElementById('playlist-container')
const closeButton= document.getElementById('close-button')
const playListSongs = document.getElementById('playlist-songs')

const currentProgress = document.getElementById('current-progress')

//sira
let index = 4

//dongu
let loop = true
 

//json verisi
const songsList = [
    {
        name: "Gelo Ew Ki Bu",
        link: "assets/gelo-ew-ki-bu.mp3",
        artist: "Aram Tigran",
        image: "assets/aram-tigran.jpeg"
    },
    {
        name: "Gitme Kal",
        link: "assets/yara-bere-icindeyim.mp3",
        artist: "Hira-i Zerdust",
        image: "assets/hirai.jpeg"
    },
    {
        name: "Aramam",
        link: "assets/aramam.mp3",
        artist: "Ibrahim Tatlises",
        image: "assets/ibrahim-tatlises.jpeg"
    },
    {
        name: "Ax Eman",
        link: "assets/ax-eman.mp3",
        artist: "Rewsan Celiker",
        image: "assets/rewsan-celiker.jpeg"
    },
    {
        name: "Dinle",
        link: "assets/dinle.mp3",
        artist: "Mahsun Kirmizigul",
        image: "assets/mahsun.jpeg"
    }
]

//oynat
const playAudio = () =>{
    audio.play()
    pauseButton.classList.remove('hide') //göster
    playButton.classList.add('hide') //gizle
}

//durdur
const pauseAudio = () =>{
    audio.pause()
    pauseButton.classList.add('hide')
    playButton.classList.remove('hide')
}

//şarkı ata
const setSong = (arrayIndex) =>{
    let {name, link, artist, image} = songsList[arrayIndex]
    audio.src = link
    songName.innerHTML = name
    songArtist.innerHTML = artist
    songImage.src = image
}

audio.onloadedmetadata = () =>{
    //saniye hesapla
    maxDuration.innerText = timeFormatter(audio.duration)
}

playListContainer.classList.add('hide') 
playAudio()

//sürekli saniye kontrolü
setInterval(() =>{
    currentTimeRef.innerHTML = timeFormatter(audio.currentTime)
    currentProgress.style.width = (audio.currentTime / audio.duration.toFixed(3)) *100 + "%"
},1000)

//şarkı süresi değişim kısmı tıklanıldığında
progressBar.addEventListener('click',(event) =>{

    //başlangıç
    let coordStart = progressBar.getBoundingClientRect().left
    console.log(coordStart)

    // x ekseninde tıklama noktası
    let coordEnd = event.clientX
    console.log(coordEnd)
    console.log(progressBar.offsetWidth)

    // yüzdelik hesaplama yap
    let progress = (coordEnd -coordStart) / progressBar.offsetWidth
    console.log(progress)

    //progresi ilerlet
    currentProgress.style.width = progress * 100 + "%"

    //sesin süresini değiştir
    audio.currentTime = progress * audio.duration

    audio.play()
    pauseButton.classList.remove('hide')
    playButton.classList.add('hide')
})

const timeFormatter = (timeInput) =>{
    let minute = Math.floor(timeInput / 60)
    minute = minute < 10 ? "0"+minute : minute
    let second = Math.floor(timeInput % 60)
    second = second < 10 ? "0"+second : second
    return `${minute}:${second}`
}

const previousSong = () =>{
    if (index > 0){
        pauseAudio()
        index = index - 1
    }else{
        index = songsList.length -1
    }
    setSong(index)
}

const nextSong = () =>{
    if (loop){
        if (index == (songsList.length -1)) {
            index = 0
        }else{
            index = index + 1
        }
        setSong(index)
    }else{
        let randIndex = Math.floor(Math.random() * songsList.length)
        setSong(randIndex)
    }
}

//tekrar butonuna tıklanıldığında
repeatButton.addEventListener('click', ()=>{
    if (repeatButton.classList.contains('active')) {
        repeatButton.classList.remove('active')
        audio.loop = false 
    }else{
        repeatButton.classList.add('active')
        audio.loop = true
    }
})

//karıştırıcı tıklandığında
shuffleButton.addEventListener('click',()=>{
    if (shuffleButton.classList.contains('active')) {
        shuffleButton.classList.remove('active')
        audio.loop = true 
    }else{
        shuffleButton.classList.add('active')
        audio.loop = false
    }
})

//şarkı bittiğinde
audio.onended = () =>{
    nextSong() //sonraki şarkı çağırma
}

playListButton.addEventListener('click', ()=>{
    playListContainer.classList.remove('hide')
})

closeButton.addEventListener('click',()=>{
    playListContainer.classList.add('hide')
})

//oynat butonuna tıklanıldığında
playButton.addEventListener('click', playAudio)

//durdur butonuna tıklanıldığında
pauseButton.addEventListener('click', pauseAudio)

//önceki tıklanıldığında
prevButton.addEventListener('click', previousSong)

//sonraki tıklanıldığında
nextButton.addEventListener('click', nextSong)

const initializePlaylist = () =>{
    for(let i in songsList){
        playListSongs.innerHTML += `<li class="playlistSong"
        onclick="setSong(${i})">
        <div class="playlist-image-container">
         <img src="${songsList[i].image}"/>
        </div>
        <div class="playlist-song-details">
         <span id="playlist-song-name">
          ${songsList[i].name}
         </span>
         <span id="playlist-song-artist-album">
         ${songsList[i].artist}
         </span>
        </div>
       </li>
       `
    }
}

window.onload = () => {
    index = 0
    setSong(index)
    pauseAudio()
    initializePlaylist()
}