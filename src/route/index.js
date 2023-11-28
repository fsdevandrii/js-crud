// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================
class Track {
  static #list = []

  constructor(name, author, image) {
    this.id = Math.floor(1000 + Math.random() * 9000) // Генеруємо випадкове ID
    this.name = name
    this.author = author
    this.image = image
  }

  // Статичний метод для створення об'єкту Track і додавання його до списку #list
  static create(name, author, image) {
    const newTrack = new Track(name, author, image)
    this.#list.push(newTrack)
    return newTrack
  }

  // Статичний метод для отримання всього списку треків
  static genList() {
    return this.#list.reverse()
  }
}

Track.create(
  'Інь Янь',
  'MONATIK i ROXOLANA',
  'https://picsum.photos/100/100',
)
Track.create(
  'Baila Conmigo (Remix)',
  'Selena Gomis i Rauw Alejandro',
  'https://picsum.photos/100/100',
)
Track.create(
  'Shameless',
  'Camila Cabello',
  'https://picsum.photos/100/100',
)
Track.create(
  'DACITI',
  'BAD BUNNY i JHAY',
  'https://picsum.photos/100/100',
)
Track.create(
  '11 PM',
  'Maluma',
  'https://picsum.photos/100/100',
)
Track.create(
  'Інша любов',
  'Enleo',
  'https://picsum.photos/100/100',
)

console.log(Track.genList())

class playList {
  // Статичне приватне поле для зберігання списку об'єктів Playlist
  static #list = []

  constructor(name) {
    this.id = Math.floor(1000 + Math.random() * 9000) // Генеруємо випадкове ID
    this.name = name
    this.track = []
  }

  // Статичний метод для створення об'єкту playList і додання до нього списку #list
  static create(name) {
    const newPlayList = new PlayList(name)
    this.#list.push(newPlayList)
    return newPlayList
  }

  // Статичний метод для отримання всього списку плейлистів
  static getList() {
    return this.#list.reverse()
  }

  static makeMix(playList) {
    const allTracks = Track.getList()

    let randomTracks = allTracks
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
    playList.tracks.push(...randomTracks)
  }
}

// ================================================================
router.get('/', function (req, res) {
  // res.render генерує нам HTML сторінку
  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('spotify-choose', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'spotify-choose',
    // data: {},
  })
  // ↑↑ сюди вводимо JSON дані
})
// ================================================================
router.get('/spotify-create', function (req, res) {
  const isMix = !!req.query.isMix
  console.log(isMix)
  // res.render генерує нам HTML сторінку
  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('spotify-create', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'spotify-create',
    data: {
      isMix,
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================
router.post('/spotify-create', function (req, res) {
  const isMix = !!req.query.isMix
  const name = req.body.name

  if (!name) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Введіть назву плейліста',
        link: isMix
          ? '/spotify-create?isMix=true'
          : '/spotify-create',
      },
    })
  }

  const playList = Playlist.create(name)

  if (isMix) {
    Playlist.makeMix(playList)
  }

  console.log(playList)

  res.render('spotify-create', {
    style: 'spotify-create',
    data: {},
  })

  // ↑↑ сюди вводимо JSON дані
})
// ================================================================
// Підключаємо роутер до бек-енду
module.exports = router
