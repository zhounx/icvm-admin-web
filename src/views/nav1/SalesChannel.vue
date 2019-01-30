<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.name" placeholder="请输入渠道名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="filters.plan" placeholder="请输入计划名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getChannels">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="channels" highlight-current-row v-loading="listLoading" @selection-change="selsChange"
                  style="width: 100%;">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <!--<el-table-column type="index" width="60">-->
            <!--</el-table-column>-->
            <el-table-column prop="id" label="渠道ID" width="100" sortable>
            </el-table-column>
            <el-table-column prop="name" label="渠道名称" width="200" sortable>
            </el-table-column>
            <el-table-column prop="plan" label="营销计划" min-width="200" sortable>
            </el-table-column>
            <el-table-column prop="resource" label="投放资源位" width="150" sortable>
            </el-table-column>
            <el-table-column prop="good" label="出池商品数" width="150" sortable>
            </el-table-column>
            <el-table-column prop="rate" label="渠道核销率" width="150" :formatter="formatRate" sortable>
            </el-table-column>
            <el-table-column prop="ticketGrid" label="已发放券量/金额" width="200" sortable>
            </el-table-column>
            <el-table-column prop="volumeGrid" label="核销量/金额" width="200" sortable>
            </el-table-column>
            <el-table-column label="操作" width="200">
                <template slot-scope="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
                    <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                    <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">暂停</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
            <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10"
                           :total="total" style="float:right;">
            </el-pagination>
        </el-col>

        <!--修改界面-->
        <el-dialog title="修改" v-model="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
                <el-form-item label="渠道" prop="name">
                    <el-input v-model="editForm.name" auto-complete="off" placeholder="请输入渠道名称"></el-input>
                </el-form-item>
                <el-form-item label="营销计划">
                    <el-select v-model="editForm.plan" placeholder="请选择">
                        <el-option
                                v-for="item in planOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="投放资源位">
                    <el-input-number v-model="editForm.resource" :min="0" :max="20000" placeholder="请输入投放资源位"></el-input-number>
                </el-form-item>
                <el-form-item label="出池商品数">
                    <el-input-number v-model="editForm.good" :min="0" :max="20000" placeholder="请输入出池商品数"></el-input-number>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>

        <!--新增界面-->
        <el-dialog title="新增营销计划" v-model="addFormVisible" :close-on-click-modal="false">
            <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
                <el-form-item label="渠道" prop="name">
                    <el-input v-model="addForm.name" auto-complete="off" placeholder="请输入渠道名称"></el-input>
                </el-form-item>
                <el-form-item label="营销计划">
                    <el-select v-model="addForm.plan" placeholder="请选择">
                        <el-option
                                v-for="item in planOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="投放资源位">
                    <el-input-number v-model="addForm.resource" :min="0" :max="20000" placeholder="请输入投放资源位"></el-input-number>
                </el-form-item>
                <el-form-item label="出池商品数">
                    <el-input-number v-model="addForm.good" :min="0" :max="20000" placeholder="请输入出池商品数"></el-input-number>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>
        <!--<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">-->
        <!--<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">-->
        <!--<el-form-item label="" prop="name">-->
        <!--<el-input v-model="addForm.name" auto-complete="off"></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="性别">-->
        <!--<el-radio-group v-model="addForm.sex">-->
        <!--<el-radio class="radio" :label="1">男</el-radio>-->
        <!--<el-radio class="radio" :label="0">女</el-radio>-->
        <!--</el-radio-group>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="年龄">-->
        <!--<el-input-number v-model="addForm.age" :min="0" :max="200"></el-input-number>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="生日">-->
        <!--<el-date-picker type="date" placeholder="选择日期" v-model="addForm.birth"></el-date-picker>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="地址">-->
        <!--<el-input type="textarea" v-model="addForm.addr"></el-input>-->
        <!--</el-form-item>-->
        <!--</el-form>-->
        <!--<div slot="footer" class="dialog-footer">-->
        <!--<el-button @click.native="addFormVisible = false">取消</el-button>-->
        <!--<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>-->
        <!--</div>-->
        <!--</el-dialog>-->

    </section>
</template>

<script>
    import util from '../../common/js/util'
    //import NProgress from 'nprogress'
    import { removeChannel, batchRemoveChannel, editChannel, addChannel, getChannelListPage} from '../../api/api';

    export default {
        data() {
            return {
                filters: {
                    name: ''
                },
                channels: [],
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
                    name: '',
                    plan: '双十一特惠',
                    resource: 0,
                    good: 0,
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
                    plan: '双十一特惠',
                    resource: 0,
                    good: 0,
                },

                planOptions: [
                    {
                        value: '双十一特惠',
                        label: '双十一特惠',
                    },
                    {
                        value: '双十二特惠',
                        label: '双十二特惠',
                    },
                ],

            }
        },
        methods: {
            //营销目标显示转换
            formatRate: function (row, column) {
                return `${row.rate}%`
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getChannels();
            },
            //获取渠道列表
            getChannels() {
                let para = {
                    page: this.page,
                    name: this.filters.name,
                    plan: this.filters.plan,
                };
                this.listLoading = true;
                //NProgress.start();
                getChannelListPage(para).then((res) => {
                    this.total = res.data.total;
                    this.channels = res.data.channels;
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
                    removeChannel(para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getChannels();
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
                            // para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
                            editChannel(para).then((res) => {
                                this.editLoading = false;
                                //NProgress.done();
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['editForm'].resetFields();
                                this.editFormVisible = false;
                                this.getChannels();
                            });
                        });
                    }
                });
            },

            //新增确定
            addSubmit: function () {
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addLoading = true;
                            //NProgress.start();
                            let para = Object.assign({}, this.addForm);
                            // para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
                            addChannel(para).then((res) => {
                                this.addLoading = false;
                                //NProgress.done();
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['addForm'].resetFields();
                                this.addFormVisible = false;
                                this.getChannels();
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
                    let para = {ids};
                    batchRemoveChannel(para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getChannels();
                    });
                }).catch(() => {

                });
            }
        },
        mounted() {
            // this.getUsers();
            this.getChannels()
        }
    }

</script>

<style scoped>

</style>