<template>
  <!-- 搜索框 -->
  <div :class="s.searchDv">
    <div :class="s.queryDv">
      <el-input
        style="width: 240px; height: 40px"
        placeholder="Type org name or code"
        v-model="query.keyword"
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
      <el-button type="primary" plain @click="addNewOrg">Add</el-button>
    </div>
  </div>

  <!-- 表单 -->
  <div :class="s.table">
    <el-table
      ref="table"
      :data="tableData"
      height="800"
      :header-cell-style="{
        background: '#eef1f6',
        color: '#606266',
        height: '60px'
      }"
      :row-style="{ height: '60px' }"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      lazy
      row-key="id"
      :load="load"
    >
      <el-table-column prop="name" label="name" width="250">
        <template v-slot="{ row }">
          <el-button type="primary" link @click="goDetail(row)">
            {{ row.name }}
          </el-button>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="number" label="Number of members" width="180" /> -->
      <el-table-column prop="manager" label="manager" width="200">
        <template v-slot="{ row }">
          {{ row.manager.name }}
          <el-button type="primary" link @click="editManager(row)">
            <el-icon><Edit /></el-icon>
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="leader" label="leader" width="200">
        <template v-slot="{ row }">
          {{ row.leader.name }}
          <!-- <el-button type="primary" link @click="editManager(row)">
                    <el-icon><Edit /></el-icon>
                    </el-button> -->
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="Operations" width="150">
        <template v-slot="{ row }">
          <div v-if="!['Company ABC', 'Company XYZ'].includes(row.name)">
            <el-button
              link
              type="danger"
              @click="deleteBtn(row)"
            >
              delete
            </el-button>
            <el-button
              link
              type="primary"
              disabled
              @click="editRow(row)"
            >
              edit
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <v-aside
    :value="addShow"
    :loading="loading"
    title="Add New Org"
    ok-text="Confirm"
    cancel-text="Cancel"
    @on-close="addCancel"
    @on-head-close="addCancel"
    @save="updataList"
  >
    <el-form :model="form" label-width="80px">
      <el-form-item label="Name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="parent org">
        <el-autocomplete
          v-model="form.parent.name"
          :fetch-suggestions="getListAsync"
          placeholder="org name or code"
          @select="handleSelectParent"
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
      <el-form-item label="Manager">
        <el-autocomplete
          v-model="form.manager.name"
          :fetch-suggestions="querySearchAsync"
          placeholder="name or ID"
          @select="handleSelectManager"
          :trigger-on-focus="false"
          style="width: 100%"
        >
          <template #suffix>
            <el-button link :icon="Search" />
          </template>
          <template #default="{ item }">
            <div :class="s.searchDropTop">
              <span>{{ item.name }}</span>
              <span :class="s.searchDropTop_job">{{ item.position }}</span>
            </div>
            <span :class="s.searchDropTop_job">ID: {{ item.code }}</span>
          </template>
        </el-autocomplete>
      </el-form-item>
      <el-form-item label="Leader">
        <el-autocomplete
          v-model="form.leader.name"
          :fetch-suggestions="querySearchAsync"
          placeholder="name or ID"
          @select="handleSelectLeader"
          :trigger-on-focus="false"
          style="width: 100%"
        >
          <template #suffix>
            <el-button link :icon="Search" />
          </template>
          <template #default="{ item }">
            <div :class="s.searchDropTop">
              <span>{{ item.name }}</span>
              <span :class="s.searchDropTop_job">{{ item.position }}</span>
            </div>
            <span :class="s.searchDropTop_job">ID: {{ item.code }}</span>
          </template>
        </el-autocomplete>
      </el-form-item>
      <el-form-item label="Desc">
        <el-input v-model="form.describe" type="textarea" />
      </el-form-item>
    </el-form>
  </v-aside>

  <el-dialog
    v-model="editManagerVisible"
    title="Select Manager"
    width="40%"
    :before-close="managerCancel"
  >
    <el-form ref="formRef">
      <el-form-item label="Employee Name">
        <el-autocomplete
          v-model="managerKeyword"
          :fetch-suggestions="querySearchAsync"
          placeholder="name or ID"
          @select="handleSelect"
          :trigger-on-focus="false"
          style="width: 100%"
        >
          <template #suffix>
            <el-button link :icon="Search" />
          </template>
          <template #default="{ item }">
            <div :class="s.searchDropTop">
              <span>{{ item.name }}</span>
              <span :class="s.searchDropTop_job">{{ item.position }}</span>
            </div>
            <span :class="s.searchDropTop_job">ID: {{ item.code }}</span>
          </template>
        </el-autocomplete>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="managerCancel">Cancel</el-button>
        <el-button type="primary" @click="managerConfirm"> Confirm </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { Search, Edit } from "@element-plus/icons-vue";
