import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import SalesPlan from './views/nav1/SalesPlan.vue'
import SalesGoods from './views/nav3/SalesGoods.vue'
import Advertisement from './views/nav2/Advertisement.vue'
import echarts from './views/charts/echarts.vue'

let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    {
        path: '/',
        component: Home,
        name: '营销计划管理',
        iconCls: 'el-icon-message',//图标样式class
        children: [
            {
                path: '/salesPlan', component: SalesPlan, name: '营销计划管理'
            },

        ]
    },
    {
        path: '/',
        component: Home,
        name: '广告管理',
        iconCls: 'el-icon-more',//图标样式class
        children: [
            { path: '/advertisement', component: Advertisement, name: '广告管理' },
        ]
    },

    {
        path: '/',
        component: Home,
        name: '营销商品管理',
        iconCls: 'el-icon-menu',//图标样式class
        children: [
            { path: '/goods', component: SalesGoods, name: '商品管理' },
            { path: '/goodsCollection', component: SalesGoods, name: '商品集合管理' },
        ]
    },
    // {
    //     path: '/',
    //     component: Home,
    //     name: '导航二',
    //     iconCls: 'fa fa-id-card-o',
    //     children: [
    //         { path: '/page4', component: Page4, name: '页面4' },
    //         { path: '/page5', component: Page5, name: '页面5' }
    //     ]
    // },
    // {
    //     path: '/',
    //     component: Home,
    //     name: '',
    //     iconCls: 'fa fa-address-card',
    //     leaf: true,//只有一个节点
    //     children: [
    //         { path: '/page6', component: Page6, name: '导航三' }
    //     ]
    // },
    // {
    //     path: '/',
    //     component: Home,
    //     name: 'Charts',
    //     iconCls: 'fa fa-bar-chart',
    //     children: [
    //         { path: '/echarts', component: echarts, name: 'echarts' }
    //     ]
    // },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;