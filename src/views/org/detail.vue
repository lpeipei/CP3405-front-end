<template>
    <div>
        <el-page-header @back="goBack">
            <template #content>
                <span class="text-large font-600 mr-3"> Detail </span>
            </template>
        </el-page-header>
        <el-container :class="s.container">
            <el-aside width="200px" :class="s.aside">
                <!-- todo -->
            </el-aside>
            <el-main>
                <div :class="s.mainHeader">
                    <div :class="s.nameDv">
                        <p :class="s.title">Company name</p>
                        <el-button type="primary" plain>manage</el-button>
                    </div>
                    <div :class="s.hSubDv">
                        <div :class="s.hSupOrg">
                            <span :class="s.hSupOrgLabel">superior organization: </span>
                            <span :class="s.hSupOrgName">Company</span>
                        </div>
                        <div :class="s.hNumOrg">
                            <p>manager: <span style="color: #f90;">no manager</span></p>
                            <p style="margin-top: 8px;">There are <span style="color: #f90;">12</span> members in the organization</p>
                        </div>
                    </div>
                </div>
                <ul :class="s.menu">
                    <li :class="[s.menuItem, s.menuItemActive]">
                        Department Employees
                    </li>
                    <li :class="s.menuItem">
                        <el-input
                            style="width: 240px; height: 40px"
                            placeholder="Search for a user"
                            :suffix-icon="Search"
                            v-model="queryInput"
                        />
                    </li>
                </ul>
                <el-table 
                :data="tableData"
                :header-cell-style="{
                    color: '#606266',
                    height: '60px',
                }"
                :row-style="{ height: '60px' }"
                >
                    <el-table-column prop="name" label="name" width="180" />
                    <el-table-column prop="position" label="position" width="240" />
                    <el-table-column prop="email" label="email" />
                    <el-table-column prop="phone" label="mobile phone" />
                </el-table>
            </el-main>
        </el-container>
    </div>
</template>
<script>
import { ref, toRefs, reactive, defineComponent } from "vue";
import { Search } from "@element-plus/icons-vue";
import { useRouter } from 'vue-router'
export default defineComponent({
    setup() {
        const router = useRouter();
        const goBack = () => {
            router.back(-1)
        }
        const queryInput = ref('')
        const data = reactive({
            activeIndex: '1',
            tableData: [
                {
                    name: 'Tom',
                    position: 'Software Development Engineer',
                    email: 'axxxxx@gmail.com',
                    phone: '8888888',
                },
                {
                    name: 'Tom',
                    position: 'Software Development Engineer',
                    email: 'axxxxx@gmail.com',
                    phone: '8888888',
                },
                {
                    name: 'Tom',
                    position: 'Software Development Engineer',
                    email: 'axxxxx@gmail.com',
                    phone: '8888888',
                },
                {
                    name: 'Tom',
                    position: 'Software Development Engineer',
                    email: 'axxxxx@gmail.com',
                    phone: '8888888',
                }
            ]
        })
        return {
            goBack,
            ...toRefs(data),
            Search,
            queryInput
        }
    },
})
</script>
<style scoped module="s" lang="scss">
.container {
    padding-top: 32px;
    margin: 0 auto;
    .aside {
        
    }
    .mainHeader {
        padding: 32px;
        border: 1px solid #e1e6eb;
        border-radius: 5px;
        .nameDv {
            display: flex;
            justify-content: space-between;
            align-items: center;
            .title {
                font-weight: 400;
                font-size: 20px;
                color: #1c2438;
            }
        }
        .hSubDv {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 32px;
            font-size: 14px;
            .hSupOrgLabel {
                color: #80848f;
                margin-right: 8px;
            }
            .hSupOrgName {
                color: #1c2438;
            }
            .hNumOrg {
                color: #495060;
            }
        }
    }
    .menu {
        margin-top: 32px;
        border-bottom: solid 1px #ccc;
        display: flex;
        flex-wrap: nowrap;
        height: 60px;
        padding: 0;
        justify-content: space-between;
        li {
            list-style: none;
        }
        .menuItemActive {
            border-bottom: 2px solid #409eff;
            color: #409eff;
        }
        .menuItem {
            display: inline-flex;
            justify-content: center;
            align-items: center;
            height: 100%;
            margin: 0;
            cursor: pointer;
            position: relative;
            transition: border-color var(--el-transition-duration),background-color var(--el-transition-duration),color var(--el-transition-duration);
            box-sizing: border-box;
            white-space: nowrap;
        }
    }
    .flex_grow {
        flex-grow: 1;
    }
    .table {
        // margin-top: 24px;
    }
}


</style>