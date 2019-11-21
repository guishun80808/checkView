<template>
  <div id="home">
    <router-view @changeData="changeData"></router-view>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Dashboard",
  computed: {
    ...mapGetters(["name", "userInfo"])
  },
  data() {
    return {
      routerCon: true,
      activeIndex: ""
    };
  },
  methods: {
    handleSelect(key, keyPath) {
      this.$router.push({
        path: key
      });
    },
    changeData(key) {
      this.activeIndex = key;
    }
  },
  mounted() {
    
  }
};
</script>

<style lang="scss" scoped>
#home {
  width: 100%;
  height: 1010px;
}
</style>
