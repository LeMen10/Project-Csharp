// import className from 'classnames/bind';
// import axios from 'axios';
import { Link } from 'react-router-dom';
import className from 'classnames/bind';
import styles from './Sidebar.module.scss';
// import { useState } from 'react';
import { DashboardIcon, ProductIcon, OrderIcon, UserIcon } from '~/components/Icons';
import images from '~/assets/images/images';
// import Image from '~/components/Image';
const cx = className.bind(styles);

function Sidebar() {
    // const [stateProduct, setStateProduct] = useState(['Dashboard']);
    // useEffect(() => {
    //     axios
    //         .get('http://localhost:9000/category')
    //         .then((res) => {
    //             setStateProduct(res.data.categories);
    //         })
    //         .catch((error) => {
    //             console.log(error.message);
    //         });
    // }, []);

    return (
        <div className={cx('sidebar')}>
            <div className={cx('categories-shop')}>
                <div style={{margin: '6px 0px'}}>
                    <img className={cx('icon-logo')} src={images.logo} alt="nest" />
                </div>
                <ul className={cx('categories-admin')}>
                    <li className={cx('category-wrap')}>
                        <div className={cx('category-item')}>
                            <DashboardIcon />
                            <Link className={cx('title-category-admin')} to={'/'} name="">
                                Trang chủ
                            </Link>
                        </div>
                    </li>
                    <li className={cx('category-wrap')}>
                        <div className={cx('category-item')}>
                            <ProductIcon/>
                            <Link className={cx('title-category-admin')} to={'/products'} name="">
                                Sản phẩm
                            </Link>
                        </div>
                    </li>
                    <li className={cx('category-wrap')}>
                        <div className={cx('category-item')}>
                            <OrderIcon />
                            <Link className={cx('title-category-admin')} to={'/orders'} name="">
                                Đơn hàng
                            </Link>
                        </div>
                    </li>
                    <li className={cx('category-wrap')}>
                        <div className={cx('category-item')}>
                            <UserIcon/>
                            <Link className={cx('title-category-admin')} to={'/users'} name="">
                                Người dùng
                            </Link>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default Sidebar;
