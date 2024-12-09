import React, { useState } from 'react';
import Cookies from 'js-cookie';
import className from 'classnames/bind';
import styles from './Header.module.scss';
import { BellIcon, MoonIcon, UserIcon } from '~/components/Icons';
import { Link } from 'react-router-dom';
import images from '~/assets/images/images';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as request from '~/utils/request';

const cx = className.bind(styles);

function Header() {
    const navigate = useNavigate();
    const [username, setUsername] = useState();

    useEffect(() => {
        (async () => {
            try {
                const res = await request.get(`/Account/get-username`);
                setUsername(res.username);
            } catch (error) { 
                if (error.response && error.response.status === 401) {
                    navigate('/login'); 
                }
            }
        })();
    }, [navigate]);

    const handleLogout = () => {
        Cookies.remove('token_admin');
        setUsername(undefined);
        navigate('/login')
        window.location.reload();
    };

    return (
        <div className={cx('header')}>
            <div className={cx('container_m')}>
                <div className={cx('header-wrap')}>
                    <div className={cx('header-action')}>
                        <div className={cx('img-flag')}>
                            <img src={images.vietnam} alt="" />
                            <p>VietNam</p>
                        </div>
                        <Link to={''}>
                            <MoonIcon className={cx('icon-heart')} />
                        </Link>
                        <Link to={'/cart'} className={cx('icon-cart')}>
                            <BellIcon />
                            <span className={cx('count-product-cart')}>{0}</span>
                        </Link>
                        {username ? (
                            <div className={cx('header-action-logged')}>
                                <p>{username}</p>
                                <div className={cx('logged-dropdown-wrap', 'modal-dropdow-hover')}>
                                    <ul className={cx('logged-dropdown-list')}>
                                        <li className={cx('logged-dropdown-item')}>
                                            <div onClick={handleLogout} className={cx('logged-dropdown-item-content')}>
                                                <i
                                                    className={cx('fa-solid', 'fa-right-from-bracket', 'icon-logout')}
                                                ></i>
                                                <p className={cx('js-log-out')}>Đăng xuất</p>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        ): (
                            <Link to={'/login'}>{<UserIcon className={cx('icon-user')} />}</Link>
                        )}

                        {/* <FontAwesomeIcon className={cx('icon-cart')} icon={faCartShopping} /> */}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Header;
