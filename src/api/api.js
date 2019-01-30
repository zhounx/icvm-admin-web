import axios from 'axios';

let base = '';

// 登录
export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data); };


export const getUserList = params => { return axios.get(`${base}/user/list`, { params: params }); };


// export const getUserListPage = params => { return axios.get(`${base}/user/listpage`, { params: params }); };
//
// export const removeUser = params => { return axios.get(`${base}/user/remove`, { params: params }); };
//
// export const batchRemoveUser = params => { return axios.get(`${base}/user/batchremove`, { params: params }); };
//
// export const editUser = params => { return axios.get(`${base}/user/edit`, { params: params }); };
//
// export const addUser = params => { return axios.get(`${base}/user/add`, { params: params }); };

// 营销计划管理
export const getPlanListPage = params => { return axios.get(`${base}/plan/queryListPage`, { params: params }); };

export const addPlan = params => { return axios.get(`${base}/plan/add`, { params: params }); };

export const editPlan = params => { return axios.get(`${base}/plan/edit`, { params: params }); };

export const removePlan = params => { return axios.get(`${base}/plan/remove`, { params: params }); };

export const batchRemovePlan = params => { return axios.get(`${base}/plan/batchremove`, { params: params }); };


// 营销渠道管理
export const getChannelListPage = params => { return axios.get(`${base}/channel/queryListPage`, { params: params }); };

export const addChannel = params => { return axios.get(`${base}/channel/add`, { params: params }); };

export const editChannel = params => { return axios.get(`${base}/channel/edit`, { params: params }); };

export const removeChannel = params => { return axios.get(`${base}/channel/remove`, { params: params }); };

export const batchRemoveChannel = params => { return axios.get(`${base}/channel/batchremove`, { params: params }); };

// 营销商品管理
export const getGoodListPage = params => { return axios.get(`${base}/good/queryListPage`, { params: params }); };

export const addGood = params => { return axios.get(`${base}/good/add`, { params: params }); };

export const editGood = params => { return axios.get(`${base}/good/edit`, { params: params }); };

export const removeGood = params => { return axios.get(`${base}/good/remove`, { params: params }); };

export const batchRemoveGood = params => { return axios.get(`${base}/good/batchremove`, { params: params }); };