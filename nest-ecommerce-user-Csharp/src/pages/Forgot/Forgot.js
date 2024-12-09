import { Fragment, useState } from 'react';
import className from 'classnames/bind';
import styles from './Forgot.module.scss';
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const cx = className.bind(styles);

function Forgot() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');

    const handleSubmit = async () => {
        axios
            .post(`${process.env.REACT_APP_BASE_URL}/Account/find-user-by-username`, { username })
            .then((res) => {
                const data = res.data.user.username;
                if (res.status === 200) navigate('/reset-password', { state: { username: data } });
            })
            .catch((error) => {
                const err = error.response.data.message;
                if (err === 'Invalid access token') navigate('/login');
                if (err === 'User not found') {
                    toast.warn('Tài khoản này của bạn chưa được đăng ký!', {
                        position: 'top-right',
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: 'light',
                    });
                }
            });
    };

    return (
        <Fragment>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <div className={cx('modal', 'js-modal-login')}>
                <div className={cx('modal__body')}>
                    <div className={cx('auth-form')}>
                        <div className={cx('auth-form__container')}>
                            <div className={cx('auth-form__header')}>
                                <h3 className={cx('auth-form__heading')}>Quên mật khẩu</h3>
                            </div>

                            <Fragment>
                                <div className={cx('auth-form__form')}>
                                    <div className={cx('auth-form__group')}>
                                        <input
                                            type="text"
                                            placeholder="Nhập username của bạn để đổi mật khẩu."
                                            name="username"
                                            className={cx('auth-form__input')}
                                            id="auth-form__user-login"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className={cx('auth-form__control')}>
                                    <Link
                                        to={'/login'}
                                        className={cx('btn auth-form__control-back', 'btn--normal js-modal-close')}
                                    >
                                        Trở lại
                                    </Link>
                                    <button
                                        value="login"
                                        className={cx('btn', 'btn--primary', 'view-cart')}
                                        onClick={handleSubmit}
                                        disabled={!username}
                                    >
                                        Tiếp tục
                                    </button>
                                </div>
                            </Fragment>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default Forgot;
