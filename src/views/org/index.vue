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
              v-model="queryInput"
            />
          </div>
          <div :class="s.btnDv">
            <el-button type="primary" plain>Search</el-button>
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
            <el-table-column prop="type" label="type" width="180" />
            <el-table-column
              prop="number"
              label="Number of members"
              width="158"
            />
            <el-table-column prop="leader" label="leader" />
            <el-table-column prop="mananger" label="mananger" width="100">
              <template v-slot="{ row }">
                {{ row.mananger }}
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
                  @click="editManager(scope)"
                >
                  Add
                </el-button>
              </template>
            </el-table-column>
        </el-table>
        </div>
        <v-aside
          v-show="show"
          :loading="loading"
          title="Add New Org"
          ok-text="Confirm"
          cancel-text="Cancel"
          @on-cancel="cancel"
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
          v-model="dialogVisible"
          title="Change manager"
          width="30%"
          :before-close="dialogCancel"
        >
          <el-form>
            <el-form-item label="Employee Name">
              <el-input v-model="form.name" />
            </el-form-item>
          </el-form>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="dialogCancel">Cancel</el-button>
              <el-button type="primary" @click="dialogVisible = false">
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
import { ref, toRefs, reactive, defineComponent } from "vue";
import VWrapper from "../../components/Wrapper.vue";
import VAside from "../../components/Aside.vue";
interface User {
  mananger: string;
  leader: string;
  name: string;
  type: string;
  hasChildren?: boolean;
  number: string;
  id: number;
  children?: User[];
}
export default defineComponent({
  components: {
    VWrapper,
    Search,
    Edit,
    VAside,
  },
  setup() {
    const queryInput = ref("");
    const form = reactive({
      name: "",
      mananger: "",
      leader: "",
      type: "",
      desc: "",
      code: "",
    });
    const data = reactive({
      show: true,
      loading: true,
      dialogVisible: false,
    });
    const tableData: User[] = [
      {
        name: "company",
        type: "department",
        number: "189",
        leader: "Tom",
        mananger: "Jerry",
        hasChildren: true,
        id: 1,
        children: [
          {
            name: "IT",
            type: "team",
            number: "120",
            leader: "Tom",
            mananger: "Jerry",
            id: 31,
          },
          {
            name: "IT",
            type: "team",
            number: "120",
            leader: "Tom",
            mananger: "Jerry",
            id: 32,
          },
        ],
      },
      {
        name: "IT",
        type: "team",
        number: "120",
        leader: "Tom",
        mananger: "Jerry",
        id: 2,
      },
      {
        name: "company",
        type: "department",
        number: "189",
        leader: "Tom",
        mananger: "Jerry",
        id: 3,
      },
      {
        name: "IT",
        type: "team",
        number: "120",
        leader: "Tom",
        mananger: "Jerry",
        id: 4,
      },
    ];

    const load = (
      row: User,
      treeNode: unknown,
      resolve: (date: User[]) => void
    ) => {
      setTimeout(() => {
        resolve([
          {
            name: "IT",
            type: "team",
            number: "120",
            leader: "Tom",
            mananger: "Jerry",
            id: 31,
          },
          {
            name: "IT",
            type: "team",
            number: "120",
            leader: "Tom",
            mananger: "Jerry",
            id: 32,
          },
        ]);
      }, 1000);
    };
    const cancel = () => (data.show = !data.show);

    const handleOpen = (key: string, keyPath: string[]) => {
      console.log(key, keyPath);
    };
    const handleClose = (key: string, keyPath: string[]) => {
      console.log(key, keyPath);
    };
    const editManager = (row) => {
      console.log(row);
      data.dialogVisible = true;
    };
    const dialogCancel = () => {
      data.dialogVisible = false;
    };
    return {
      load,
      cancel,
      handleOpen,
      handleClose,
      editManager,
      dialogCancel,
      tableData,
      form,
      queryInput,
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
</style>
