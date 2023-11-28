// змінила перевірку на поля та додала трохи інших)

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

// =================================================================

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
