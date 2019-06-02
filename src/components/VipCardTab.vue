<template>
    <div class="section-tab">
        <el-row v-if="isList">
            <el-table :data="tableData" border style="width: 100%">
                <el-table-column prop="orderSn" label="订单号"></el-table-column>
                <el-table-column prop="receiver" label="姓名"></el-table-column>
                <el-table-column prop="receiverPhone" label="电话"></el-table-column>
                <el-table-column prop="gmtModified" label="时间"></el-table-column>
                <el-table-column prop="province" label="省" align="center" width="100px"></el-table-column>
                <el-table-column prop="city" label="市" align="center" width="100px"></el-table-column>
                <el-table-column prop="region" label="区" align="center" width="100px"></el-table-column>
                <el-table-column prop="receiverAddress" label="地址" align="center"></el-table-column>
                <el-table-column fixed="right" label="操作" width="100">
                    <template slot-scope="scope">
                        <el-button v-if="scope.sectionIndex == 2" @click="deliverChargeOrder(scope.row.orderSn)" type="text" size="small">确认发货</el-button>
                        <el-button @click="exportVipCard(scope.row.orderSn)" type="text" size="small">导出VIP表</el-button>
                        <!--<el-button @click="orderDetail(scope.row.orderSn)" type="text" size="small">查看详情</el-button>-->
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination class="pagination" layout="prev, pager, next" :page-count="totalPage" background @current-change="currentPageChanged">
            </el-pagination>
        </el-row>
    </div>
</template>
<script>
    import "../assets/css/section.less"
    import axios from 'axios'
    import API from '../api/api.js'

    export default {
        name: "VipCardTab",
        components: {
        },
        props: {
            sectionIndex: Number,
            moduleIndex: Number
        },
        created() {

        },
        data() {
            return {
                tableData: [],
                totalPage: 1,
                isList: true,
            }
        },
        mounted() {
            this.pageList(1)
            console.log('===moduleIndex===', this.moduleIndex)
        },
        methods: {
            pageList(cp) {
                console.log('===sectionIndex===' + this.sectionIndex);
                var params;
                if (this.sectionIndex != 0) {
                    params = {
                        pageNum: cp,
                        pageSize: 20,
                        orderType: 'BATCH_VIP',
                        state: this.sectionIndex
                    }
                } else {
                    params = {
                        pageNum: cp,
                        pageSize: 20,
                        orderType: 'BATCH_VIP'
                    }
                }

                axios.get(API.GetChargeOrderList, {
                    params: params
                }).then(res => {
                    console.log('===VIP订单列表===', JSON.stringify(res));

                    this.tableData = res.data.list
                    this.totalPage = res.data.totalPage
                }).catch(() => {
                    this.$message.error('服务器异常！')
                });
            },
            currentPageChanged(cp) {
                this.pageList(cp);
            },
            deliverChargeOrder(orderSn) {
                console.log('===deliverChargeOrder===' + orderSn)
                this.$confirm('是否确认发货?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    axios.post(API.DeliverChargeOrder, {
                        orderSn: orderSn
                    }, {
                        transformRequest: [function (data) {
                            let ret = ''
                            for (let it in data) {
                                ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                            }
                            return ret
                        }]
                    }).then((res) => {
                        console.log('===发货结果===', JSON.stringify(res));
                    }).catch(() => {
                        this.$message.error('服务器异常！')
                    });
                }).catch(() => {
                    // 取消操作
                })
            },
            exportVipCard(orderSn) {
                const elink = document.createElement('a')
                elink.style.display = 'none'
                elink.href = API.ExportVipCard + '?orderSn=' + orderSn
                document.body.appendChild(elink)
                elink.click()
                URL.revokeObjectURL(elink.href) // 释放URL 对象
                document.body.removeChild(elink)
            },
            orderDetail(orderSn) {
                axios.post(API.OrderDetail, {
                    orderSn: orderSn
                }, {
                    transformRequest: [function (data) {
                        let ret = ''
                        for (let it in data) {
                            ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                        }
                        return ret
                    }]
                }).then((res) => {
                    console.log('===详情===', JSON.stringify(res));
                }).catch(() => {
                    this.$message.error('服务器异常！')
                });
            }
        }
    };
</script>