﻿document.addEventListener('DOMContentLoaded', function () {

  /**********Общая скидка****************/
  const totalDiscount = 30;
  const newPrices = document.querySelectorAll('.new-price');
  for (let item of newPrices) {
    item.innerHTML = Math.round(parseInt(item.previousElementSibling.innerHTML) * (1 - totalDiscount / 100)) + '&#8381;';
  }

  /*******Bottom basket ********/
  const bbCost = document.querySelector('.bottom-basket__cost');
  const bbCostDiscount = document.querySelector('.bottom-basket__cost-discount');

  //Показ меню
  const pizzaBox = document.querySelector('.pizzabox');
  const sendv = document.querySelector('.sendvich');
  const nav_ = document.querySelector('.header__nav');
  const body = document.querySelector('body');
  let totalSum = 0; //полная стоимость заказа
  let resultSum;
  const pizzaBoxOrder = document.querySelector('.pizzabox__order > button');
  const popupOrder = document.querySelector('.popup-order');
  const popupOrderSubmit = document.querySelector('.popup-order__submit');
  const popupOrderClose = document.querySelector('.popup-order__close');
  const popupSucsess = document.querySelector('.popup-sucsess');
  const popupSucsessClose = document.querySelector('.popup-sucsess__close');

  sendv.onclick = function () {
    nav_.classList.toggle('header__none');
    nav_.classList.toggle('header__nav_media');
    infoShow ? toHideModal() : toShowModal();
    pizzaBox.classList.toggle('pizzabox_nonactive');
  };
  //Скрытие меню при нажатии
  const items = document.querySelectorAll('.header__item');
  const menuBtn = document.querySelector('.menu-btn');
  for (let item of items) {
    item.onclick = function () {
      if (item !== document.querySelector('.header__nav--products')) {
        nav_.classList.toggle('header__none');
        nav_.classList.toggle('header__nav_media');
        toHideModal();
        pizzaBox.classList.remove('pizzabox_nonactive');
        menuBtn.checked = false;
      }
    };
  }

  //Работа с карточками 
  function pizzaNew(name, nameRus, size, price) {
    this.name = name;
    this.nameRus = nameRus;
    this.size = size;
    this.price = price;
  }

  const salyamy = new pizzaNew('salyamy', 'Салями', [35, 30, 25], [850, 800, 750]);
  const hit = new pizzaNew('hit', 'Хит', [35, 30, 25], [850, 800, 750]);
  const ham_mushrooms = new pizzaNew('ham_mushrooms', 'Ветчина-грибы', [35, 30, 25], [850, 800, 750]);
  const carbonara = new pizzaNew('carbonara', 'Карбонара', [35, 30, 25], [1250, 1100, 1000]);
  const firm = new pizzaNew('firm', 'Фирменная', [35, 30, 25], [950, 900, 850]);
  const assorty = new pizzaNew('assorty', 'Ассорти', [35, 30, 25], [850, 800, 750]);
  const L01 = new pizzaNew('L01', 'Л-01', [35, 30, 25], [920, 880, 800]);
  const three_cheese = new pizzaNew('three_cheese', 'Три сыра', [35, 30, 25], [990, 900, 850]);
  const meat = new pizzaNew('meat', 'Мясная', [35, 30, 25], [950, 850, 800]);

  const lanch01 = new pizzaNew('lanch01', 'Рулетики', [], [850]);
  const desert01 = new pizzaNew('desert01', 'Малиновый', [], [850]);
  const drink01 = new pizzaNew('drink01', 'Lipton', [], [850]);

  const pizzaObjects = [salyamy, hit, ham_mushrooms, carbonara, firm, assorty, L01, three_cheese, meat, lanch01, desert01, drink01];
  //массив объектов-карточек 

  const pizzaNames = []; //массив англоимен пицц
  for (let i = 0; i < pizzaObjects.length; i++) {
    pizzaNames.push(pizzaObjects[i].name);
  }
  const cards = document.querySelectorAll('.menu__cards');
  const menuWrap = document.querySelector('.menu__wrap'); //все пиццы
  const cardsPizza = menuWrap.querySelectorAll('.menu__cards');

  //Использовать фильтры
  let filter;
  const menuLabels = document.querySelectorAll('.menu__label');
  for (let mL of menuLabels) {
    mL.onclick = function () {
      filter = this.getAttribute('data-filter'); //определить значение фильтра
      if (filter == 'any') {
        for (let card_ of cardsPizza) {
          card_.classList.remove('to_hide');
        }
        return;
      }
      for (let card_ of cardsPizza) {
        card_.classList.remove('to_hide');
        if (filter !== card_.getAttribute('data-filter')) {
          card_.classList.add('to_hide');
        }
      }
    };
  }

  let all = 0; //общее количество заказанных пицц
  let infoShow = false; //булева переменная о показе/скрытии содержимого коробки
  class boxString { //Класс для строки в таблице заказа
    constructor(cardNumb, size, quantity, cost) {
      this.cardNumb = cardNumb;
      this.size = size;
      this.quantity = quantity;
      this.cost = cost;
    }
    calculateTotalCost() {
      let totalCost = this.quantity * this.cost;
    }
    addQuantity() {
      return (++this.quantity);
    }
    set PlusMinus(value) {
      this.quantity = this.quantity + value;
    }
  }

  let totalBox = []; //Массив объектов-строк заказа
  //уникальное имя пиццы и ее размер

  //Определить активную карточку
  function whatActiveCard() {
    for (let card of cards) {
      card.onmouseover = function () {
        let cardName = card.getAttribute('data-name_'); //получить название выбираемой пиццы
        let cardNumb = whatCardNumb(cardName); //получить номер карточки пиццы
        const sizes = this.querySelectorAll('.choose__label'); //массив размеров пиццы   
        let quantity = 0; //начальное количество в заказе 

        for (let s = 0; s < sizes.length; s++) {
          sizes[s].onclick = () => {
            this.querySelector('.price').innerHTML = pizzaObjects[cardNumb].price[s] + ` &#8381`;
            //показать цену выбранного размера

            for (let item of newPrices) {
              item.innerHTML = Math.round(parseInt(item.previousElementSibling.innerHTML) * (1 - totalDiscount / 100)) + '&#8381;'; //показать цену со скидкой
            }
          };
        }

        //действия при заказе пиццы   
        let buy = this.querySelector('.buy');
        let size;

        buy.onclick = () => {
          ++quantity;
          all += quantity;
          pizzaBox.classList.add('pizzabox_not_empty');
          //цена пиццы
          //let cost = this.querySelector('.price').innerHTML;
          let cost = this.querySelector('.new-price').innerHTML;

          //размер пиццы
          let radioSizes = this.getElementsByTagName('input');
          for (let rs of radioSizes) {
            if (rs.checked) {
              size = rs.nextElementSibling.innerHTML;
            }
          }
          toOrderPizza(cardNumb, size, quantity, cost); //В коробку
        };
      };
    }

    function whatCardNumb(cardName) {
      for (let n in pizzaNames) {
        if (pizzaNames[n] == cardName) {
          return (n);
        }
      }
    }

    function toOrderPizza(cardNumb, size, quantity, cost) {
      let repeat = false;
      if (totalBox.length !== 0) {
        for (let tB of totalBox) {
          if (cardNumb == Object.values(tB)[0] && size == Object.values(tB)[1]) {
            tB.addQuantity();
            repeat = true;
          }
          //Если уже заказывали, то увеличить количество на 1
        }
        for (let tB of totalBox) {
          //Если не заказывали, сформировать строку заказа
          if (!repeat) {
            totalBox.push(new boxString(cardNumb, size, quantity, cost));
            break;
          }
        }
      } else { //Если массив заказов пуст, сформировать строку заказа
        totalBox.push(new boxString(cardNumb, size, quantity, cost));
      }

      let tBody = document.querySelector('tbody');
      //let totalSum = 0; //полная стоимость заказа
      totalSum = 0; //полная стоимость заказа
      let Sum = 0; //стоимость по строке

      //Очистить таблицу tBody от прежних записей
      let olds = tBody.querySelectorAll('.olds');
      for (let old of olds) {
        tBody.removeChild(old);
      }

      //Создать строки в таблице заказа 
      for (let tB of totalBox) {
        let trNext = document.createElement('tr');
        trNext.classList.add('olds');
        if (Object.values(tB)[2] !== 0) {
          tBody.appendChild(trNext);
        }
        let tdName = [];
        for (let i = 0; i < 6; i++) {
          tdName[i] = document.createElement('td');
          trNext.appendChild(tdName[i]);
        }
        let btnAdd = document.createElement('button');
        let btnRemove = document.createElement('button');
        btnAdd.classList.add('add_');
        btnRemove.classList.add('remove_');
        btnAdd.innerHTML = '+';
        btnRemove.innerHTML = '-';
        btnAdd.onclick = () => {
          tB.PlusMinus = 1;
          tdName[2].innerHTML = Object.values(tB)[2];
          Sum = parseInt(Object.values(tB)[3]) * Object.values(tB)[2];
          tdName[3].innerHTML = Sum + ` &#8381`;
          totalSum += parseInt(Object.values(tB)[3]);
          tdTotalSum.innerHTML = totalSum + ` &#8381`;
          //Вывести результат в нижнюю корзину
          showBottomBasket(totalSum);
          //рассчитать скидку по купону
          calculateDiscount();
        };
        btnRemove.onclick = () => {
          tB.PlusMinus = -1;
          tdName[2].innerHTML = Object.values(tB)[2];
          Sum = parseInt(Object.values(tB)[3]) * Object.values(tB)[2];
          tdName[3].innerHTML = Sum + ` &#8381`;
          if (Sum == 0) {
            tBody.removeChild(trNext);
          } //Убрать строку
          totalSum -= parseInt(Object.values(tB)[3]);
          tdTotalSum.innerHTML = totalSum + ` &#8381`;
          //Вывести результат в нижнюю корзину
          showBottomBasket(totalSum);
          //рассчитать скидку по купону
          calculateDiscount();
          if (totalSum == 0) {
            all = 0;
            pizzaBox.classList.remove('pizzabox_not_empty');
            pizzaBoxFull.classList.add('to_hide'); //убрать сообщение о полной коробке 
            pizzaBoxEmpty.classList.remove('to_hide'); //показать сообщение о пустой коробке
          }
        };

        tdName[0].innerHTML = pizzaObjects[Object.values(tB)[0]].nameRus;
        tdName[1].innerHTML = Object.values(tB)[1] || " ";
        tdName[2].innerHTML = Object.values(tB)[2];
        Sum = parseInt(Object.values(tB)[3]) * Object.values(tB)[2];
        tdName[3].innerHTML = Sum + ` &#8381`;
        totalSum += Sum;
        tdName[4].appendChild(btnAdd);
        tdName[5].appendChild(btnRemove);
      }
      let trTotal = document.createElement('tr');
      trTotal.classList.add('olds', 'trTotal');
      tBody.appendChild(trTotal);
      let tdTotalBlank1 = document.createElement('td');
      let tdTotalBlank2 = document.createElement('td');
      let tdTotalText = document.createElement('td');
      let tdTotalSum = document.createElement('td');
      trTotal.appendChild(tdTotalText);
      trTotal.appendChild(tdTotalBlank1);
      trTotal.appendChild(tdTotalBlank2);
      trTotal.appendChild(tdTotalSum);
      tdTotalText.innerHTML = 'ИТОГО';
      tdTotalSum.innerHTML = totalSum + ` &#8381`;
      resultSum = totalSum;
      popupOrderSubmit.setAttribute('value', resultSum);

      //Вывести результат в нижнюю корзину
      showBottomBasket(resultSum);
    }
  }

  function showBottomBasket(sum) {
    //Вывести результат в нижнюю корзину
    bbCostDiscount.innerHTML = sum + '&#8381;';
    bbCost.innerHTML = Math.round(sum / (1 - totalDiscount / 100)) + '&#8381;';
  }

  const setCoupon = document.querySelector('.set-coupon');
  const btnCoupon = document.querySelector('.btn_coupon');
  const discount = document.querySelector('.discount');
  const pass = 'pizza2022';

  btnCoupon.addEventListener('click', calculateDiscount);

  function calculateDiscount() {
    if (setCoupon.value == pass) {
      discount.innerHTML = Math.round(totalSum * 0.8) + ` &#8381`;
      resultSum = Math.round(totalSum * 0.8);
      popupOrderSubmit.setAttribute('value', `${resultSum}`);
      //Вывести результат в нижнюю корзину
      showBottomBasket(resultSum);
    }
  }

  whatActiveCard();

  // Работа с коробкой пиццы  
  const pizzaBoxInfo = document.querySelector('.pizzabox__info');
  const pizzaBoxClose = document.querySelectorAll('.pizzabox__close');
  const pizzaBoxEmpty = document.querySelector('.pizzabox__empty');
  const pizzaBoxFull = document.querySelector('.pizzabox__full');

  //показать/спрятать информацию о коробке
  pizzaBox.onclick = () => {
    //убрать/сделать окно модальным
    if (infoShow) {
      toHideModal();
    } else {
      toShowModal();
    }

    sendv.classList.toggle('pizzabox_nonactive');
    pizzaBoxInfo.classList.toggle('to_hide');
    if (all) {
      pizzaBoxEmpty.classList.add('to_hide'); //убрать сообщение о пустой коробке 
      pizzaBoxFull.classList.remove('to_hide'); //показать сообщение о полной коробке
    }
  };
  for (let pbc of pizzaBoxClose) {
    pbc.onclick = () => {
      pizzaBoxInfo.classList.add('to_hide');
      toHideModal();
      sendv.classList.remove('pizzabox_nonactive');
    };
  }

  function toHideModal() {
    let ss = document.querySelector('style');
    document.head.removeChild(ss); //убрать display: block
    let sss = document.head.appendChild(document.createElement('style'));
    sss.innerHTML = "body::after {display: none}";
    infoShow = false;
    body.classList.remove('no-scroll');
  }

  function toShowModal() {
    let styleBody = document.head.appendChild(document.createElement('style'));
    styleBody.innerHTML = "body::after {display: block}";
    infoShow = true;
    body.classList.add('no-scroll');
  }
  //Оформить заказ

  pizzaBoxOrder.onclick = () => {
    popupOrder.classList.remove('to_hide');
    pizzaBoxInfo.classList.add('to_hide');
    pizzaBox.classList.add('pizzabox_nonactive');
  };

  popupOrderClose.onclick = () => {
    popupOrder.classList.add('to_hide');
    toHideModal();
    sendv.classList.remove('pizzabox_nonactive');
    pizzaBox.classList.remove('pizzabox_nonactive');
  };

  popupOrderSubmit.onclick = (e) => {
    const name = document.querySelector('.order-name');
    const tel = document.querySelector('.order-tel');
    const addr = document.querySelector('.order-addr');

    if (name.value && tel.value && addr.value) {
      setTimeout(function () {
        popupOrder.classList.add('to_hide');
        popupSucsess.classList.remove('to_hide');
      }, 1000);
    } else {
      return;
    }
  };

  popupSucsessClose.onclick = () => {
    popupSucsess.classList.add('to_hide');
    toHideModal();
    pizzaBox.classList.remove('pizzabox_nonactive');
    sendv.classList.remove('pizzabox_nonactive');
  };

});