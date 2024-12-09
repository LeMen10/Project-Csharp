import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import className from 'classnames/bind';
import styles from './Purchase.module.scss';
import Image from '~/components/Image';
import * as request from '~/utils/request';
import { useLocation } from 'react-router-dom';

const cx = className.bind(styles);

function Purchase() {
    const navigate = useNavigate();
    const [orderDetails, setOrderDetails] = useState([]);
    const [checkCancelled, setCheckCancelled] = useState(false);
    const [orderDetailId, setOrderDetailId] = useState();
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const type = urlParams.get('type');
    const [activeLink, setActiveLink] = useState('noted');
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const resultCode = queryParams.get('resultCode');
    const bookingID = queryParams.get('bookingID');

    const handleBuyLaterMoney = async () => {
        try {
            await request.post(
                `/Site/update-payment-status?orderID=${Number(bookingID)}&paymentStatus=${'Đã thanh toán'}`,
            );
        } catch (error) {
            if (error.response.status === 401) navigate('/login');
        }
    };

    if (resultCode && Number(resultCode) === 0) handleBuyLaterMoney();

    const handleLinkClick = (type) => {
        setActiveLink(type);
    };

    useEffect(() => {
        setActiveLink(type);
    }, [type]);

    useEffect(() => {
        const fetchApi = async () => {
            try {
                const res = await request.get(`/Account/purchase?type=${type}`);
                setOrderDetails(res.result);
            } catch (error) {
                if (error.response.status === 401) navigate('/login');
            }
        };

        fetchApi();
    }, [navigate, type]);

    const renderPage = (orderDetailId, productId) => {
        switch (type) {
            case 'complete':
                return (
                    <button
                        className={cx('btn')}
                        style={{ border: '1px solid #e8e8e8' }}
                        onClick={() => {
                            navigate(`/product-detail/${productId}`);
                        }}
                    >
                        Mua lại
                    </button>
                );
            case 'noted':
                return (
                    <button
                        className={cx('btn')}
                        style={{ border: '1px solid #e8e8e8' }}
                        onClick={() => {
                            setCheckCancelled(true);
                            setOrderDetailId(orderDetailId);
                        }}
                        data-target={orderDetailId}
                    >
                        Hủy đơn hàng
                    </button>
                );
            default:
                return;
        }
    };

    const handleCancelledOrder = async () => {
        try {
            await request.post(`/Account/order-cancel/${orderDetailId}`);
            setCheckCancelled(false);
            navigate('/user/purchase?type=cancelled');
        } catch (error) {
            if (error.response.status === 401) navigate('/login');
        }
    };

    return (
        <div className={cx('container')}>
            <div className={cx('mt-4', 'mb-4')}>
                <div className={cx('title-page')}>
                    <h3>Đơn mua</h3>
                </div>

                <div className={cx('cate-purchase')}>
                    <Link
                        to={'?type=noted'}
                        className={cx('item-link', { active: activeLink === 'noted' })}
                        onClick={() => handleLinkClick('noted')}
                    >
                        <span>Đã ghi nhận</span>
                    </Link>
                    <Link
                        to={'?type=delivering'}
                        className={cx('item-link', { active: activeLink === 'delivering' })}
                        onClick={() => handleLinkClick('delivering')}
                    >
                        <span>Đang giao hàng</span>
                    </Link>
                    <Link
                        to={'?type=cancelled'}
                        className={cx('item-link', { active: activeLink === 'cancelled' })}
                        onClick={() => handleLinkClick('cancelled')}
                    >
                        <span>Đã hủy</span>
                    </Link>
                    <Link
                        to={'?type=complete'}
                        className={cx('item-link', { active: activeLink === 'complete' })}
                        onClick={() => handleLinkClick('complete')}
                    >
                        <span>Hoàn thành</span>
                    </Link>
                </div>

                {orderDetails.length > 0 ? (
                    orderDetails.map((result) => (
                        <div key={result.orderDetailId} className={cx('order-detail-wrap')}>
                            <div>
                                <div className={cx('order-detail')}>
                                    <div className={cx('order-state')}>
                                        <span>{result.status}</span>
                                        {result.status !== 'Đã hủy' || result.status !== 'Hoàn thành' ? (
                                            <></>
                                        ) : (
                                            <>
                                                <span className={cx('payment-status')}></span>
                                                <span>{result.paymentStatus}</span>
                                            </>
                                        )}
                                    </div>
                                    <div>
                                        <div>
                                            <span className={cx('product-detail')}>
                                                <div className={cx('product-detail-left')}>
                                                    <div
                                                        className={cx('img-product')}
                                                        onClick={() => {
                                                            navigate(`/product-detail/${result.productId}`);
                                                        }}
                                                    >
                                                        <Image style={{ width: '100px' }} src={result.image} alt="" />
                                                    </div>
                                                    <div className={cx('title-product-wrap')}>
                                                        <span
                                                            className={cx('title-product')}
                                                            onClick={() => {
                                                                navigate(`/product-detail/${result.productId}`);
                                                            }}
                                                        >
                                                            {result.title}
                                                        </span>
                                                        <span className={cx('quantity-product')}>
                                                            x{result.quantity}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className={cx('price-total-wrap')}>
                                                    <span className={cx('price-product')}>{result.total}$</span>
                                                </div>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={cx('order-line')}></div>
                            <div className={cx('order-total')}>
                                <span>Thành tiền: </span>
                                <p> {result.total}$</p>
                            </div>
                            <div style={{ padding: '12px 24px 24px', display: 'flex', justifyContent: 'flex-end' }}>
                                {renderPage(result.orderDetailId, result.productId)}
                            </div>
                        </div>
                    ))
                ) : (
                    <></>
                )}

                {checkCancelled && (
                    <div className={cx('modal')}>
                        <div className={cx('modal__overlay')}></div>
                        <div className={cx('modal__body')}>
                            <div className={cx('auth-form')}>
                                <div className={cx('auth-form__container')}>
                                    <div className={cx('auth-form__header')}>
                                        <h3 className={cx('auth-form__heading')}>Hủy đơn hàng</h3>
                                    </div>

                                    <div className={cx('auth-form__form')}>
                                        Bạn có chắc chắn muốn hủy đơn hàng này không ?
                                    </div>
                                    <div className={cx('auth-form__control')}>
                                        <button
                                            onClick={() => setCheckCancelled(false)}
                                            className={cx('btn auth-form__control-back', 'btn--normal')}
                                        >
                                            Trở lại
                                        </button>
                                        <button
                                            className={cx('btn', 'btn--primary', 'view-cart')}
                                            onClick={handleCancelledOrder}
                                        >
                                            Hủy đơn hàng
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Purchase;
