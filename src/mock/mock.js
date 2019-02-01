import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {LoginUsers, Plans, Channels, Goods} from './data/mockData';

let  _Plans=Plans, _Channels=Channels, _Goods=Goods;

let perPage = 20

export default {
    /**
     * mock bootstrap
     */
    bootstrap() {
        let mock = new MockAdapter(axios);

        // mock success request
        mock.onGet('/success').reply(200, {
            msg: 'success'
        });

        // mock error request
        mock.onGet('/error').reply(500, {
            msg: 'failure'
        });

        //登录
        mock.onPost('/login').reply(config => {
            let {username, password} = JSON.parse(config.data);
            return new Promise((resolve, reject) => {
                let user = null;
                setTimeout(() => {
                    let hasUser = LoginUsers.some(u => {
                        if (u.username === username && u.password === password) {
                            user = JSON.parse(JSON.stringify(u));
                            user.password = undefined;
                            return true;
                        }
                    });

                    if (hasUser) {
                        resolve([200, {code: 200, msg: '请求成功', user}]);
                    } else {
                        resolve([200, {code: 500, msg: '账号或密码错误'}]);
                    }
                }, 1000);
            });
        });

        //获取用户列表
        // mock.onGet('/user/list').reply(config => {
        //     let {name} = config.params;
        //     let mockUsers = _Users.filter(user => {
        //         if (name && user.name.indexOf(name) === -1) return false;
        //         return true;
        //     });
        //     return new Promise((resolve, reject) => {
        //         setTimeout(() => {
        //             resolve([200, {
        //                 users: mockUsers
        //             }]);
        //         }, 1000);
        //     });
        // });


        //新增计划
        mock.onGet('/plan/add').reply(config => {
            let {name,cost,goal,goodsPool } = config.params;
            _Plans.push({
                name,
                cost,
                goal,
                goodsPool
            });
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        code: 200,
                        msg: '新增成功'
                    }]);
                }, 500);
            });
        });
        //删除计划
        mock.onGet('/plan/remove').reply(config => {
            let {id} = config.params;
            _Plans = _Plans.filter(item => item.id !== id);
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        code: 200,
                        msg: '删除成功'
                    }]);
                }, 500);
            });
        });
        //批量删除计划
        mock.onGet('/plan/batchremove').reply(config => {
            let {ids} = config.params;
            ids = ids.split(',');
            ids = ids.map(item=>Number.parseInt(item))
            _Plans = _Plans.filter(u => !ids.includes(u.id));
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        code: 200,
                        msg: '删除成功'
                    }]);
                }, 500);
            });
        });
        //编辑计划
        mock.onGet('/plan/edit').reply(config => {
            let {name,id} = config.params;
            _Plans.some(item => {
                if (item.id === id) {
                    item.name = name;
                    return true;
                }
            });
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        code: 200,
                        msg: '编辑成功'
                    }]);
                }, 500);
            });
        });
        //获取营销计划列表（分页）
        mock.onGet('/plan/queryListPage').reply(config => {
            let {page, name,goal} = config.params;
            let mockPlans = _Plans.filter(plan => {
                console.log(plan.goal,goal)
                if (name && plan.name.indexOf(name) === -1 && goal!=undefined && plan.goal==goal) return false;
                return true;
            });
            let total = mockPlans.length;
            mockPlans = mockPlans.filter((u, index) => index < perPage * page && index >= perPage * (page - 1));
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        total: total,
                        plans: mockPlans
                    }]);
                }, 1000);
            });
        });

        //新增渠道
        mock.onGet('/channel/add').reply(config => {
            let {name,plan,resource,good } = config.params;
            _Channels.push({
                name,
                plan,
                resource,
                good
            });
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        code: 200,
                        msg: '新增成功'
                    }]);
                }, 500);
            });
        });
        //删除渠道
        mock.onGet('/channel/remove').reply(config => {
            let {id} = config.params;
            _Channels = _Channels.filter(item => item.id !== id);
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        code: 200,
                        msg: '删除成功'
                    }]);
                }, 500);
            });
        });
        //批量删除渠道
        mock.onGet('/channel/batchremove').reply(config => {
            let {ids} = config.params;
            ids = ids.split(',');
            ids = ids.map(item=>Number.parseInt(item))
            _Channels = _Channels.filter(u => !ids.includes(u.id));
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        code: 200,
                        msg: '删除成功'
                    }]);
                }, 500);
            });
        });
        //编辑渠道
        mock.onGet('/channel/edit').reply(config => {
            let {name,plan,resource,good,id} = config.params;
            _Channels.some(item => {
                if (item.id === id) {
                    item.name = name;
                    item.plan = plan;
                    item.resource = resource;
                    item.good = good;
                    return true;
                }
            });
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        code: 200,
                        msg: '编辑成功'
                    }]);
                }, 500);
            });
        });
        //获取营销渠道列表（分页）
        mock.onGet('/channel/queryListPage').reply(config => {
            let {page, name} = config.params;
            let mockChannels = _Channels.filter(channel => {
                channel.ticketGrid = `${channel.ticket}/${channel.ticketPrice}`
                channel.volumeGrid = `${channel.volume}/${channel.volumePrice}`
                if (name && channel.name.indexOf(name) === -1) return false;
                return true;
            });
            let total = mockChannels.length;
            mockChannels = mockChannels.filter((u, index) => index < perPage * page && index >= perPage * (page - 1));
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        total: total,
                        channels: mockChannels
                    }]);
                }, 1000);
            });
        });

        //新增商品
        mock.onGet('/good/add').reply(config => {
            let {name,price,gpr,stock } = config.params;
            _Goods.push({
                name,
                price,
                gpr,
                stock
            });
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        code: 200,
                        msg: '新增成功'
                    }]);
                }, 500);
            });
        });
        //删除商品
        mock.onGet('/good/remove').reply(config => {
            let {id} = config.params;
            _Goods = _Goods.filter(item => item.id !== id);
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        code: 200,
                        msg: '删除成功'
                    }]);
                }, 500);
            });
        });
        //批量删除商品
        mock.onGet('/good/batchremove').reply(config => {
            let {ids} = config.params;
            ids = ids.split(',');
            ids = ids.map(item=>Number.parseInt(item))
            _Goods = _Goods.filter(u => !ids.includes(u.id));
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        code: 200,
                        msg: '删除成功'
                    }]);
                }, 500);
            });
        });
        //编辑商品
        mock.onGet('/good/edit').reply(config => {
            let {name,price,gpr,stock,id} = config.params;
            _Goods.some(item => {
                if (item.id === id) {
                    item.name = name;
                    item.price = price;
                    item.gpr = gpr;
                    item.stock = stock;
                    return true;
                }
            });
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        code: 200,
                        msg: '编辑成功'
                    }]);
                }, 500);
            });
        });
        //获取商品列表（分页）
        mock.onGet('/good/queryListPage').reply(config => {
            let {page, name} = config.params;
            let mockGoods = _Goods.filter(good => {
                if (name && good.name.indexOf(name) === -1) return false;
                return true;
            });
            let total = mockGoods.length;
            mockGoods = mockGoods.filter((u, index) => index < perPage * page && index >= perPage * (page - 1));
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        total: total,
                        goods: mockGoods
                    }]);
                }, 1000);
            });
        });
    }
};