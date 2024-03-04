<!-- eslint-disable vuejs-accessibility/label-has-for -->
<template>
  <li class="catalog__item">
    <router-link class="catalog__pic" :to="{name:'product', params: {id: product.id}}">
      <img :src="product.image" :alt="product.title" />
    </router-link>
    <h3 class="catalog__title">
      <router-link :to="{name:'product', params: {id: product.id}}">
        {{ product.title }}
      </router-link>
    </h3>
    <span class="catalog__price"> {{ product.price | numberFormat}} ₽ </span>
    <ul class="colors colors--black">
      <li class="colors__item" v-for="el in product.colors" :key="el.id">
        <label class="colors__label">
          <input
            class="colors__radio sr-only"
            type="radio"
            value="#73B6EA"
            checked=""
            v-model="color"
          />
          <span class="colors__value" :style="`background-color: ${ el.code }`" :value="el.id"> </span>
        </label>
      </li>
    </ul>
  </li>
</template>

<script>
import numberFormat from '@/halpers/numberFormat';

export default {
  data() {
    return {
      color: '#73B6EA',
    };
  },
  name: 'ProductItem',
  filters: {
    numberFormat,
  },
  props: ['product'],
};
</script>
