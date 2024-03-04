<!-- eslint-disable vuejs-accessibility/form-control-has-label -->
<template>
  <li class="cart__order">
    <h3>{{ item.product.title }}</h3>
    <b v-if="item.amount">{{ (item.amount * item.product.price) | numberFormat }} ₽</b>
    <b v-if="item.quantity">{{ (item.quantity * item.product.price) | numberFormat }} ₽</b>
    <span>Артикул: {{ item.product.id }}</span>
  </li>
</template>

<script>
import numberFormat from '@/halpers/numberFormat';

export default {
  filters: { numberFormat },
  props: ['item'],
};
</script>
