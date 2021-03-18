import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/home/home'
Vue.use(VueRouter)
const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('../views/home/home'),
        children: [
            {
                path: '',
                redirect: 'report'
            },
            {
                path: 'users',
                name: 'users',
                component: () => import('../views/home/component/Users'),
            },
            {
                path: 'admin',
                name: 'admin',
                component: () => import('../views/home/component/Admin'),
            },
            {
                path: 'role',
                name: 'role',
                component: () => import('../views/home/component/Role'),
            },
            {
                path: 'right',
                name: 'right',
                component: () => import('../views/home/component/Right'),
            },
            {
                path: 'event',
                name: 'event',
                component: () => import('../views/home/component/Event'),
            },
            {
                path: 'book',
                name: 'book',
                component: () => import('../views/home/component/Book'),
            },
            {
                path: 'report',
                name: 'report',
                component: () => import('../views/home/component/Report'),
            },
            {
                path: 'article',
                name: 'article',
                component: () => import('../views/home/component/Article'),
            },
            {
                path: 'pin',
                name: 'pin',
                component: () => import('../views/home/component/Pin'),
            },
            {
                path: 'articleedit',
                name: 'articleedit',
                component: () => import('../views/home/component/ArticleEdit'),
            }
        ]
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/login/login'),
    }


]


const router = new VueRouter({
    mode: 'hash',
    base: process.env.BASE_URL,
    routes
})

router.beforeEach((to, from, next) => {
    const isLogin = localStorage.blogBackToken ? true : false;
    if (to.path === "/login" || to.path === "/register") {
        next();
    } else {
        isLogin ? next() : next("/login")
    }
});

export default router
