<template>
    <div class="area">
        <el-tabs v-model="activeName">
            <el-tab-pane label="全部" name="list0" :lazy="true">
                <SingleVipCardTab :section-index="0" :module-index="1"></SingleVipCardTab>
            </el-tab-pane>
            <el-tab-pane label="未支付" name="list1" :lazy="true">
                <SingleVipCardTab :section-index="1" :module-index="1"></SingleVipCardTab>
            </el-tab-pane>
            <el-tab-pane label="支付成功" name="list2" :lazy="true">
                <SingleVipCardTab :section-index="2" :module-index="1"></SingleVipCardTab>
            </el-tab-pane>
            <el-tab-pane label="支付失败" name="list3" :lazy="true">
                <SingleVipCardTab :section-index="3" :module-index="1"></SingleVipCardTab>
            </el-tab-pane>
            <el-tab-pane label="订单取消" name="list4" :lazy="true">
                <SingleVipCardTab :section-index="4" :module-index="1"></SingleVipCardTab>
            </el-tab-pane>
            <el-tab-pane label="已发货" name="list5" :lazy="true">
                <SingleVipCardTab :section-index="5" :module-index="1"></SingleVipCardTab>
            </el-tab-pane>
            <el-tab-pane label="订单完成/已收货" name="list6" :lazy="true">
                <SingleVipCardTab :section-index="6" :module-index="1"></SingleVipCardTab>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
    import "../assets/css/area.less"
    import SingleVipCardTab from '../components/SingleVipCardTab.vue'

    export default {
        name: "OrderListSingleVipCard",
        components: {
            SingleVipCardTab
        },
        data() {
            return {
                activeName: "list0"
            };
        },
        methods: {

        }
    };
</script>