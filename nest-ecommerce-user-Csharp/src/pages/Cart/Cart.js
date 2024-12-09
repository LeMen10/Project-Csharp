import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import className from 'classnames/bind';
import styles from './Cart.module.scss';
import Image from '~/components/Image';
import PropTypes from 'prop-types';
import * as request from '~/utils/request';

const cx = className.bind(styles);

function Cart({ setHeaderVariable }) {
    
    const navigate = useNavigate();
    const [cart, setCarts] = useState([]);
    const [checkedItems, setCheckedItems] = useState([]);
    const [priceTotal, setPriceTotal] = useState();
    const increaseProduct = async (event) => {
        const targetId = event.target.dataset.target;
       
        // Lấy thẻ input gần thẻ vừa ấn
        const targetElement = document.querySelector(`[data-id="${targetId}"]`);
        //Lấy id sản phẩm
        const quantityElement = document.getElementById("product-input-quantity" + targetId);
        console.log("product-input-quantity" + targetId)
        const product = await getProduct(quantityElement.getAttribute("data-product_id"));
        console.log(product);
        // Lấy value của thẻ chứa value là giá sản phẩm unit
        var priceUnit = document.querySelector(`[data-price="${targetId}"]`).innerText;
        // Thẻ chứa value là giá sản phẩm total
        var priceTotal = document.querySelector(`[data-total="${targetId}"]`);
        //check số lượng sản phẩm 
        if(product.stock < Number(targetElement.value) + 1) return;
        // Quantity + 1
        targetElement.value = Number(targetElement.value) + 1;
        // Giá total tăng lên
        var priceUnitValue = Number(priceUnit.substring(0, priceUnit.length - 1));
        var quantityValue = Number(targetElement.value);
        var priceTotalValue = priceUnitValue * quantityValue;
        priceTotal.innerText = priceTotalValue + '$';
        handleChangeQuantity(quantityValue, targetId);
    };

    const decreaseProduct = (event) => {
        const targetId = event.target.dataset.target;
        const targetElement = document.querySelector(`[data-id="${targetId}"]`);
        var priceUnit = document.querySelector(`[data-price="${targetId}"]`).innerText;
        var priceTotal = document.querySelector(`[data-total="${targetId}"]`);

        targetElement.value = Number(targetElement.value) - 1;
        var priceUnitValue = Number(priceUnit.substring(0, priceUnit.length - 1));
        var quantityValue = Number(targetElement.value);
        var priceTotalValue = priceUnitValue * quantityValue;
        priceTotal.innerText = priceTotalValue + '$';

        if (targetElement.value < 1) {
            targetElement.value = 1;
            quantityValue = 1;
            priceTotal.innerText = priceUnitValue + '$';
        } else {
            handleChangeQuantity(quantityValue, targetId);
        }
    };

    const handleChangeQuantity = async (quantityValue, targetId) => {
        try {
            const res = await request.post(`/Cart/update-quantity`, {
                quantity: quantityValue,
                cartId: Number(targetId),
            });
            setCarts(res.result);
        } catch (error) {if (error.response.status === 401) navigate('/login');}
    };

    const getProduct = async (prodId) => {
        try {
            const res = await request.get(`/Product/product-detail/${prodId}`);
            return res.product;
        } catch (error) {
            console.log(error);
            const err = error.response.data.message;
            if (err === 'Invalid access token') navigate('/login');
        }
    }


    useEffect(() => {
        const fetchApi = async () => {
            try {
                const res = await request.get(`/Cart/get-cart`);
                setCarts(res.result);
            } catch (error) { if (error.response.status === 401) navigate('/login'); }
        };
        fetchApi();
    }, [navigate]);

    const deleteProductItem = async (event) => {
        const dataId = Number(event.target.dataset.id);
        try {
            const res = await request.delete_method(`/Cart/delete-cart-item/${dataId}`);
            const count = res.count;
            checkedItems.forEach((item, index) => {if(item===dataId){checkedItems.splice(index, 1)}})
            if (setHeaderVariable) setHeaderVariable(count);
            setCarts(res.carts);
        } catch (error) {if (error.response.status === 401) navigate('/login');}
    };

    const handleChange = (event) => {
        const item = event.target.value;
        const isChecked = event.target.checked;
        isChecked ? setCheckedItems([...checkedItems, Number(item)]) : setCheckedItems(checkedItems.filter((i) => i !== Number(item)));
    };

    useEffect(() => {
        var total = 0;
        cart.forEach ((item) => {
            if (checkedItems.includes(item.cartId)) { total += item.price * item.quantity; }
        });
        setPriceTotal(total);
    }, [checkedItems, cart]);

    const handleCheckAll = (event) => {
        const arrItemChecked = document.querySelectorAll(`[name="checkProductItem"]`);
        if (event.target.checked) {
            const newListCart = [];
            cart.forEach((item) => {
                newListCart.push(item.cartId);
            });
            arrItemChecked.forEach((item) => (item.checked = true));
            setCheckedItems(newListCart);
        } else {
            arrItemChecked.forEach((item) => (item.checked = false));
            setCheckedItems([]);
        }
    };

    const handleBuy = () => {
        const data = checkedItems.map((item) => parseInt(item));
        navigate('/checkout', { state: { data } });
    };

    return (
        <div className={cx('container')}>
            <div className={cx('mt-4', 'mb-4')}>
                <div className={cx('title-page')}>
                    <h3>Giỏ hàng</h3>
                </div>

                <table className={cx('table', 'mt-4')}>
                    <thead>
                        <tr>
                            <td>
                                <div className={cx('form-check')}>
                                    <input
                                        style={{ marginBottom: '4px' }}
                                        type="checkbox"
                                        onChange={handleCheckAll}
                                        className={cx('form-check-input')}
                                        id="checkbox-all"
                                        checked={cart && cart.length > 0 && checkedItems.length === cart.length}
                                    />
                                </div>
                            </td>
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
                            <th scope="col" style={{ textAlign: 'center' }} colSpan="2">
                                Chỉnh sửa
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {cart.length > 0 ? (
                            cart.map((result) => (
                                <tr key={result.cartId}>
                                    <td>
                                        <div className={cx('form-check')}>
                                            <input
                                                type="checkbox"
                                                className={cx('form-check-input', 'check-input-product')}
                                                value={result.cartId}
                                                name="checkProductItem"
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </td>
                                    <td>
                                        <Image style={{ width: '120px' }} src={result.image} alt="" />
                                        <p>{result.title}</p>
                                    </td>
                                    <td
                                        style={{ textAlign: 'center' }}
                                        data-price={result.cartId}
                                        className={cx('unit-price')}
                                    >
                                        {result.price}$
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <span
                                            className={cx('change-quantity-product')}
                                            data-target={result.cartId}
                                            onClick={decreaseProduct}
                                        >
                                            -
                                        </span>
                                        <input
                                            type="tel"
                                            id = {"product-input-quantity" + result.cartId}
                                            className={cx('quantity-product')}
                                            onChange={() => {}}
                                            value={result.quantity}
                                            name="quantity"
                                            data-id={result.cartId}
                                            data-product_id={result.productId}
                                        />
                                        <span
                                            className={cx('change-quantity-product')}
                                            data-target={result.cartId}
                                            onClick={increaseProduct}
                                        >
                                            +
                                        </span>
                                    </td>
                                    <td
                                        style={{ textAlign: 'center' }}
                                        className={cx('product-total')}
                                        data-total={result.cartId}
                                    >
                                        {result.price * result.quantity}$
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <div
                                            onClick={deleteProductItem}
                                            className={cx('btn', 'btn-link', 'text-dark')}
                                            data-id={result.cartId}
                                        >
                                            Xóa
                                        </div>
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
                {cart.length > 0 ? (
                    <div className={cx('bill-product')}>
                        <div className={cx('total-payment')}>
                            Tổng thanh toán: <span className={cx('price-total-order')}>{priceTotal}$</span>
                        </div>
                        <div className={cx('buy-button')}>
                            <button
                                className={cx('btn', 'btn--primary', 'btn-sm')}
                                onClick={handleBuy}
                                style={{ marginRight: '12px' }}
                                disabled={checkedItems.length === 0}
                            >
                                Mua ngay
                            </button>
                        </div>
                    </div>
                ) : (
                    <> </>
                )}
            </div>
        </div>
    );
}
Cart.propTypes = {
    setHeaderVariable: PropTypes.func,
};
export default Cart;
