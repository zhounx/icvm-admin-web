import Mock from 'mockjs';

const LoginUsers = [
    {
        id: 1,
        username: 'admin',
        password: '123456',
        avatar: 'https://raw.githubusercontent.com/taylorchen709/markdown-images/master/vueadmin/user.png',
        name: 'felixyang'
    }
];

const Plans = [], Channels = [], Goods = [];

// for (let i = 0; i < 86; i++) {
//   Users.push(Mock.mock({
//     id: Mock.Random.guid(),
//     name: Mock.Random.cname(),
//     addr: Mock.mock('@county(true)'),
//     'age|18-60': 1,
//     birth: Mock.Random.date(),
//     sex: Mock.Random.integer(0, 1)
//   }));
// }
for (let i = 0; i < 25; i++) {
    Plans.push(Mock.mock({
        id: i + 1,
        name: `双十一特惠${i + 1}`,
        'channelAmount|10-100': 1,
        'cost|1000-5000': 1,
        goal: i > 2 ? 1 : 0,
        'goodsPool|500-1000': 1,
        time: Mock.Random.date(),
    }));
}
for (let i = 0; i < 28; i++) {
    Channels.push(Mock.mock({
        id: i + 1,
        name: `渠道${i + 1}`,
        plan:'双十一特惠',
        'resource|50-100': 1,
        'good|50-100': 1,
        'rate|50-100': 1,
        'ticket|500-1000': 1,
        ticketPrice:1000,
        'volume|1000-2000': 1,
        volumePrice:2000
    }));
}
for (let i = 0; i < 25; i++) {
    Goods.push(Mock.mock({
        id: i + 1,
        name: `商品${i + 1}`,
        'price|10-100': 1,
        'costPrice|1-5': 1,
        'discount|2-5': 1,
        'stock|1000-5000': 1,
        time: Mock.Random.date(),
        operator: Mock.Random.cname()
    }));
}
export {LoginUsers, Plans, Channels, Goods};
