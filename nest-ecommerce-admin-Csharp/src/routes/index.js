import Home from "~/pages/Home/Home"
import Products from "~/pages/Products/Products"
import Login from "~/pages/Login/Login"
import TrashProducts from "~/pages/TrashProducts/TrashProducts"
import Users from "~/pages/Users/Users"
import Orders from "~/pages/Orders/Orders"
import TrashUsers from "~/pages/TrashUsers/TrashUsers"


const publicRouter = [
    {path: '/', component: Home},
    {path: '/products', component: Products},
    {path: '/trash-products', component: TrashProducts},
    {path: '/trash-users', component: TrashUsers},
    {path: '/users', component: Users},
    {path: '/orders', component: Orders},
    {path: '/login', component: Login, layout: null},
]

const privateRouter = [

]

export { publicRouter, privateRouter }