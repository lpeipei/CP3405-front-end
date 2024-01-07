<template>
  <div :class="s.main">
    <div :class="s.searchDv">
      <div :class="s.queryDv">
        <el-input
          style="width: 240px; height: 40px"
          placeholder="search"
          :suffix-icon="Search"
          v-model="queryInput"
        />
      </div>
      <div :class="s.btnDv">
        <el-button type="primary">Add a position</el-button>
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
      <el-table-column prop="name" label="Position Name" width="240" />
      <el-table-column prop="number" label="Employees" width="120" />
      <el-table-column prop="department" label="Department" width="180" />
      <el-table-column prop="describe" label="Describe" width="240" />
      <el-table-column fixed="right" label="Operations" width="120">
        <template #default>
          <!-- <el-button link type="primary" size="small">Detail</el-button> -->
          <el-button link type="primary" size="small">Edit</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <v-aside
    v-show="addVisible"
    title="Add A Position"
    ok-text="Confirm"
    cancel-text="Cancel"
    @on-cancel="cancel"
  >
    <el-form label-width="180px">
      <el-form-item label="Job Title">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="Department">
        <el-input v-model="form.department" />
      </el-form-item>
      <el-form-item label="Number of Employees">
        <el-input v-model="form.number" />
      </el-form-item>
      <el-form-item label="Describe">
        <el-input v-model="form.describe" type="textarea" />
      </el-form-item>
    </el-form>
  </v-aside>
</template>

<script>
import { ref, toRefs, reactive, defineComponent } from "vue";
import VAside from "../../components/Aside.vue";
import { Search } from "@element-plus/icons-vue";
export default defineComponent({
  components: {
    VAside,
    Search,
  },
  setup() {
    const data = reactive({
      queryInput: "",
      addVisible: true,
      tableData: [
        {
          name: "Software Development Engineer",
          number: "20",
          department: "IT",
          describe: "describedescribedescribedescribedescribedescribedescribe",
        },
        {
          name: "Software Development Engineer",
          number: "20",
          department: "IT",
          describe: "describedescribedescribedescribedescribedescribedescribe",
        },
        {
          name: "Software Development Engineer",
          number: "20",
          department: "IT",
          describe: "describedescribedescribedescribedescribedescribedescribe",
        },
        {
          name: "Software Development Engineer",
          number: "20",
          department: "IT",
          describe: "describedescribedescribedescribedescribedescribedescribe",
        },
      ],
      form: {
        name: "",
        number: "",
        department: "",
        describe: "",
      },
    });

    const dialogCancel = () => {
      this.addVisible = false;
    };
    return {
      ...toRefs(data),
      dialogCancel,
      Search,
    };
  },
});
</script>

<style scoped module="s" lang="scss">
.main {
  background-color: rgba(61, 129, 202, 0.15);
  padding: 32px;
  border-radius: 10px;
  .searchDv {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 32px;
  }
}
</style>
