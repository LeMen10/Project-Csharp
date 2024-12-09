import React from 'react';
// import axios from 'axios';
import Image from '~/components/Image';
import { Link } from 'react-router-dom';
import className from 'classnames/bind';
import styles from './ProductItem.module.scss';
// import Cookies from 'js-cookie';

const cx = className.bind(styles);

function ProductItem({ listProduct, flexCol }) {

    return (
        <div key={listProduct._id} className={cx('col', `${flexCol}`, 'col-4', 'col-6', 'col-12', 'mb-24')}>
            <div className={cx('popular-product-cart-wrap')}>
                <div className={cx('product-card-header')}>
                    <Image className={cx('img-product-box')} src={listProduct.img} alt={''} />
                </div>

                <div className={cx('product-cart-content')}>
                    <Link
                        to={`/product/${listProduct._id}`}
                        className={cx('product-cart-title')}
                    >
                        {listProduct.title}
                    </Link>
                    <p className={cx('product-cart-description')}></p>
                    <div className={cx('product-card-bottom')}>
                        <span className={cx('current-price')}>${listProduct.price}</span>
                        <div className={cx('add-cart')}>
                            {/* <Link to={''} className={cx('btn')}>
                                Add
                            </Link> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductItem;
