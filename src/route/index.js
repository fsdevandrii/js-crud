// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================
class Product {
  static #list = []

  static #count = 0

  constructor(
    img,
    title,
    description,
    category,
    price,
    amount = 0,
  ) {
    this.id = ++Product.#count // Генеруємо уникальный ID для товару
    this.img = img
    this.title = title
    this.description = description
    this.category = category
    this.price = price
    this.amount = amount
  }

  static add = (...data) => {
    const newProduct = new Product(...data)

    this.#list.push(newProduct)
  }

  static getList = () => {
    return this.#list
  }

  static getById = (id) => {
    return this.#list.find((product) => product.id === id)
  }

  static getRandomList = (id) => {
    // Фильтруемо товары щоб илучити той, з яким порівнюємо ID
    const filteredList = this.#list.filter(
      (product) => product.id !== id,
    )

    // Відсортуємо за допомогою Math.random() та перекмішаємо масив
    const shuffledList = filteredList.sort(
      () => Math.random() - 0.5,
    )
    // Повертаємо перші три елементи з перемішаного масиву
    return shuffledList.slice(0, 3)
  }
}

Product.add(
  'https://picsum.photos/200/300',
  'Компютер Artline Gaming (X43v31) AMD Ryzen 5 3600/',
  'AMD Ryzen 5 3600 (3.6 - 4.2 ГГц) / RAM 16 ГБ / HDD 1 ТБ + SSD 480 ГБ / nVidia GeForce RTX 3050, 8 ГБ / без ОД / LAN / без ОС',
  [
    { id: 1, text: 'Готовий до відправки' },
    { id: 2, text: 'Топ продажів' },
  ],
  27000,
  10,
)

Product.add(
  'https://picsum.photos/200/300',
  'Компютер Artline Gaming (X43v31) AMD Ryzen 5 3600/',
  'AMD Ryzen 5 3600 (3.6 - 4.2 ГГц) / RAM 16 ГБ / HDD 1 ТБ + SSD 480 ГБ / nVidia GeForce RTX 3050, 8 ГБ / без ОД / LAN / без ОС',
  [{ id: 2, text: 'Топ продажів' }],
  20000,
  10,
)

Product.add(
  'https://picsum.photos/200/300',
  'Компютер Artline Gaming (X43v31) AMD Ryzen 5 3600/',
  'AMD Ryzen 5 3600 (3.6 - 4.2 ГГц) / RAM 16 ГБ / HDD 1 ТБ + SSD 480 ГБ / nVidia GeForce RTX 3050, 8 ГБ / без ОД / LAN / без ОС',
  [{ id: 1, text: 'Готовий до відправки' }],
  40000,
  10,
)

class Purchase {
  static DELIVERY_PRICE = 150
  static #BONUS_FACTOR = 0.1

  static #count = 0
  static #list = []

  static #bonusAccount = new Map()

  static getBonusBalance = (email) => {
    return Purchase.#bonusAccount.get(email) || 0
  }

  static updateBonusBalance = (
    email,
    price,
    bonusUse = 0,
  ) => {
    const amount = price * Purchase.#BONUS_FACTOR

    const currentBalance = Purchase.getBonusBalance(email)

    const updateBalance = currentBalance + amount - bonusUse

    Purchase.#bonusAccount.set(email, updateBalance)

    console.log(email, updateBalance)

    return amount
  }

  constructor(data, product) {
    this.id = ++Purchase.#count

    this.firstname = data.firstname
    this.lastname = data.lastname

    this.phone = data.phone
    this.email = data.email

    this.comment = data.comment || null

    this.bonus = data.bonus || 0

    this.promocode = data.promocode || null

    this.totalPrice = data.totalPrice
    this.productPrice = data.productPrice
    this.deliveryPrice = data.deliveryPrice
    this.amount = data.amount

    this.product = product
  }

  static add = (...arg) => {
    const newPurchase = new Purchase(...arg)

    this.#list.push(newPurchase)

    return newPurchase
  }

  static getList = () => {
    return Purchase.#list.reverse()
  }

  static getById = (id) => {
    return Purchase.#list.find((item) => item.id === id)
  }

  static updateById = (id, data) => {
    const purchase = Purchase.getById(id)

    if (purchase) {
      if (data.firstname)
        purchase.firstname = data.firstname
      if (data.lastname) purchase.lastname = data.lastname
      if (data.phone) purchase.phohe = data.phone
      if (data.email) purchase.email = data.email

      return true
    } else {
      return false
    }
  }
}

class Promocode {
  static #list = []

  constructor(name, factor) {
    this.name = name
    this.factor = factor
  }

  static add = (name, factor) => {
    const newPromocode = new Promocode(name, factor)
    Promocode.#list.push(newPromocode)
    return newPromocode
  }

  static getByName = (name) => {
    return this.#list.find((promo) => promo.name === name)
  }

  static calc = (promo, price) => {
    return price * promo.factor
  }
}

