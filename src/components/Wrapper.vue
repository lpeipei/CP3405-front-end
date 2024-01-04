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
      <el-aside width="250px">
        <el-row class="tac">
          <el-col>
            <el-menu
              default-active="1"
              class="el-menu-vertical-demo"
            >
              <el-menu-item index="1">
                <span>Organizational</span>
              </el-menu-item>
              <el-menu-item index="2">
                <span>Positions</span>
              </el-menu-item>
              <el-menu-item index="3">
                <span>Employee</span>
              </el-menu-item>
            </el-menu>
          </el-col>
        </el-row>
      </el-aside>
      <el-main>
        <slot name="rightMain"></slot>
      </el-main>
    </el-container>
  </div>
</template>

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
