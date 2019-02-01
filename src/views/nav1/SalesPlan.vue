<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.name" placeholder="请输入计划名称"></el-input>
                </el-form-item>
                <el-form-item label="营销目标">
                <el-select v-model="filters.goal" placeholder="请选择">
                <el-option
                v-for="item in goalOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
                </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getPlans">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="plans" highlight-current-row v-loading="listLoading" @selection-change="selsChange"
                  style="width: 100%;">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <!--<el-table-column type="index" width="60">-->
            <!--</el-table-column>-->
            <el-table-column prop="id" label="计划ID" width="100" sortable>
            </el-table-column>
            <el-table-column prop="name" label="计划名称" min-width="200" sortable>
            </el-table-column>
            <el-table-column prop="adAmount" label="广告数量" width="200" sortable>
            </el-table-column>
            <el-table-column prop="cost" label="营销费用" width="150" sortable>
            </el-table-column>
            <el-table-column prop="goal" label="营销目标" width="150" :formatter="formatGoal" sortable>
            </el-table-column>
            <el-table-column prop="goodsPool" label="营销商品池" width="150" sortable>
            </el-table-column>
            <el-table-column prop="time" label="操作时间" width="150" sortable>
            </el-table-column>
            <el-table-column label="操作" width="150">
                <template slot-scope="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
                    <!--<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>-->
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
                <el-form-item label="计划名称" prop="name">
                    <el-input v-model="editForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <!--<el-form-item label="营销费用">-->
                    <!--<el-input-number v-model="editForm.cost" :min="0" :max="20000"></el-input-number>-->
                <!--</el-form-item>-->
                <!--<el-form-item label="营销目标">-->
                    <!--<el-select v-model="editForm.goal" placeholder="请选择">-->
                        <!--<el-option-->
                                <!--v-for="item in goalOptions"-->
                                <!--:key="item.value"-->
                                <!--:label="item.label"-->
                                <!--:value="item.value">-->
                        <!--</el-option>-->
                    <!--</el-select>-->
                <!--</el-form-item>-->
                <!--<el-form-item label="营销商品池">-->
                    <!--<el-select v-model="editForm.goodsPool" placeholder="请选择">-->
                        <!--<el-option-->
                                <!--v-for="item in poolOptions"-->
                                <!--:key="item.value"-->
                                <!--:label="item.label"-->
                                <!--:value="item.value">-->
                        <!--</el-option>-->
                    <!--</el-select>-->
                <!--</el-form-item>-->
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>

        <!--新增界面-->
        <el-dialog title="新增营销计划" v-model="addFormVisible" :close-on-click-modal="false">
            <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
                <el-form-item label="计划名称" prop="name">
                    <el-input v-model="addForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="营销费用">
                    <el-input-number v-model="addForm.cost" :min="0" :max="20000"></el-input-number>
                </el-form-item>
                <el-form-item label="营销目标">
                    <el-select v-model="addForm.goal" placeholder="请选择">
                        <el-option
                                v-for="item in goalOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="营销商品池">
                    <el-select v-model="addForm.goodsPool" placeholder="请选择">
                        <el-option
                                v-for="item in poolOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
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
    import { removePlan, batchRemovePlan, editPlan, addPlan, getPlanListPage} from '../../api/api';

    export default {
        data() {
            return {
                filters: {
                    name: '',
                    goal:''
                },
                plans: [],
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
                    // cost: -1,
                    // goal: 1,
                    // goodsPool: 100,
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
                    cost: -1,
                    goal: 1,
                    goodsPool: 100,
                },

                goalOptions: [
                    {
                        value: '1',
                        label: '利润',
                    },
                    {
                        value: '0',
                        label: '非利润',
                    },
                ],
                poolOptions: [
                    {
                        value: '100',
                        label: '100',
                    },
                    {
                        value: '200',
                        label: '200',
                    },
                ],

            }
        },
        components:{

        },
        methods: {
            //营销目标显示转换
            formatGoal: function (row, column) {
                return row.goal == 1 ? '利润' : row.goal == 0 ? '非利润' : '未知';
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getPlans();
            },
            //获取用户列表
            // getUsers() {
            //     let para = {
            //         page: this.page,
            //         name: this.filters.name
            //     };
            //     this.listLoading = true;
            //     //NProgress.start();
            //     getUserListPage(para).then((res) => {
            //         this.total = res.data.total;
            //         this.users = res.data.users;
            //         this.listLoading = false;
            //         //NProgress.done();
            //     });
            //
            // },
            getPlans() {
                let para = {
                    page: this.page,
                    name: this.filters.name,
                    goal:this.filters.goal
                };
                this.listLoading = true;
                //NProgress.start();
                getPlanListPage(para).then((res) => {
                    this.total = res.data.total;
                    this.plans = res.data.plans;
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
                    removePlan(para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getPlans();
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
                            editPlan(para).then((res) => {
                                this.editLoading = false;
                                //NProgress.done();
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['editForm'].resetFields();
                                this.editFormVisible = false;
                                this.getPlans();
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
                            addPlan(para).then((res) => {
                                this.addLoading = false;
                                //NProgress.done();
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['addForm'].resetFields();
                                this.addFormVisible = false;
                                this.getPlans();
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
                    batchRemovePlan(para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getPlans();
                    });
                }).catch(() => {

                });
            }
        },
        mounted() {
            // this.getUsers();
            this.getPlans()
        }
    }

</script>

<style scoped>

</style>