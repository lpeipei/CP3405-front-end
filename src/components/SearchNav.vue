<template>
    <ul :class="[s.navigation]">
        <li :class="liClass(arr1)" :style="{ flexGrow: tab.one }">
            <template v-for="(item, idx) of arr1">
                <div
                    v-if="arr1.length === max + 1 || idx < max"
                    :key="idx"
                    :class="[s.hover, item.type === 0 ? s.contentTwo : '']"
                    @click="setCondition(item)"
                >
                    <div :class="contentClass(item)">
                        <div :class="s.title">{{ item.title }}</div>
                        <span
                            :class="{
                                [s.highlight]: item.type === 0,
                                [s.value]: true
                            }"
                        >
                            {{ item.value }}
                        </span>
                    </div>
                </div>
            </template>
        </li>
        <li :class="liClass(arr2)" :style="{ flexGrow: tab.two }">
            <div v-for="(item, idx) of arr2" :key="idx" :class="s.hover" @click="setCondition(item)">
                <div :class="contentClass(item)">
                    <div :class="s.title">{{ item.title }}</div>
                    <span :class="s.value">
                        {{ item.value }}
                    </span>
                </div>
            </div>
        </li>
    </ul>
</template>
<script>
import axios from "axios";
export default {
    data() {
        return {
            title: '',
            max: 6,
            total: 0,
            acctiveType: 0,
            arr1: [
                {title: 'All', value: 0, type: 0},
                {title: 'Full-time', value: 0, type: 1},
                {title: 'Part-time', value: 0, type: 2}
                ], // 第一个tab
            arr2: [
                {title: 'Confirming', value: 0, type: 3},
                {title: 'Leaving', value: 0, type: 4},
                {title: 'Separated', value: 0, type: 5}
            ], // 第二个tab
            exeption: {} // 异常员工
        }
    },
    computed: {
        tab() {
            const {
                max,
                arr1: { length: arr1Len },
                arr2: { length: arr2Len }
            } = this
            let one = 5
            if (arr1Len) one = arr1Len > max ? max + 1 : arr1Len + 1
            return {
                one,
                two: arr2Len || 3
            }
        }
    },
    methods: {
        getList() {
            axios
            .get("http://127.0.0.1:5008/api/status/list")
            .then((response) => {
                let total = 0
                for(let i  = 0; i < response.data.length; i++) {
                    total = response.data[i].number + total
                    for(let j = 0; j < this.arr1.length; j++) {
                        if (this.arr1[j].type == response.data[i].value) {
                            this.arr1[j].value = response.data[i].number
                        }
                    }
                    for(let j = 0; j < this.arr2.length; j++) {
                        if (this.arr2[j].type == response.data[i].value) {
                            this.arr2[j].value = response.data[i].number
                        }
                    }
                }
                const allIndex = this.arr1.findIndex((element) => element.type == 0)
                this.arr1[allIndex].value = total

            })
            .catch((error) => {
            console.error("Error fetching organization structure:", error);
            });
        },
        liClass(arr) {
            return {
                [this.s.defStyle]: true,
                [this.s.sk]: !arr.length,
                [this.s.group]: !!arr.length,
                [this.s.active]: arr.some(item => item.type === this.acctiveType)
            }
        },
        contentClass(item) {
            return {
                [this.s.content]: true,
                [this.s.contentActiva]: item.type === this.acctiveType
            }
        },
        setDropCondition(item) {
            this.setQuery({
                type: item.type
            })
        },
        setCondition(item) {
            this.acctiveType = item.type
            this.$emit('on-change-status', item)
        },
    },
    mounted: function(){
        this.getList()
    }
}
</script>
<style module="s" lang="scss">
.navigation {
    display: flex;
    padding: 0;
}

.defStyle {
    position: relative;
    display: flex;
    flex: 1;
    align-items: center;
    justify-items: center;
    height: 100px;
    margin-right: 20px;
    overflow: hidden;
    text-align: center;
    border-radius: 4px;
    &:last-child {
        margin-right: 0;
    }
    &.sk {
        background: #f5f8fa;
    }
    &.group {
        border: 1px solid #e1e6eb;
        box-shadow: 0 0 6px rgba(0, 0, 0, 0.1);

        &::after {
            position: absolute;
            right: -4px;
            bottom: -4px;
            border: 8px solid transparent;
            border-left: 8px solid #e1e6eb;
            transform: rotate(45deg);
            content: '';
        }

        &.active {
            border-color: #409EFF;

            &::after {
                border-left-color: #409EFF;
            }
        }

        .hover {
            flex: 1;
            padding: 25px 0;
            cursor: pointer;

            &:last-child {
                .content {
                    border-right: none;
                }
            }

            &:hover {
                background-color: rgba(61, 129, 202, 0.15);
            }
        }

        .content {
            height: 50px;
            padding-right: 1px;
            border-right: 1px solid #e1e6eb;

            .value {
                display: inline-block;
                padding-top: 20px;
            }

            .drop {
                display: flex;
                align-items: center;
                justify-content: center;
                height: 22px;
                margin-top: 8px;

                span {
                    display: inline-block;
                    flex: 1;
                    width: 5px;
                    height: 5px;
                    margin: 0 3px;
                    background-color: #bbbec4;
                    border-radius: 50%;
                }

                &:hover {
                    span {
                        background-color: #409EFF;
                    }
                }
            }
        }

        .contentTwo {
            flex: 2;
            padding: 15px 0;
            font-size: 16px;
            line-height: 60px;

            .highlight {
                padding: 0 10px;
                font-weight: bold;
                font-size: 30px;
            }

            .title {
                display: inline-block;
                vertical-align: middle;
            }

            .content {
                display: flex;
                align-items: baseline;
                justify-content: center;
                height: 70px;
            }
        }

        .contentActiva {
            color: #409EFF;

            .icon {
                color: #409EFF;
            }

            .drop {
                color: #409EFF;
            }
        }
    }
}

@for $i from 1 through 8 {
    .group#{$i} {
        flex-grow: $i;
    }
}
</style>
