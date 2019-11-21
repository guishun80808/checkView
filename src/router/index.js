import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)


/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
// let homeRedirect = "/patrolPer"
// console.log(store);
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: "/home",
    children: [
      {
        path: 'home',
        name: 'Home',
        redirect: '/home/patrolPer',
        component: () => import('@/views/home/index'),
        meta: { title: '首页' },
        children: [
          {
            path: '/home/patrolPer',
            name: 'PatrolPer',
            component: () => import('@/views/home/patrolPer'),
            meta: { title: '巡查视角' }
          },
          {
            path: '/home/deanPer',
            name: 'DeanPer',
            component: () => import('@/views/home/deanPer'),
            meta: { title: '本院视角' }
          },
          {
            path: '/home/chiefPer',
            name: 'ChiefPer',
            component: () => import('@/views/home/chiefPer'),
            meta: { title: '庭长视角' }
          },
          {
            path: '/home/judgePer',
            name: 'JudgePer',
            component: () => import('@/views/home/judgePer'),
            meta: { title: '法官视角' }
          }
        ]
      }
    ]
  },
  {
    path: '/quality',
    component: Layout,
    redirect: '/quality/hierarchy',
    children: [
      {
        path: '/quality/index',
        name: 'Quality',
        redirect: '/quality/hierarchy',
        component: () => import('@/views/quality/index'),
        meta: { title: '质量查询' },
        children: [
          {
            path: '/quality/hierarchy',
            name: 'Query',
            component: () => import('@/views/quality/hierarchy'),
            meta: { title: '层级查询' }
          },
          {
            path: '/quality/mass',
            name: 'Mass',
            component: () => import('@/views/quality/mass'),
            meta: { title: '质量查询' }
          }
        ]
      },
    ]
  },
  {
    path: '/statistics',
    component: Layout,
    redirect: '/statistics/make',
    children: [
      {
        path: '/statistics/index',
        name: 'Statistics',
        redirect: '/statistics/make',
        component: () => import('@/views/statistics/index'),
        meta: { title: '统计报表' },
        children: [
          {
            path: '/statistics/make',
            name: 'Make',
            component: () => import('@/views/statistics/make'),
            meta: { title: '电子卷宗制作情况统计报表' }
          },
          {
            path: '/statistics/query',
            name: 'MassQuery',
            component: () => import('@/views/statistics/query'),
            meta: { title: '电子卷宗制作与质检总体统计报表' }
          },
          {
            path: '/statistics/uploadrote',
            name: 'Uploadrote',
            component: () => import('@/views/statistics/uploadrote'),
            meta: { title: '电子卷宗随案生成制作率统计报表' }
          },
          {
            path: '/statistics/passrote',
            name: ' Passrote',
            component: () => import('@/views/statistics/passrote'),
            meta: { title: '电子卷宗随案生成合格率统计报表' }
          },
          {
            path: '/statistics/uploadrank',
            name: ' Uploadrank',
            component: () => import('@/views/statistics/uploadrank'),
            meta: { title: '电子卷宗随案生成制作数量排行榜' }
          },
          {
            path: '/statistics/passrank',
            name: ' Passrank',
            component: () => import('@/views/statistics/passrank'),
            meta: { title: '电子卷宗随案生成合格数量排行榜' }
          },
          {
            path: '/statistics/tendency',
            name: ' Tendency',
            component: () => import('@/views/statistics/tendency'),
            meta: { title: '年度电子卷宗制作与质检总体趋势报表' }
          },
        ]
      },
    ]
  },
  {
    path: '/users',
    component: Layout,
    redirect: '/users/query',
    children: [{
      path: '/users/index',
      name: 'User',
      redirect: '/users/query',
      component: () => import('@/views/users/index'),
      meta: { title: '用户管理' },
      children: [
        {
          path: '/users/query',
          name: 'Users',
          component: () => import('@/views/users/user'),
          meta: { title: '用户管理' }
        },
        {
          path: '/users/zj_jg',
          name: 'ZZJG',
          component: () => import('@/views/users/zj_jg'),
          meta: { title: '组织架构' }
        },
        {
          path: '/users/role',
          name: 'Role',
          component: () => import('@/views/users/role'),
          meta: { title: '角色管理' }
        }
      ]
    }]
  },
  {
    path: '/admin',
    component: Layout,
    redirect: '/admin/query',
    children: [{
      path: '/admin/index',
      name: 'Admin',
      redirect: '/admin/query',
      component: () => import('@/views/admin/index'),
      meta: { title: '系统设置' },
      children: [
        {
          path: '/admin/query',
          name: 'System',
          component: () => import('@/views/admin/system'),
          meta: { title: '系统设置' }
        },
      ]
    }]
  },
  {
    path: '/configs',
    component: Layout,
    redirect: '/configs/query',
    children: [{
      path: '/configs/index',
      name: 'Configs',
      redirect: '/configs/query',
      component: () => import('@/views/configs/index'),
      meta: { title: '配置管理' },
      children: [
        {
          path: '/configs/query',
          name: 'Config',
          component: () => import('@/views/configs/config'),
          meta: { title: '配置管理' }
        },
      ]
    }]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
