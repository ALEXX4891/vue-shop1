<template>
  <main class="content container">
    <div class="content__top content__top--catalog">
      <h1 class="content__title">Каталог</h1>
      <span class="content__info"> 152 товара </span>
    </div>

    <div class="content__catalog">
      <ProductFilter
        :price-from.sync="filterPriceFrom"
        :price-to.sync="filterPriceTo"
        :category-id.sync="filterCategoryId"
        :color-id.sync="filterColorId"
      />

      <section class="catalog">
        <div v-show="this.productsLoading">Загрузка товаров, подождите...
          <img src="../assets/__Iphone-spinner-1.gif" alt="прелоадер">
        </div>
        <div v-if="this.productsLoadingFailed">
          Произошла ошибка при загрузке товаров...
          <button @click.prevent="loadPRoducts">
            Пропробовать еще раз
          </button>
        </div>
        <ProductList v-if="!this.productsLoading" :products="products"/>
        <!-- <ProductList :products="products" @gotoPage="(pageName, pageParams) => $emit('gotoPage', pageName, pageParams)"/> -->
        <BasePagination v-model="page" :count="countProducts" :per-page="productsPerPage" />
      </section>
    </div>
  </main>
</template>

<script>
import ProductList from '@/components/ProductList.vue';
import BasePagination from '@/components/BasePagination.vue';
import ProductFilter from '@/components/ProductFilter.vue';
import axios from 'axios';
import { API_BASE_URL } from '@/config';

export default {
  components: { ProductList, BasePagination, ProductFilter },
  data() {
    return {
      filterPriceFrom: 0,
      filterPriceTo: 0,
      filterCategoryId: 0,
      filterColorId: 0,

      page: 1,
      productsPerPage: 3,

      productsData: null,

      productsLoading: false,
      productsLoadingFailed: false,
    };
  },
  computed: {
    products() {
      return this.productsData
        ? this.productsData.items.map((product) => ({
          ...product,
          image: product.image.file.url,
        }))
        : [];
    },
    countProducts() {
      // return this.productsData.pagination.total;
      return this.productsData ? this.productsData.pagination.total : 0;
    },
  },
  methods: {
    loadPRoducts() {
      this.productsLoading = true;
      this.productsLoadingFailed = false;
      clearTimeout(this.loadPRoductsTimer);
      this.loadPRoductsTimer = setTimeout(() => {
        axios.get(`${API_BASE_URL}/api/products`, {
          params: { // параметры которые будут автоматически записываться в строку запроса
            page: this.page,
            limit: this.productsPerPage,
            categoryId: this.filterCategoryId,
            minPrice: this.filterPriceFrom,
            maxPrice: this.filterPriceTo,
            colorId: this.filterColorId,
          },
        })
          .then((response) => { this.productsData = response.data; })
          .catch(() => { this.productsLoadingFailed = true; })
          .then(() => { this.productsLoading = false; });
      }, 0);
    },
  },
  watch: { // вотчер следит за изменением определенных параметров, и запускает определенный метод
    page() {
      this.loadPRoducts();
    },
    filterPriceFrom() {
      this.loadPRoducts();
    },
    filterPriceTo() {
      this.loadPRoducts();
    },
    filterCategoryId() {
      this.loadPRoducts();
    },
    filterColorId() {
      this.loadPRoducts();
    },
  },
  created() {
    this.loadPRoducts();
  },
};
</script>
