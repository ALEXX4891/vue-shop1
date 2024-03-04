import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import { API_BASE_URL } from '@/config';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    cartProducts: [],

    userAccessKey: null,

    cartProductsData: [],

    orderInfo: null,
  },
  mutations: { // мутация - изменение данных в хранилище. Только синхронные функции!!!
    updateOrderInfo(state, orderInfo) { // сохранение данных о заказе в хранилище
      state.orderInfo = orderInfo;
    },
    resetCart(state) { // сброс данных о корзане в хранилище
      state.cartProducts = [];
      state.cartProductsData = [];
    },
    updateCartProductAmount(state, { productId, amount }) { // изменение количества товара в корзине
      const item = state.cartProducts.find((el) => el.productId === productId);

      if (item) {
        item.amount = amount;
      }
    },
    deleteCartProduct(state, productId) { // удаление товара в корзине в хранилище
      state.cartProducts = state.cartProducts.filter((item) => item.productId !== productId); // удаление товара из корзины
    },
    updatUserAccessKey(state, accessKey) { // сохранение ключа пользователя в хранилище
      state.userAccessKey = accessKey;
    },
    updateCartProductsData(state, items) { // сохранение данных о корзине в хранилище
      state.cartProductsData = items;
    },
    syncCartProducts(state) { // мутация которая синхронизирует передачу данных о товарах в корзине
      state.cartProducts = state.cartProductsData.map((item) => ({
        productId: item.product.id,
        amount: item.quantity,
      }));
    },
  },
  getters: {
    cartDetailProducts(state) {
      return state.cartProducts.map((item) => {
        const { product } = state.cartProductsData.find((p) => p.product.id === item.productId);

        return {
          ...item,
          product: {
            ...product,
            image: product.image.file.url,
          },
        };
      });
    },
    cartTotalPrice(state, getters) {
      return getters.cartDetailProducts.reduce((acc, item) => (item.product.price * item.amount) + acc, 0);
    },
    cartTotalAmount(state, getters) {
      return getters.cartDetailProducts.reduce((acc, item) => item.amount + acc, 0);
    },
  },
  actions: { // вызывает мутации, можно использовать не синхронные функции.
    loadOrderInfo(context, orderId) { // загрузка данных о заказе по ID
      return axios
        .get(`${API_BASE_URL}/api/orders/${orderId}`, {
          params: {
            userAccessKey: context.state.userAccessKey,
          },
        })
        .then((response) => {
          context.commit('updateOrderInfo', response.data); // вызов мутации по сохранению данных о заказе
        });
    },
    loadCart(context) { // context - содержит методы глобального хранилища store
      return axios
        .get(`${API_BASE_URL}/api/baskets`, {
          params: {
            userAccessKey: context.state.userAccessKey,
          },
        })
        .then((response) => {
          if (!context.state.userAccessKey) {
            localStorage.setItem('userAccessKey', response.data.user.accessKey); // сохраняем ключ в localStorage
            context.commit('updatUserAccessKey', response.data.user.accessKey); // сохраняем ключ в store
          }

          // localStorage.setItem('userProductsData', response.data.items); // сохраняем продукты в localStorage
          context.commit('updateCartProductsData', response.data.items); // сохраняем продукты в store
          context.commit('syncCartProducts');
        });
    },
    addProductToCart(context, { productId, amount }) {
      return (new Promise((resolve) => { setTimeout(resolve, 2000); }))
        .then(() => axios
          .post(`${API_BASE_URL}/api/baskets/products`, {
            productId,
            quantity: amount,
          }, {
            params: {
              userAccessKey: context.state.userAccessKey,
            },
          })
          .then((response) => {
            context.commit('updateCartProductsData', response.data.items); // сохраняем продукты в store
            context.commit('syncCartProducts');
          }));
    },
    updateCartProductsAmount(context, { productId, amount }) {
      context.commit('updateCartProductAmount', { productId, amount }); // вызываем мутацию (название её совпадает с действием)
      if (amount < 1) {
        return;
      }
      axios.put(`${API_BASE_URL}/api/baskets/products`, {
        productId,
        quantity: amount,
      }, {
        params: {
          userAccessKey: context.state.userAccessKey,
        },
      })
        .then((response) => {
          context.commit('updateCartProductsData', response.data.items); // сохраняем продукты в store
        })
        .catch(() => {
          context.commit('syncCartProducts'); // откат состояния, на момент когда все работало нормально.
        });
    },
    // удаление товара:
    deleteFromCartProduct(context, productId) {
      context.commit('deleteCartProduct', productId);
      return axios
        .delete(
          `${API_BASE_URL}/api/baskets/products`,
          {
            data: {
              productId,
            },
            params: {
              userAccessKey: context.state.userAccessKey,
            },
          },
        );
    },
  },
});
