<template>
  <div :class="s.wrapper">
    <div :class="s.topBar">
      <div :class="s.topBarLeft">
        <div :class="s.logo"></div>
        <!-- <div :class="s.companyName">companyName</div> -->
      </div>
      <div :class="s.topBarRight">
        <div :class="s.avatar"></div>
      </div>
    </div>

    <el-container :class="s.main">
      <el-aside width="250px" v-if="route?.query?.showAside !== 'false'">
        <el-row class="tac">
          <el-col>
            <el-menu
              :default-active="`${activeIndex}`"
              class="el-menu-vertical-demo"
            >
              <el-menu-item @click="goPage(item, index)" v-for="(item, index) in routerList" :index="`${index}`">
                <span>{{ item.name }}</span>
              </el-menu-item>
            </el-menu>
          </el-col>
        </el-row>
      </el-aside>
      <el-main>
        <RouterView />
      </el-main>
    </el-container>
  </div>
</template>
<script>
import { toRefs, reactive, defineComponent, onMounted } from "vue";
import { useRouter , useRoute } from 'vue-router'
export default defineComponent({
  setup() {
    const router = useRouter()
    const route = useRoute()
    const data = reactive({
        activeIndex: 0,
        routerList: [
          { name: 'Organizational', linkName: 'home' },
          { name: 'Employees', linkName: 'employee' },
          { name: 'Positions', linkName: 'positions' },
        ]
    })
    const goPage = (item, index) => {
        data.activeIndex = index
        router.push({ name: item.linkName })
    }

    onMounted(() => {
        console.log(route, 'xx')
    })

    return {
      ...toRefs(data),
      route,
      goPage
    }
  }
})
</script>
<style scoped module="s" lang="scss">
.wrapper {
  /* background-color: #000; */
}

.topBar {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 200;
  width: 100%;
  min-height: 60px;
  background: #2b2b2c;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .topBarLeft {
    display: flex;
    justify-content: center;
    padding-left: 24px;
    .logo {
      width: 120px;
      height: 40px;
      border-radius: 10px;
      background: #fff;
    }
    .companyName {
      color: #fff;
    }
  }
  .topBarRight {
    padding-right: 24px;
    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #fff;
    }
  }
}

.main {
  padding-top: 60px;
  width: 90%;
  margin: 0 auto;
  .searchDv {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .table {
    padding-top: 24px;
  }
}
</style>
