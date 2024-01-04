<template>
    <v-wrapper>
      <template v-slot:rightMain>
        <!-- 搜索框 -->
        <div :class="s.searchDv">
          <div :class="s.queryDv">
            <el-input
              style="width: 240px; height: 40px"
              placeholder="Type something"
              :suffix-icon="Search"
              v-model="query.keyword"
            />
          </div>
          <div :class="s.btnDv">
            <el-button type="primary" plain @click="addNewOrg">Add</el-button>
          </div>
        </div>

        <!-- 表单 -->
        <div :class="s.table">
          <el-table
            :data="tableData"
            height="800"
            :header-cell-style="{
              background: '#eef1f6',
              color: '#606266',
              height: '50px',
            }"
            :row-style="{ height: '50px' }"
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
            lazy
            row-key="id"
            :load="load"
          >
            <el-table-column prop="name" label="name" width="250">
              <template v-slot="{ row }">
                {{ row.name }}
              </template>
            </el-table-column>
            <el-table-column
              prop="number"
              label="Number of members"
              width="180"
            />
            <el-table-column prop="leader" label="leader" width="180"/>
            <el-table-column prop="manager" label="manager" width="180">
              <template v-slot="{ row }">
                {{ row.manager }}
                <el-button type="primary" link @click="editManager(row)">
                  <el-icon><Edit /></el-icon>
                </el-button>
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="Operations" width="100">
              <template #default="row">
                <el-button
                  link
                  type="primary"
                  size="small"
                  @click="editManager(row)"
                >
                  Add
                </el-button>
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
        >
          <el-form :model="form" label-width="80px">
            <el-form-item label="Name">
              <el-input v-model="form.name" />
            </el-form-item>
            <el-form-item label="Org Code">
              <el-input v-model="form.code" />
            </el-form-item>
            <el-form-item label="Type">
              <el-select v-model="form.type" placeholder="please select type">
                <el-option label="type" value="shanghai" />
                <el-option label="type" value="beijing" />
              </el-select>
            </el-form-item>
            <el-form-item label="Manager">
              <el-input v-model="form.manager" />
            </el-form-item>
            <el-form-item label="Leader">
              <el-input v-model="form.leader" />
            </el-form-item>
            <el-form-item label="Desc">
              <el-input v-model="form.desc" type="textarea" />
            </el-form-item>
          </el-form>
        </v-aside>

        <el-dialog
          v-model="editManagerVisible"
          title="Select Manager"
          width="40%"
          :before-close="managerCancel"
        >
          <el-form>
            <el-form-item label="Employee Name">
                <el-autocomplete
                    v-model="managerQuery.manager.name"
                    :fetch-suggestions="querySearchAsync"
                    placeholder="name or ID"
                    @select="handleSelect"
                    :trigger-on-focus="false"
                    style="width: 100%;"
                >
                    <template #suffix>
                        <el-button link :icon="Search" @click="handleSearch" />
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
              <el-button type="primary" @click="managerConfirm">
                Confirm
              </el-button>
            </span>
          </template>
        </el-dialog>

      </template>
    </v-wrapper>
</template>

<script lang="ts">
import { Search, Edit } from "@element-plus/icons-vue";
import { ref, toRefs, reactive, defineComponent, onMounted } from "vue";
import VWrapper from "../../components/Wrapper.vue";
import VAside from "../../components/Aside.vue";
import axios from 'axios';
export default defineComponent({
  components: {
    VWrapper,
    Search,
    Edit,
    VAside,
  },
  setup() {
    const form = reactive({
      name: "",
      mananger: "",
      leader: "",
      type: "",
      desc: "",
      code: "",
    });
    const data = reactive({
      addShow: false,
      loading: true,
      dialogVisible: false,
      editManagerVisible: false,
      query: {
        keyword: "",
        departmentId: ""
      },
      tableData: [],
      managerQuery: {
        manager: {
            code: '',
            name: '',
            position: ''
        },
        departmentId: ""
      },
      
      searchData: [
        { name: 'vue', code: 'E231', position: 'software development' },
        { name: 'element', code: 'E231', position: 'software development' },
        { name: 'cooking', code: 'E231', position: 'software development' },
        { name: 'mint-ui', code: 'E231', position: 'software development' },
        { name: 'vuex', code: 'E231', position: 'software development' },
        { name: 'vue-router', code: 'E231', position: 'software development' },
        { name: 'babel', code: 'E231', position: 'software development' },
    ]
    });
    

    const getChildren = (id) => {
        // todo ajax 请求
        return []
    }

    // 搜索用户
    const querySearchAsync = (str, callback) => {
            // todo 接口调试
        console.log(str, 'str')
        callback(data.searchData)
    }
    const handleSearch = (item) => {
        console.log(item, 1222)
    }
    // 选择员工做管理员
    const handleSelect = (item) => {
        data.managerQuery.manager = {...item}
    }

    const managerCancel = () => {
        data.managerQuery = {
            manager: {
                code: '',
                name: '',
                position: ''
            },
            departmentId: ""
        }
        data.editManagerVisible = false

    }
    const managerConfirm = () => {
        // 
        managerCancel()
    }

    const addNewOrg = () => {
        data.addShow = true
    }

    const load = (
      row,
      treeNode,
      resolve
    ) => {
        // todo
        // getChildren(row.id)
        console.log(row, 1111)
        resolve([...row.children])
    };
    const addCancel = () => {
        data.addShow = false
    };

    const handleOpen = (key: string, keyPath: string[]) => {
      console.log(key, keyPath);
    };
    const handleClose = (key: string, keyPath: string[]) => {
      console.log(key, keyPath);
    };
    const editManager = (row) => {
      data.managerQuery.departmentId = row.departmentId;
      data.editManagerVisible = true;
    }

    onMounted(() => {
        axios.get('http://127.0.0.1:5000/api/organization/list', { params: { ...data.query } })
        .then(response => {
            console.log(response.data, 11)
            data.tableData = response.data;
        })
        .catch(error => {
            console.error('Error fetching organization structure:', error);
        });
        console.log(data.addShow, 'adds')
    })
    return {
      load,
      addCancel,
      handleOpen,
      handleClose,
      editManager,
      querySearchAsync,
      handleSelect,
      handleSearch,
      managerCancel,
      managerConfirm,
      addNewOrg,
      form,
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
}
.table {
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
