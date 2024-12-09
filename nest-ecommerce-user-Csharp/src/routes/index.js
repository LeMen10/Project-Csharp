import Home from "~/pages/Home/Home"
import Cart from "~/pages/Cart/Cart"
import CheckOut from "~/pages/CheckOut/CheckOut"
import Shop from "~/pages/Shop/Shop"
import About from "~/pages/About/About"
import Contact from "~/pages/Contact/Contact"
import Login from "~/pages/Login/Login"
import Register from "~/pages/Register/Register"
import Search from "~/pages/Search/Search"
import Detail from "~/pages/Detail/Detail"
import Purchase from "~/pages/Purchase/Purchase"
import Reset from "~/pages/Reset/Reset"
import Forgot from "~/pages/Forgot/Forgot"

const publicRouter = [
    {path: '/', component: Home},
    {path: '/product-detail/:slug', component: Detail},
    {path: '/cart', component: Cart},
    {path: '/checkout', component: CheckOut},
    {path: '/about', component: About},
    {path: '/contact', component: Contact},
    {path: '/shop', component: Shop},
    {path: '/search', component: Search},
    {path: '/login', component: Login, layout: null},
    {path: '/register', component: Register, layout: null},
    {path: '/user/purchase', component: Purchase},
    {path: '/reset-password', component: Reset, layout: null},
    {path: '/forgot-password', component: Forgot, layout: null},
]

const privateRouter = [

]

export { publicRouter, privateRouter }