import { useRouter, useRoute } from "vue-router";
import { ref, toRefs, reactive, defineComponent, onMounted } from "vue";
import VAside from "../../components/Aside.vue";
import axios from "axios";
import { ElMessage, ElMessageBox } from 'element-plus'
export default defineComponent({
  components: {
    Search,
    Edit,
    VAside,
  },
  setup() {
    const router = useRouter();
    const data = reactive({
      addShow: false,
      loading: false,
      dialogVisible: false,
      editManagerVisible: false,
      query: {
        keyword: "",
      },
      tableData: [],
      manager: {},
      managerKeyword: "",
      employees: [],
      managerDepartmentId: "",
      form: {
        name: "",
        manager: {
          name: "",
        },
        leader: {
          name: "",
        },
        parent: {
          name: "",
          id: null,
        },
        describe: "",
      },
    });

    const editRow = () => {}
    const goDetail = (item) => {
      router.push({
        name: "OrgDetail",
        query: {
          id: item.id,
          showAside: 'false'
        },
      });
    };
    const deleteBtn = (item) => {
      console.log(item, 222)
        ElMessageBox.confirm(
          'The org will be deleted. Continue?',
          'Warning',
          {
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancel',
            type: 'warning',
          }
        )
          .then(() => {
            axios
            .delete(`http://127.0.0.1:5015/api/company_structure/delete/${item.id}`)
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
    const getChildren = (id) => {
      // todo ajax 请求
      return [];
    };
    const updataList = () => {
      const params = {
        ...data.form,
        parent_id: data.form.parent.id || null,
      };
      delete params.parent;
      axios
        .post("http://127.0.0.1:5004/api/organization/department", {
          ...params,
        })
        .then((response) => {
          data.addShow = false;
            ElMessage({
              message: "added successfully",
              type: "success",
            });
            data.form = {
              name: "",
              manager: {
                name: "",
              },
              leader: {
                name: "",
              },
              parent: {
                name: "",
                id: null,
              },
              describe: "",
            }
            getList()
        })
        .catch((error) => {
          console.error("Error fetching organization structure:", error);
        });
    };

    // 搜索用户
    const querySearchAsync = (str, callback) => {
      axios
        .get("http://127.0.0.1:5001/api/employee/search", {
          params: { keyword: data.managerKeyword },
        })
        .then((response) => {
          data.employees = response.data;
          callback(response.data);
        })
        .catch((error) => {
          console.error("Error fetching organization structure:", error);
        });
    };
    const getListAsync = (str, callback) => {
      axios
        .get("http://127.0.0.1:5000/api/organization/list", {
          params: { keyword: data.form.parent.name },
        })
        .then((response) => {
          callback(response.data);
        })
        .catch((error) => {
          console.error("Error fetching organization structure:", error);
        });
    };
    const handleSelectManager = (item) => (data.form.manager = { ...item });
    const handleSelectLeader = (item) => (data.form.leader = { ...item });
    const handleSelectParent = (item) => (data.form.parent = { ...item });
    const handleSearch = (item) => {
      console.log(item, 1222);
    };
    // 选择员工做管理员
    const handleSelect = (item) => {
      console.log(item, 12);
      data.managerKeyword = item.name;
      data.manager = { ...item };
    };

    const managerCancel = () => {
      data.manager = {};
      data.editManagerVisible = false;
    };
    const getList = () => {
      axios
        .get("http://127.0.0.1:5000/api/organization/list", {
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
    const managerConfirm = () => {
      // 更新管理员
      axios
        .put(
          `http://127.0.0.1:5002/api/update_manager/${data.managerDepartmentId}`,
          { ...data.manager }
        )
        .then((response) => {
          ElMessage({
            message: "Update manager successful!",
            type: "success",
          });
        })
        .catch((error) => {
          console.error("Error fetching organization structure:", error);
        });
      managerCancel();
    };

    const addNewOrg = () => {
      data.addShow = true;
    };

    const load = (row, treeNode, resolve) => {
      resolve([...row.children]);
    };
    const addCancel = () => {
      data.addShow = false;
    };

    const handleOpen = (key: string, keyPath: string[]) => {
      console.log(key, keyPath);
    };
    const handleClose = (key: string, keyPath: string[]) => {
      console.log(key, keyPath);
    };
    const editManager = (row) => {
      data.managerDepartmentId = row.id;
      data.editManagerVisible = true;
    };

    onMounted(() => {
      getList();
    })

    return {
      load,
      addCancel,
      handleOpen,
      handleClose,
      editManager,
      querySearchAsync,
      handleSelect,
      handleSelectManager,
      handleSelectLeader,
      handleSearch,
      managerCancel,
      managerConfirm,
      addNewOrg,
      getListAsync,
      updataList,
      handleSelectParent,
      goDetail,
      getList,
      deleteBtn,
      editRow,
      Search,
      ...toRefs(data),
    };
  },
});
</script>
<style scoped module="s" lang="scss">
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
}
.searchDv {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background: #adcef1;
  border-radius: 5px;
}
.table {
  // padding: 12px;
  padding-top: 24px;
}
.searchDropTop {
  display: flex;
  justify-content: space-between;
}
.searchDropTop_job {
  color: #80848f;
}
</style>
