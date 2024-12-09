import React from 'react';
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import className from 'classnames/bind';
import styles from './CheckOut.module.scss';
import Image from '~/components/Image';
import images from '~/assets/images/images';
import * as request from '~/utils/request';

const cx = className.bind(styles);

function CheckOut() {
    const location = useLocation();
    const data = location.state?.data;
    const [payment, setPayment] = useState('Thanh toán khi nhận hàng');
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);

    const [fullName, setFullName] = useState();
    const [phoneNumber, setPhoneNumber] = useState();
    const [city, setCity] = useState();
    const [district, setDistrict] = useState();
    const [ward, setWard] = useState();
    const [specificAddress, setSpecificAddress] = useState();
    const [priceTotal, setPriceTotal] = useState();
    const [stateAddress, setStateAddress] = useState(true);
    const [checkPushAddress, setCheckPushAddress] = useState(false);
    const [infoUser, setInfoUser] = useState();

    useEffect(() => {
        (async () => {
            try {
                const res = await request.post(`/Site/product-checkout`, data);
                var rs = res.result;
                var total = 0;

                rs.map((item) => (total += item.quantity * item.price));
                setProducts(rs);
                setPriceTotal(total);
            } catch (error) {
                if (error.response.status === 401) navigate('/login');
                if (error.response.status === 404) navigate('/cart');
            }
        })();
    }, [data, navigate]);

    useEffect(() => {
        (async () => {
            try {
                const res = await request.get(`/Site/get-address`);
                var data = res.userResult;
                if (res.message === 'No Address') {
                    setStateAddress(false);
                } else {
                    setStateAddress(true);
                    setInfoUser(res.userResult);
                    setFullName(data.fullName);
                    setPhoneNumber(data.phone);
                    setCity(data.city);
                    setDistrict(data.district);
                    setWard(data.ward);
                    setSpecificAddress(data.specificAddress);
                }
            } catch (error) {
                if (error.response.status === 401) navigate('/login');
            }
        })();
    }, [stateAddress, checkPushAddress, navigate]);

    const handleBuyLaterMoney = async () => {
        const shortList = products.map((item) => {
            var { cartId, image, price, title, userId, ...rest } = item;
            return {
                quantity: rest.quantity,
                productId: rest.productId,
                status: 'Đang xử lý',
                paymentStatus: 'Chưa thanh toán',
                total: rest.quantity * price,
            };
        });

        let total = 0;
        products.map((item) => (total += item.quantity * item.price));

        try {
            const res = await request.post(`/Site/save-order`, {
                payment,
                orderDetails: shortList,
            });
            if (payment === "Thanh toán bằng Momo") paymentMoMo(res.orderId, total);
            if (payment === "Thanh toán khi nhận hàng") navigate('/user/purchase?type=noted');
        } catch (error) {
            if (error.response.status === 401) navigate('/login');
        }
    };

    const handleRadio = (event) => {
        setPayment(event.target.value);
    };

    const updateAddress = async () => {
        try {
            await request.post(`/Site/update-address`, {
                phone: phoneNumber,
                specificAddress,
                ward,
                district,
                city,
                fullName,
            });
            if (!stateAddress) setStateAddress(true);
            if (checkPushAddress) setCheckPushAddress(false);
        } catch (error) {
            if (error.response.status === 401) navigate('/login');
        }
    };

    const handleBtnGoBack = () => {
        if (stateAddress === false) navigate('/cart');
        else { setCheckPushAddress(false);}
    };

    const paymentMoMo = async (bookingId, amount) => {
        const orderId = `MOMO_${new Date().getTime()}`;
        try {
            const response = await fetch('http://localhost:8080/payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: amount*25000,
                    orderIdSuffix: orderId,
                    bookingId,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            if (data.shortLink) { window.location.href = data.shortLink;} 
            else { throw new Error('Không thể tạo giao dịch MoMo.');}

            // Sau khi người dùng thanh toán thành công trên MoMo, tiếp tục xử lý
            // const captureId = orderId; // Đối với MoMo, sử dụng orderId làm captureId
            // await createPayment(captureId, totalPrice);
        } catch (error) {
            console.error('Error processing payment:', error);
            alert('Không thể thực hiện giao dịch. Vui lòng thử lại!');
        }
    };

    return (
        <div className={cx('container')}>
            <div className={cx('mt-4', 'mb-4')}>
                <div className={cx('title-page')}>
                    <h3>Thanh toán</h3>
                </div>

                <div className={cx('shipping-address-wrap')}>
                    <h4 className={cx('shipping-address-title')}>
                        <img alt="" style={{ marginRight: '10px', width: '20px' }} src={images.iconLocation} /> Địa chỉ
                        nhận hàng:
                    </h4>
                    <div className={cx('shipping-address')}>
                        {infoUser && (
                            <>
                                <div style={{ display: 'flex' }}>
                                    <div style={{ fontWeight: '600' }}>
                                        {infoUser.fullName} {infoUser.phone}
                                    </div>
                                    <p className={cx('address')}>
                                        {infoUser.specificAddress}, Phường/Xã: {infoUser.ward}, Quận/Huyện:{' '}
                                        {infoUser.district}, Tỉnh/TP: {infoUser.city}
                                    </p>
                                </div>
                                <button
                                    style={{ paddingLeft: '40px', backgroundColor: 'transparent' }}
                                    onClick={() => setCheckPushAddress(true)}
                                >
                                    Chỉnh sửa
                                </button>
                            </>
                        )}
                    </div>
                </div>

                <table className={cx('table', 'mt-4')}>
                    <thead>
                        <tr>
                            <th scope="col">Sản phẩm</th>
                            <th scope="col" style={{ textAlign: 'center' }}>
                                Giá ban đầu
                            </th>
                            <th scope="col" style={{ textAlign: 'center' }}>
                                Số lượng
                            </th>
                            <th scope="col" style={{ textAlign: 'center' }}>
                                Tổng tiền
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length > 0 ? (
                            products.map((result) => (
                                <tr key={result.cartId}>
                                    <td style={{ display: 'flex', alignItems: 'center', height: '131.5px' }}>
                                        <Image style={{ width: '120px' }} src={result.image} alt="" />
                                        <p style={{ paddingLeft: '10px' }}>{result.title}</p>
                                    </td>
                                    <td
                                        style={{ textAlign: 'center' }}
                                        data-price={result.cartId}
                                        className={cx('unit-price')}
                                    >
                                        {result.price}$
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <p className={cx('quantity-product-checkout')}>{result.quantity}</p>
                                    </td>
                                    <td
                                        style={{ textAlign: 'center' }}
                                        className={cx('product-total')}
                                        data-total={result.cartId}
                                    >
                                        {result.price * result.quantity}$
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className={cx('text-center')}>
                                    Không có sản phẩm nào trong giỏ hàng của bạn.
                                    <Link to={'/shop'}> Mua hàng</Link>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <div className={cx('payment-area')}>
                    <div className={cx('payment-method')}>
                        <p className={cx('payment-method-title')}>Phương thức thanh toán</p>
                        <div value={payment}>
                            <div className={cx('later_money')}>
                                <input
                                    type="radio"
                                    id="later_money"
                                    name="radio"
                                    value="Thanh toán khi nhận hàng"
                                    onChange={handleRadio}
                                    checked={payment === 'Thanh toán khi nhận hàng'}
                                />
                                <label htmlFor="later_money">Thanh toán khi nhận hàng</label>
                            </div>
                            <div className={cx('paypal')}>
                                <input
                                    type="radio"
                                    id="paypal"
                                    name="radio"
                                    value="Thanh toán bằng Momo"
                                    onChange={handleRadio}
                                />
                                <label htmlFor="paypal">Thanh toán bằng Momo</label>
                            </div>
                        </div>
                    </div>
                    <div className={cx('bill-product')}>
                        <div className={cx('total-payment')}>
                            Tổng thanh toán: <span className={cx('price-total-order')}>{priceTotal}$</span>
                        </div>
                        <div className={cx('buy-button')}>
                            {payment === 'Thanh toán khi nhận hàng' ? (
                                <button
                                    className={cx('btn', 'btn--primary', 'btn-sm')}
                                    onClick={handleBuyLaterMoney}
                                    style={{ marginRight: '12px' }}
                                >
                                    Đặt hàng
                                </button>
                            ) : (
                                <>
                                    <button
                                        className={cx('btn', 'btn--primary', 'btn-sm')}
                                        style={{ marginRight: '12px' }}
                                        onClick={handleBuyLaterMoney}
                                    >   
                                        Đặt hàng Momo
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {(stateAddress === false || checkPushAddress === true) && (
                <div className={cx('modal')}>
                    <div className={cx('modal__overlay')}></div>
                    <div className={cx('modal__body')}>
                        <div className={cx('auth-form')}>
                            <div className={cx('auth-form__container')}>
                                <div className={cx('auth-form__header')}>
                                    {checkPushAddress === true && (
                                        <>
                                            <h3 className={cx('auth-form__heading')}>Chỉnh sửa địa chỉ</h3>
                                            <p className={cx('auth-form__switch-btn')}>
                                                Để nhận hàng, hãy cập nhật địa chỉ của bạn.
                                            </p>
                                        </>
                                    )}
                                    {stateAddress === false && (
                                        <>
                                            <h3 className={cx('auth-form__heading')}>Tạo mới địa chỉ</h3>
                                            <p className={cx('auth-form__switch-btn')}>
                                                Để nhận hàng, hãy thêm địa chỉ của bạn.
                                            </p>
                                        </>
                                    )}
                                </div>
                                <div className={cx('auth-form__form')}>
                                    <div className={cx('auth-form__group')}>
                                        <input
                                            type="text"
                                            placeholder="Họ và tên"
                                            name="fullname"
                                            className={cx('auth-form__input')}
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                        />
                                    </div>
                                    <div className={cx('auth-form__group')}>
                                        <input
                                            type="text"
                                            placeholder="Số điện thoại"
                                            name="phone_number"
                                            className={cx('auth-form__input')}
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className={cx('auth-form__group')}>
                                    <input
                                        type="text"
                                        placeholder="Tỉnh/Thành phố"
                                        name="city"
                                        className={cx('auth-form__input')}
                                        id="auth-form__user-login"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                    />
                                </div>
                                <div className={cx('auth-form__group')}>
                                    <input
                                        type="text"
                                        placeholder="Quận/Huyện"
                                        name="district"
                                        className={cx('auth-form__input')}
                                        value={district}
                                        onChange={(e) => setDistrict(e.target.value)}
                                    />
                                </div>
                                <div className={cx('auth-form__group')}>
                                    <input
                                        type="text"
                                        placeholder="Phường/Xã"
                                        name="ward"
                                        className={cx('auth-form__input')}
                                        value={ward}
                                        onChange={(e) => setWard(e.target.value)}
                                    />
                                </div>
                                <div className={cx('auth-form__group')}>
                                    <input
                                        type="text"
                                        placeholder="Địa chỉ cụ thể"
                                        name="specific_address"
                                        className={cx('auth-form__input')}
                                        value={specificAddress}
                                        onChange={(e) => setSpecificAddress(e.target.value)}
                                    />
                                </div>
                                <div className={cx('auth-form__control')}>
                                    <button
                                        onClick={handleBtnGoBack}
                                        className={cx('btn auth-form__control-back', 'btn--normal')}
                                    >
                                        Trở lại
                                    </button>
                                    <button
                                        className={cx('btn', 'btn--primary', 'view-cart')}
                                        onClick={updateAddress}
                                        disabled={
                                            !specificAddress || !district || !ward || !phoneNumber || !fullName || !city
                                        }
                                    >
                                        Confirm
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CheckOut;
