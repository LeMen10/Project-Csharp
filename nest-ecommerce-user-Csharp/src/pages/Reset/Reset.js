import { Fragment, useState, useEffect } from 'react';
import className from 'classnames/bind';
import axios from 'axios';
import styles from './Reset.module.scss';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const cx = className.bind(styles);

function Reset() {
    const [password, setPassword] = useState('');
    const [resetSuccess, setResetSuccess] = useState(false);
    const [timeLeft, setTimeLeft] = useState(5);
    const location = useLocation();
    const username = location.state?.username;
    const navigate = useNavigate();

    useEffect(() => {
        if (resetSuccess) {
            const timer = timeLeft > 0 && setInterval(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearInterval(timer);
        }
    }, [timeLeft, navigate, resetSuccess]);

    if (timeLeft === 0) navigate(`/login`);
    
    const handleSubmit = () => {
        const api = axios.create({
            headers: {
                'Content-Type': 'application/json'
            },
        });

        api.post(`${process.env.REACT_APP_BASE_URL}/Account/reset-password`, { username, password })
            .then((res) => {
                if (res.status === 200) {
                    setResetSuccess(true);
                    setTimeLeft(5);
                }
            })
            .catch((error) => {
                const err = error.response.data.message;
                if (err === 'Invalid reset token') navigate('/forgot-password');
            });
    };

    return (
        <Fragment>
            <div className={cx('modal', 'js-modal-login')}>
                <div className={cx('modal__body')}>
                    <div className={cx('auth-form')}>
                        <div className={cx('auth-form__container', 'js-modal-container-login')}>
                            {resetSuccess ? (
                                <Fragment>
                                    <div className={cx('auth-form__header')}>
                                        <h3 className={cx('auth-form__heading')}>
                                            Mật khẩu đã đặt lại mật khẩu thành công
                                        </h3>
                                    </div>
                                    <div className={cx('auth-form__form')}>
                                        <div className={cx('auth-form__form')}>
                                            <p style={{ padding: '0 32px' }}>
                                                Bạn đã đặt lại mật khẩu thành công cho tài khoản có username là {' '}
                                                <span
                                                    style={{
                                                        color: 'rgba(0, 186, 131, 1)',
                                                        fontWeight: '700',
                                                    }}
                                                >
                                                    {username}
                                                </span>
                                            </p>
                                        </div>
                                        <div className={cx('auth-form__form')}>
                                            <p style={{ padding: '0 32px' }}>
                                                Bạn sẽ được chuyển hướng đến trang đăng nhập trong{' '}
                                                <span>{timeLeft}</span> giây
                                            </p>
                                        </div>
                                    </div>

                                    <div className={cx('auth-form__control')}>
                                        <Link
                                            to={'/login'}
                                            className={cx('btn auth-form__control-back', 'btn--primary')}
                                        >
                                            OK
                                        </Link>
                                    </div>
                                </Fragment>
                            ) : (
                                <Fragment>
                                    <div className={cx('auth-form__header')}>
                                        <h3 className={cx('auth-form__heading')}>Thiết lập mật khẩu</h3>
                                    </div>

                                    <div className={cx('auth-form__form')}>
                                        <div className={cx('auth-form__group')}>
                                            <input
                                                type="password"
                                                // placeholder="Mật khẩu cũ mà bạn đã quên 🤡"
                                                placeholder="Nhập mật khẩu mới."
                                                name="password"
                                                className={cx('auth-form__input')}
                                                id="auth-form__password-login"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className={cx('auth-form__control')}>
                                        <Link to={'/'} className={cx('btn auth-form__control-back', 'btn--normal')}>
                                            Trở lại
                                        </Link>
                                        <button
                                            value="login"
                                            className={cx('btn', 'btn--primary', 'view-cart')}
                                            onClick={handleSubmit}
                                            disabled={!password}
                                        >
                                            Tiếp tục
                                        </button>
                                    </div>
                                </Fragment>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default Reset;
