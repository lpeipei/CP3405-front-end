<template>
  <v-nav @on-change-status="changeStatus"></v-nav>
  <div :class="s.searchDv">
    <div :class="s.queryDv">
      <el-input
        style="width: 240px; height: 40px"
        placeholder="Type something"
        :suffix-icon="Search"
        v-model="query.keyword"
        clearable
      />
    </div>
    <div :class="s.btnDv">
      <el-button type="primary" plain @click="getList">Search</el-button>
      <el-button type="primary"  @click="getList" disabled>Add</el-button>
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
    <el-table-column prop="gender" label="gender"  width="120">
        <template v-slot="{ row }">
          {{ ['female', 'male'][row.gender] }}
      </template>
    </el-table-column>
    <el-table-column prop="status" label="status"  width="120" >
      <template v-slot="{ row }">
          {{ status[row.status] }}
      </template>
    </el-table-column>
    <!-- <el-table-column prop="code" label="id" width="120" /> -->
    <el-table-column prop="department_name" label="department" width="120" />
    <el-table-column prop="position" label="position" width="180" />
    <el-table-column prop="mobile" label="mobile phone" width="180" />
    <el-table-column fixed="right" label="Operations" width="120">
      <template #default>
        <el-button link type="primary" size="small">Detail</el-button>
        <el-button link type="primary" size="small" disabled>Edit</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import VWrapper from "../../components/Wrapper.vue";
import VNav from "../../components/SearchNav.vue";
import { ref, toRefs, reactive, defineComponent, onMounted } from "vue";
import axios from "axios";
import { Search } from "@element-plus/icons-vue";
export default defineComponent({
  components: {
    VNav,
  },
  setup() {
    const data = reactive({
      tableData: [],
      status: ['All', 'Full-time', 'Part-time', 'Confirming', 'Leaving', 'Separated'],
      query: {
        keyword: '',
        status: 0
      }
    });
    const getList = () => {
      axios
        .get("http://127.0.0.1:5006/api/employee/list", {
          params: { ...data.query },
        })
        .then((response) => {
          console.log(response.data, 11);
          data.tableData = response.data;
        })
        .catch((error) => {
          console.error("Error fetching organization structure:", error);
        });
    };
    const changeStatus = (item) => {
        data.query.status = item.type
        getList()
    }
    onMounted(() => {
      getList();
    })
    return {
      ...toRefs(data),
      getList,
      changeStatus,
      Search
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
