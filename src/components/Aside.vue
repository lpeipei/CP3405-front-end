<template>
    <div>
        <transition name="aside-fade">
            <div v-show="value" :class="s.bg" @click="maskClose"></div>
        </transition>
        <transition :name="slideName" @before-enter="beforeEnter" @after-leave="afterLeave">
            <div v-show="value" :class="wrapperClass" :style="wrapperStyle">
                <div v-if="closable" @click="closeIcon" :class="s.close">
                    <slot name="close">
                        <el-icon :class="s.icon"><Close /></el-icon>
                    </slot>
                </div>
                <div v-if="headerH" :class="s.header" :style="headerStyle">
                    <slot name="header">{{title}}</slot>
                </div>
                <div :class="s.content" :style="contentStyle">
                    <slot></slot>
                </div>
                <div v-if="footerH" :class="s.footer" :style="footerStyle">
                    <slot name="footer">
                        <el-button type="default" style="margin-right: 12px;" @click.stop="close">{{cancelText}}</el-button>
                        <el-button type="primary" :loading="loading" @click.stop="save">{{okText}}</el-button>
                    </slot>
                </div>
            </div>
        </transition>
    </div>
</template>
<script>
import { Close } from '@element-plus/icons-vue'
const addStyle = (styleSheet, id) => {
    let style = document.createElement('style')
    let head = document.head || document.getElementsByTagName('head')[0]
    style.type = 'text/css'
    style.id = id
    if (style.styleSheet) {
        style.styleSheet.cssText = styleSheet
    } else {
        style.appendChild(document.createTextNode(styleSheet))
    }
    head.appendChild(style)
}
const removeStyle = id => {
    // node.remove() polyfill
    ;(function(arr) {
        arr.forEach(function(item) {
            if (item.hasOwnProperty('remove')) {
                return
            }
            Object.defineProperty(item, 'remove', {
                configurable: true,
                enumerable: true,
                writable: true,
                value: function remove() {
                    this.parentNode.removeChild(this)
                }
            })
        })
    })([Element.prototype, CharacterData.prototype, DocumentType.prototype])
    let style = document.querySelector(`#${id}`)
    style && style.remove()
}

export default {
    name: 'VAside',
    props: {
        title: {
            type: String
        },
        // 背景遮罩是否可以点击关闭
        backdrop: {
            type: Boolean,
            default: true
        },
        // 显示方位 left,right
        placement: {
            type: String,
            default: 'right'
        },
        value: {
            type: Boolean,
            default: false
        },
        width: {
            type: Number,
            default: 450
        },
        // header的高度，为0时可以隐藏header
        headerH: {
            type: Number,
            default: 50
        },
        // footer的高度，为0时可以隐藏footer
        footerH: {
            type: Number,
            default: 56
        },
        // 显示header中的关闭
        closable: {
            type: Boolean,
            default: true
        },
        loading: {
            type: Boolean,
            default: false
        },
        // 页面是否可以滚动
        scrollable: {
            type: Boolean,
            default: false
        },
        cancelText: {
            type: String,
            default: '取消'
        },
        okText: {
            type: String,
            default: '确定'
        }
    },
    components: { Close },
    computed: {
        slideName() {
            switch (this.placement) {
                case 'left':
                    return 'aside-left'
                case 'right':
                    return 'aside-right'
                default:
                    return 'aside-fade'
            }
        },
        wrapperStyle() {
            let obj = {}
            obj.width = `${this.width}px`
            return obj
        },
        wrapperClass() {
            let obj = {}
            obj[this.s.warp] = true
            obj[this.s.left] = this.placement === 'left'
            obj[this.s.right] = this.placement === 'right'
            return obj
        },
        headerStyle() {
            let obj = {}
            obj.height = `${this.headerH}px`
            return obj
        },
        contentStyle() {
            let obj = {}
            obj.height = `calc(100% - ${this.headerH}px - ${this.footerH}px)`
            return obj
        },
        footerStyle() {
            let obj = {}
            obj.height = `${this.footerH}px`
            return obj
        },
        styleId() {
            return 'dmui-drawer_' + this._uid
        }
    },
    watch: {
        scrollable(newValue) {
            if (newValue) {
                this.afterLeave()
            } else {
                this.beforeEnter()
            }
        },
        value(val) {
            console.log(val, 111)
            this.$emit('on-visible-change', val)
        }
    },

    methods: {
        beforeEnter() {
            addStyle(`body{position: relative; overflow: hidden; width: calc(100% - 17px);}`, this.styleId)
        },
        afterLeave() {
            removeStyle(this.styleId)
        },
        maskClose() {
            if (!this.backdrop) {
                return
            }
            this.close()
        },
        closeIcon() {
            this.close()
            this.$emit('on-head-close')
        },
        close() {
            console.log(222)
            this.$emit('update:show', false)
            this.$emit('on-close')
        },
        EscClose(e) {
            if (this.value && this.backdrop) {
                if (e.keyCode === 27) {
                    this.close()
                }
            }
        },
        save() {
            this.$emit('save')
        }
    },
    mounted() {
        if (this.value && !this.scrollable) {
            this.beforeEnter()
        }
        document.addEventListener('keydown', this.EscClose)
    },
    beforeDestroy() {
        document.removeEventListener('keydown', this.EscClose)
        this.afterLeave()
    }
}
</script>
<style lang="scss" insertbefore module="s">
.bg {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(55, 55, 55, 0.6);
    z-index: 1000;
}

