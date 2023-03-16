import {createRouter, createWebHistory,createWebHashHistory, RouteRecordRaw} from 'vue-router'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'home',
        component: () => import('@/App.vue')
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/auth/login/index.vue'),
    },
    {
        path: '/home',
        name: 'home',
        component: () => import('@/views/layout/index.vue'),
        redirect: 'articles',
        children: [
            {
                path: "/articles",
                name: "articles",
                component: () => import("@/views/article/index.vue")
            },
            {
                path: "/article/:id",
                name: "article",
                props: true,
                component: () => import("@/views/article/detail/index.vue")
            },
            {
                path: "/article/create",
                name: "article_create",
                component: () => import("@/views/article/ae/index.vue")
            },
            {
                path: "/article/edit/:id",
                name: "article_edit",
                props: true,
                component: () => import("@/views/article/ae/index.vue")
            },
            {
                path: "/article/like",
                name: "article_like",
                props: true,
                component: () => import("@/views/article/like/index.vue")
            },
            {
                path: "/article/search",
                name: "article_search",
                props: true,
                component: () => import("@/views/article/search/index.vue")
            },
            {
                path: "/user/userinfo",
                name: "userinfo",
                component: () => import("@/views/user/info/index.vue")
            },
            {
                path: "/user/edit",
                name: "user_edit",
                component: () => import("@/views/user/edit/index.vue")
            },
            {
                path: "/user/editpsw",
                name: "user_editpsw",
                component: () => import("@/views/user/psw/index.vue")
            },
            {
                path: "/user/message",
                name: "user_message",
                component: () => import("@/views/user/message/index.vue")
            },
            {
                path: "/chat/public",
                name: "chat_public",
                component: () => import("@/views/beta/chat/index.vue")
            }
        ]
    },
    // {
    //     path: '/:pathMatch(.*)*',
    //     redirect: 'not-found'
    // },
    // {
    //     path: '/404',
    //     name: '404',
    //     component: () => import('@/views/404/index.vue')
    // },
    {
        path: "/:pathMatch(.*)*",
        name: "not-found",
        component: () => import('@/views/404/index.vue')
    },
]

const router = createRouter({
    history: createWebHashHistory(process.env.BASE_URL),
    routes,
});

router.beforeEach(async (to, from, next) => {
    if (['/login', '/'].includes(to.path))
        return next();
    const token = localStorage.getItem('token')
    if (!token)
        return next('/login');
    next()
})

export default router