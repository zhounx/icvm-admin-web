<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.name" placeholder="请输入商品名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getGoods">查询</el-button>
                </el-form-item>
                <!--<el-form-item>-->
                <!--<el-button type="primary" @click="handleAdd">新增</el-button>-->
                <!--</el-form-item>-->
                <el-popover
                        placement="right"
                        width="200"
                        trigger="click">
                    <el-button slot="reference">商品录入</el-button>
                    <el-button type="primary" @click="handleAdd">单个录入</el-button>
                    <el-button type="primary" @click="handleAdd">Excel导入</el-button>
                </el-popover>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="goods" highlight-current-row v-loading="listLoading" @selection-change="selsChange"
                  style="width: 100%;">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <!--<el-table-column type="index" width="60">-->
            <!--</el-table-column>-->
            <el-table-column prop="id" label="商品ID" width="100" sortable hidden>
            </el-table-column>
            <el-table-column prop="name" label="商品名称" min-width="200" sortable>
            </el-table-column>
            <el-table-column prop="price" label="售价" width="200" :formatter="formatPrice" sortable>
            </el-table-column>
            <!--<el-table-column prop="costPrice" label="成本" width="150" :formatter="formatPrice" sortable>-->
            <!--</el-table-column>-->
            <el-table-column prop="gpr" label="毛利率" width="150" :formatter="formatPercent" sortable>
            </el-table-column>
            <el-table-column prop="stock" label="库存数量" width="150" sortable>
            </el-table-column>
            <el-table-column prop="time" label="操作时间" width="150" sortable>
            </el-table-column>
            <el-table-column prop="operator" label="操作人" width="150" sortable>
            </el-table-column>
            <el-table-column label="操作" width="150">
                <template slot-scope="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
                    <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
            <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20"
                           :total="total" style="float:right;">
            </el-pagination>
        </el-col>

        <!--编辑界面-->
        <el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
                <el-form-item label="商品名称" prop="name">
                    <el-input v-model="editForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="售价">
                    <el-input-number v-model="editForm.price" :min="0" :max="999999"></el-input-number>
                </el-form-item>
                <el-form-item label="毛利率">
                    <el-input-number v-model="editForm.gpr" :min="-100" :max="100"></el-input-number>
                </el-form-item>
                <el-form-item label="库存数量">
                    <el-input-number v-model="editForm.stock" :min="0" :max="999999"></el-input-number>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>

        <!--新增界面-->
        <el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
            <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
                <el-form-item label="商品名称" prop="name">
                    <el-input v-model="editForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="售价">
                    <el-input-number v-model="editForm.price" :min="0" :max="999999"></el-input-number>
                </el-form-item>
                <el-form-item label="毛利率">
                    <el-input-number v-model="editForm.gpr" :min="-100" :max="100"></el-input-number>
                </el-form-item>
                <el-form-item label="库存数量">
                    <el-input-number v-model="editForm.stock" :min="0" :max="999999"></el-input-number>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import util from '../../common/js/util'
    //import NProgress from 'nprogress'
    import {removeGood, batchRemoveGood, editGood, addGood, getGoodListPage} from '../../api/api';

    export default {
        data() {
            return {
                filters: {
                    name: ''
                },
                goods: [],
                total: 0,
                page: 1,
                listLoading: false,
                sels: [],//列表选中列

                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                editFormRules: {
                    name: [
                        {required: true, message: '请输入姓名', trigger: 'blur'}
                    ]
                },
                //编辑界面数据
                editForm: {
                    id: 0,
                    name: '',
                    price: -1,
                    gpr: 0,
                    stock: '',
                },

                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                addFormRules: {
                    name: [
                        {required: true, message: '请输入姓名', trigger: 'blur'}
                    ]
                },
                //新增界面数据
                addForm: {
                    name: '',
                    price: -1,
                    gpr: 0,
                    stock: '',
                }

            }
        },
        methods: {
            //价格显示转换
            formatPrice: function (row, column) {
                let value = row.price || row.costPrice || row.discount
                return `￥ ${value}`
            },
            //百分比显示转换
            formatPercent: function (row, column) {
                let value = row.gpr
                return `${value}%`
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getGoods();
            },
            getGoods() {
                let para = {
                    page: this.page,
                    name: this.filters.name
                };
                this.listLoading = true;
                //NProgress.start();
                getGoodListPage(para).then((res) => {
                    this.total = res.data.total;
                    this.goods = res.data.goods;
                    this.listLoading = false;
                    //NProgress.done();
                });
            },
            //删除
            handleDel: function (index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    let para = {id: row.id};
                    removeGood(para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getGoods();
                    });
                }).catch(() => {

                });
            },
            //显示编辑界面
            handleEdit: function (index, row) {
                this.editFormVisible = true;
                this.editForm = Object.assign({}, row);
            },
            //显示新增界面
            handleAdd: function () {
                this.addFormVisible = true;
                this.addForm = {
                    name: '',
                    sex: -1,
                    age: 0,
                    birth: '',
                    addr: ''
                };
            },
            //编辑
            editSubmit: function () {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editLoading = true;
                            //NProgress.start();
                            let para = Object.assign({}, this.editForm);
                            editGood(para).then((res) => {
                                this.editLoading = false;
                                //NProgress.done();
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['editForm'].resetFields();
                                this.editFormVisible = false;
                                this.getGoods();
                            });
                        });
                    }
                });
            },
            //新增
            addSubmit: function () {
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addLoading = true;
                            //NProgress.start();
                            let para = Object.assign({}, this.addForm);
                            addGood(para).then((res) => {
                                this.addLoading = false;
                                //NProgress.done();
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['addForm'].resetFields();
                                this.addFormVisible = false;
                                this.getGoods();
                            });
                        });
                    }
                });
            },
            selsChange: function (sels) {
                this.sels = sels;
            },
            //批量删除
            batchRemove: function () {
                var ids = this.sels.map(item => item.id).toString();
                this.$confirm('确认删除选中记录吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    let para = {ids: ids};
                    batchRemoveGood(para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getGoods();
                    });
                }).catch(() => {

                });
            }
        },
        mounted() {
            this.getGoods();
        }
    }

</script>

<style scoped>

</style>