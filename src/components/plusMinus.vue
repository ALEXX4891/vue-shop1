<!-- eslint-disable vuejs-accessibility/form-control-has-label -->
<template>
  <div class="form__counter">

    <button class="button" type="button" aria-label="Убрать один товар" @click.prevent="minusProduct" v-if="value > 1">
      <svg width="12" height="12" fill="currentColor">
        <use xlink:href="#icon-minus"></use>
      </svg>
    </button>

    <button type="button" aria-label="Убрать один товар" v-else>
      <svg width="12" height="12" fill="currentColor">
        <use xlink:href="#icon-minus"></use>
      </svg>
    </button>

    <input type="text" v-model.number="amount" >

      <button class="button" type="button" aria-label="Добавить один товар" @click.prevent="plusProduct">

      <svg width="12" height="12" fill="currentColor">
        <use xlink:href="#icon-plus"></use>
      </svg>
    </button>
  </div>
</template>

<script>
export default {
  props: ['value'],
  methods: {
    minusProduct() {
      this.$emit('input', this.value - 1);
    },
    plusProduct() {
      this.$emit('input', this.value + 1);
    },
  },
  computed: {
    amount: {
      get() { // получение значения в инпут
        return this.value;
      },
      set(value) { // передача значения из инпута
        this.$emit('input', value);
      },
    },
  },
};
</script>
