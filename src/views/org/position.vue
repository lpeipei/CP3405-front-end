<template>
  <div :class="s.main">
    <div :class="s.searchDv">
      <div :class="s.queryDv">
        <el-input
          style="width: 240px; height: 40px"
          placeholder="search"
          v-model="queryInput"
          clearable
        >
          <template #suffix>
            <el-button type="primary" link @click="getList">
              <el-icon><Search /></el-icon>
            </el-button>
          </template>
        </el-input>
      </div>
      <div :class="s.btnDv">
        <el-button type="primary" @click="addVisible = true">Add a position</el-button>
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
      <el-table-column prop="code" label="code" width="120" />
      <el-table-column prop="salary" label="salary" width="120">
          <template v-slot="{ row }">
              ${{row.salary}}
          </template>
      </el-table-column>
      <el-table-column prop="department_name" label="Department" width="180" />
      <el-table-column prop="description" label="Description" width="240" />
      <el-table-column fixed="right" label="Operations" width="150">
        <template v-slot="{ row }">
          <el-button link type="primary" size="danger" @click="deleteBtn(row)">Delete</el-button>
          <el-button link type="primary" size="small" @click="edit(row)">Edit</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <v-aside
    :value="addVisible"
    title="Add A Position"
    ok-text="Confirm"
    cancel-text="Cancel"
    @on-close="dialogCancel"
    @on-head-close="dialogCancel"
    @save="save"
  >
    <el-form label-width="120px">
      <el-form-item label="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="code">
        <el-input v-model="form.code" />
      </el-form-item>
      <el-form-item label="department">
        <el-autocomplete
          v-model="form.department.name"
          :fetch-suggestions="getDepartmenttAsync"
          placeholder="type name or code"
          @select="handleSelectOrg"
          :trigger-on-focus="false"
          style="width: 100%"
        >
          <template #suffix>
            <el-button link :icon="Search" />
          </template>
          <template #default="{ item }">
            <div :class="s.searchDropTop">
              <span>{{ item.name }}</span>
            </div>
            <span :class="s.searchDropTop_job">ID: {{ item.code }}</span>
          </template>
        </el-autocomplete>
      </el-form-item>
      <el-form-item label="salary">
        <el-input-number v-model="form.salary" :precision="2" :step="1"/>
      </el-form-item>
      <el-form-item label="description">
        <el-input v-model="form.description" type="textarea" />
      </el-form-item>
    </el-form>
  </v-aside>
</template>

<script>
import { ref, toRefs, reactive, defineComponent, onMounted } from "vue";
import VAside from "../../components/Aside.vue";
import { Search } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from 'element-plus'
import axios from "axios";
export default defineComponent({
  
  components: {
    VAside,
    Search,
  },
  setup() {
    const data = reactive({
      queryInput: "",
      addVisible: false,
      tableData: [],
      form: {
        name: "",
        code: "",
        id: null,
        department: {
          name: '',
          id: ''
        },
        salary: 0,
        description: "",
      },
    });
    const edit = (item) => {
      const {name, code, department_name, department_id, description, salary, id } = item;
      data.form = {
        name, code, description, salary,
        id,
        department: {
          name: department_name,
          id: department_id
        }
      }
      data.addVisible = true;
    }
    const getDepartmenttAsync = (str, callback) => {
      axios
        .get("http://127.0.0.1:5000/api/organization/list", {
          params: { keyword: data.form.department.name },
        })
        .then((response) => {
          callback(response.data);
        })
        .catch((error) => {
          console.error("Error fetching organization structure:", error);
        });
    };
    const getList = () => {
      axios
        .get("http://127.0.0.1:5009/api/positions", {
          params: { keyword: data.queryInput },
        })
        .then((response) => {
          data.tableData = response.data.reverse();
        })
        .catch((error) => {
          console.error("Error fetching organization structure:", error);
        });
    };
    

    const handleSelectOrg = (item) => (data.form.department = { ...item })
    const dialogCancel = () => {
      data.form = {
        name: "",
        code: "",
        department: {
          name: '',
          id: ''
        },
        id: null
      }
      data.addVisible = false;
    };
    const save = () => {
        let params = {...data.form, department: { name: data.form.department.name, id: data.form.department.id }}
        if (params.id === null) {
            delete params.id
            axios.post("http://127.0.0.1:5011/api/position/add", {
            ...params
          })
          .then((response) => {
            ElMessage({
              message: "added successfully",
              type: "success",
            });
            getList()

          })
          .catch((error) => {
            ElMessage({
              message: "error",
              type: "error",
            });
          });
        }else {
          axios.put(`http://127.0.0.1:5012/api/position/edit/${params.id}`, {
            ...params
          })
          .then((response) => {
            ElMessage({
              message: "edited successfully!",
              type: "success",
            });
            getList()
          })
          .catch((error) => {
            ElMessage({
              message: "error",
              type: "error",
            });
            console.error("Error fetching organization structure:", error);
          });
        }
        data.form = {
          name: "",
          code: "",
          id: null,
          department: {
            name: '',
            id: ''
          }
        }
        data.addVisible = false
        
    }
    const deleteBtn = (item) => {
      ElMessageBox.confirm(
          'The position will be deleted. Continue?',
          'Warning',
          {
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancel',
            type: 'warning',
          }
        )
          .then(() => {
            axios
            .delete(`http://127.0.0.1:5013/api/position/delete/${item.id}`)
            .then((response) => {
                ElMessage({
                type: 'success',
                message: 'Delete completed',
              })
              getList()
            })
            .catch((error) => {
              console.error("Error fetching organization structure:", error);
            });
            
          })
          .catch(() => {
            ElMessage({
              type: 'info',
              message: 'Delete canceled',
            })
          })
    }
    onMounted(() => {
      getList();
    })
    return {
      ...toRefs(data),
      dialogCancel,
      getList,
      getDepartmenttAsync,
      handleSelectOrg,
      save,
      edit,
      deleteBtn,
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