Promocode.add('SUMMER2023', 0.9)
Promocode.add('DISCOUNT50', 0.5)
Promocode.add('SALE25', 0.75)
// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/', function (req, res) {
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('purchase-index', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'purchase-index',

    data: {
      list: Product.getList(),
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/alert', function (req, res) {
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('alert', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'alert',

    data: {
      message: 'Операція успішна',
      info: 'Товар створений',
      link: '/test-path',
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================
router.get('/purchase-product', function (req, res) {
  const id = Number(req.query.id)

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('purchase-product', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'purchase-product',

    data: {
      list: Product.getRandomList(id),
      product: Product.getById(id),
    },
  })
})
// ================================================================

router.post('/purchase-create', function (req, res) {
  // res.render генерує нам HTML сторінку
  const id = Number(req.query.id)
  const amount = Number(req.body.amount)

  if (amount < 1) {
    return res.render('alert', {
      style: 'alert',
      component: ['button', 'heading'],

      data: {
        link: `/purchase-product?id=${id}`,
        message: 'Помилка',
        info: 'Некоректна кількість товару',
      },
    })
  }

  const product = Product.getById(id)

  if (product.amount < 1) {
    return res.render('alert', {
      style: 'alert',
      component: ['button', 'heading'],

      data: {
        link: `/purchase-product?id=${id}`,
        message: 'Помилка',
        info: 'Такої кількості товару немає в намявнсисті',
      },
    })
  }

  console.log(product, amount)

  const productPrice = product.price * amount
  const totalPrice = productPrice + Purchase.DELIVERY_PRICE
  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('purchase-create', {
    style: 'purchase-create',
    component: ['divider', 'field', 'button', 'heading'],

    data: {
      title: 'Ваше замовлення',
      subtitle: 'Оформлення замовлення',
      id: product.id,

      cart: [
        {
          text: `${product.title} (${amount} шт)`,
          price: product.price,
        },
        {
          text: 'Вартість доставки',
          price: Purchase.DELIVERY_PRICE,
        },
      ],
      totalPrice,
      productPrice,
      amount,
      deliveryPrice: Purchase.DELIVERY_PRICE,
    },
  })
  // ↑↑ сюди вводимо JSON дані
})
// ================================================================
router.post('/purchase-submit', function (req, res) {
  // res.render генерує нам HTML сторінку
  // console.log(req.query)
  // console.log(req.body)
  const id = Number(req.query.id)

  let {
    totalPrice,
    productPrice,
    deliveryPrice,
    amount,

    firstname,
    lastname,
    email,
    phone,

    comment,
    delivery,
    promocode,
    bonus,
  } = req.body

  const product = Product.getById(id)

  if (!product) {
    return res.render('alert', {
      style: 'alert',
      component: ['button', 'heading'],

      data: {
        link: '/purchase-list',
        message: 'Помилка',
        info: 'Товар не знайдено',
      },
    })
  }

  if (product.amount < amount) {
    return res.render('alert', {
      style: 'alert',
      component: ['button', 'heading'],
      data: {
        link: '/purchase-list',
        message: 'Помилка',
        info: 'Товару немає в потрібній кількості',
      },
    })
  }
  totalPrice = Number(totalPrice)
  productPrice = Number(productPrice)
  deliveryPrice = Number(deliveryPrice)
  amount = Number(amount)
  if (
    isNaN(totalPrice) ||
    isNaN(productPrice) ||
    isNaN(deliveryPrice) ||
    isNaN(amount)
  ) {
    return res.render('alert', {
      style: 'alert',
      component: ['button', 'heading'],
      data: {
        link: '/purchase-list',
        message: 'Помилка',
        info: 'Некорректні данні',
      },
    })
  }
  if ((!firstname, !lastname, !email, !phone)) {
    return res.render('alert', {
      style: 'alert',
      component: ['button', 'heading'],
      data: {
        link: '/purchase-list',
        message: "Заповніть обов'язкові поля",
        info: 'Некорректні данні',
      },
    })
  }
  if (bonus || bonus > 0) {
    const bonusAmount = Purchase.getBonusBalance(email)
    console.log(bonusAmount)
    if (bonus > bonusAmount) {
      bonus = bonusAmount
    }

    Purchase.updateBonusBalance(email, totalPrice, bonus)

    totalPrice -= bonus
  } else {
    Purchase.updateBonusBalance(email, totalPrice, 0)
  }
  if (promocode) {
    promocode = Promocode.getByName(promocode)

    if (promocode) {
      totalPrice = Promocode.calc(promocode, totalPrice)
    }
  }

  if (totalPrice < 0) totalPrice = 0

  const purchase = Purchase.add(
    {
      totalPrice,
      productPrice,
      deliveryPrice,
      amount,
      firstname,
      lastname,
      email,
      phone,
      promocode,
      bonus,
      comment,
      delivery,
    },
    product,
  )
  console.log(purchase)
  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('alert', {
    style: 'alert',
    component: ['button', 'heading'],
    data: {
      link: '/purchase-list',
      message: 'Успішне виконання дії',
      info: 'Замовлення створене',
    },
  })
  // ↑↑ сюди вводимо JSON дані
})
// ================================================================
// Підключаємо роутер до бек-енду
module.exports = router
