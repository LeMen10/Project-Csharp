import React from 'react';
import Image from '~/components/Image';
import { Link } from 'react-router-dom';
import className from 'classnames/bind';
import styles from './ProductItem.module.scss';
import { useNavigate } from 'react-router-dom';

const cx = className.bind(styles);

function ProductItem({ listProduct, flexCol }) {
    const navigate = useNavigate();
    return (
        <div key={listProduct.productId} className={cx('col', `${flexCol}`, 'col-4', 'col-6', 'col-12', 'mb-24')}>
            <div className={cx('popular-product-cart-wrap')}>
                <div
                    className={cx('product-card-header')}
                    onClick={() => {
                        navigate(`/product-detail/${listProduct.productId}`);
                    }}
                >
                    <Image className={cx('img-product-box')} src={listProduct.image} alt={''} />
                </div>

                <div className={cx('product-cart-content')}>
                    <Link to={`/product-detail/${listProduct.productId}`} className={cx('product-cart-title')}>
                        {listProduct.title}
                    </Link>
                    <p className={cx('product-cart-description')}></p>
                    <div className={cx('product-card-bottom')}>
                        <span className={cx('current-price')}>${listProduct.price}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductItem;