.warp {
    position: fixed;
    top: 0;
    bottom: 0;
    z-index: 1000;
    overflow: auto;
    background: #fff;
}

.left {
    right: auto;
    left: 0;
    animation: fadeInRight 0.5s 0s 1 both;
}

.right {
    right: 0;
    left: auto;
}

.header {
    padding: 14px 16px;
    font-size: 16px;
    font-weight: bold;
    color: #1c2438;
    border-bottom: 1px solid #f0f4f8;
    text-align: left;
}

.content {
    overflow-y: auto;
    padding: 16px;
}

.footer {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    background: #fff;
    box-shadow: 0 -2px 16px rgba(0, 0, 0, 0.1);
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
}

.close {
    z-index: 1;
    font-size: 20px;
    position: absolute;
    right: 16px;
    overflow: hidden;
    cursor: pointer;
    line-height: 1;
    line-height: 50px;
    height: 50px;
    color: #999;
    transition: color 0.2s ease;

    svg {
        color: #999;
    }

    &:hover,
    &:active,
    &:focus {
        color: #444;

        svg {
            color: #444;
        }
    }
}

</style>
<style lang="scss" insertbefore>
.aside-left-enter-active {
    animation: leftEnter 0.5s 0s 1 both;
}

.aside-left-leave-active {
    animation: leftLeave 0.5s 0s 1 both;
}

.aside-right-leave-active {
    animation: rightLeave 0.5s 0s 1 both;
}

.aside-right-enter-active {
    animation: rightEnter 0.5s 0s 1 both;
}

.aside-fade-enter-active,
.aside-fade-leave-active {
    transition: opacity 0.5s;
}

.aside-fade-enter,
.aside-fade-leave-to {
    opacity: 0;
}

@keyframes rightEnter {
    from {
        transform: translate3d(100%, 0, 0);
    }

    to {
        transform: none;
    }
}

@keyframes rightLeave {
    from {
        transform: none;
    }

    to {
        transform: translate3d(100%, 0, 0);
    }
}

@keyframes leftEnter {
    from {
        transform: translate3d(-100%, 0, 0);
    }

    to {
        transform: none;
    }
}

@keyframes leftLeave {
    from {
        transform: none;
    }

    to {
        transform: translate3d(-100%, 0, 0);
    }
}
</style>