<template>
  <v-nav></v-nav>
  <div :class="s.searchDv">
    <div :class="s.queryDv">
      <el-input
        style="width: 240px; height: 40px"
        placeholder="Type something"
        :suffix-icon="Search"
        v-model="queryInput"
      />
    </div>
    <div :class="s.btnDv">
      <el-button type="primary" plain>Search</el-button>
    </div>
  </div>
  <el-table
    :data="tableData"
    :header-cell-style="{
      color: '#606266',
      height: '60px',
    }"
    :row-style="{ height: '60px' }"
  >
    <el-table-column prop="name" label="name" width="180" />
    <el-table-column prop="age" label="age" />
    <el-table-column prop="gender" label="gender" />
    <el-table-column prop="status" label="status" />
    <el-table-column prop="code" label="id" width="120" />
    <el-table-column prop="department" label="department" width="120" />
    <el-table-column prop="position" label="position" width="180" />
    <el-table-column prop="phone" label="mobile phone" width="180" />
    <el-table-column fixed="right" label="Operations" width="120">
      <template #default>
        <el-button link type="primary" size="small">Detail</el-button>
        <el-button link type="primary" size="small">Edit</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import VWrapper from "../../components/Wrapper.vue";
import VNav from "../../components/SearchNav.vue";
import { ref, toRefs, reactive, defineComponent } from "vue";
import { Search } from "@element-plus/icons-vue";
export default defineComponent({
  components: {
    VNav,
  },
  setup() {
    const data = reactive({
      tableData: [
        {
          name: "Tom",
          gender: "female",
          age: "26",
          status: "",
          code: "E12333",
          department: "IT",
          email: "axxxxx@gmail.com",
          position: "Software Development Engineer",
          phone: "8888888",
        },
        {
          name: "Tom",
          gender: "female",
          age: "26",
          code: "E12333",
          department: "IT",
          email: "axxxxx@gmail.com",
          position: "Software Development Engineer",
          phone: "8888888",
        },
        {
          name: "Tom",
          gender: "female",
          age: "26",
          code: "E12333",
          department: "IT",
          email: "axxxxx@gmail.com",
          position: "Software Development Engineer",
          phone: "8888888",
        },
        {
          name: "Tom",
          gender: "female",
          age: "26",
          code: "E12333",
          department: "IT",
          email: "axxxxx@gmail.com",
          position: "Software Development Engineer",
          phone: "8888888",
        },
      ],
    });
    return {
      ...toRefs(data),
    };
  },
});
</script>

<style scoped module="s" lang="scss">
.searchDv {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 32px;
}
</style>
