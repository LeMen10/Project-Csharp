import axios from 'axios';
import { Link } from 'react-router-dom';
import className from 'classnames/bind';
import styles from './Sidebar.module.scss';
import { useEffect, useState } from 'react';
import Image from '~/components/Image';

const cx = className.bind(styles);

function Sidebar(props) {
    const [stateProduct, setStateProduct] = useState([]);
    useEffect(() => {
        axios
            .get(`${process.env.BASE_URL}/category`)
            .then((res) => {
                setStateProduct(res.data.categories);
            })
            .catch((error) => {});
    }, []);

    return (
        <div className={cx('sidebar', 'container_m')}>
            <div className={cx('categories-shop')}>
                <h5 className={cx('title-category')}>Category</h5>
                <ul className={cx('title-product-list')}>
                    {stateProduct.map((result) => (
                        <li key={result._id} className={cx('title-product-item')}>
                            <div className={cx('product-item')}>
                                <Image className={cx('')} src={result.img} alt={''} />
                                <Link
                                    className={cx('render-by-category')}
                                    to={`?_cate=${result.category}`}
                                    name=""
                                    onClick={props.onClick}
                                >
                                    {result.title}
                                </Link>
                            </div>
                            <div className={cx('count-product')}>{result.count}</div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* <div className={cx('categories-shop')}>
                <h5 className={cx('title-category')}>Price</h5>
                <ul className={cx('title-product-list')}>
                    <li className={cx('price-product-item')}>
                        <Link to={'?min_price=1&max_price=50'}>from 1$ - 50$</Link>
                    </li>
                    <li className={cx('price-product-item')}>
                        <Link to={'?min_price=51&max_price=100'}>from 51$ - 100$</Link>
                    </li>
                    <li className={cx('price-product-item')}>
                        <Link to={''}>over 100 dollars</Link>
                    </li>
                </ul>
                <div className={cx('price-range-wrap')}>
                    <h4 className={cx('price-range-title')}>Price Range</h4>
                    <div className={cx('price-range-input')}>
                        <input type="text" />
                        <span>-</span>
                        <input type="text" />
                    </div>
                    <div className={cx('price-range-apply')}>
                        <button className={cx('price-range-submit')} type="submit">
                            Apply
                        </button>
                    </div>
                </div>
            </div> */}

            {/* <div className={cx('banner-img-sidebar')}>
                    <img src="/img/banner-11.png" alt="" />
                    <div className={cx('title-banner-sidebar')}>
                        <p>Oganic</p>
                        <h4>
                            Sale 17% on <span>Organic</span> Juice
                        </h4>
                    </div>
                </div> */}
        </div>
    );
}

export default Sidebar;
