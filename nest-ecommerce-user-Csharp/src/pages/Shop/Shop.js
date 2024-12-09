import React from 'react';
import className from 'classnames/bind';
import styles from './Shop.module.scss';
import { useState, useEffect } from 'react';
import ProductItem from '~/layouts/components/ProductItem/ProductItem';
import Image from '~/components/Image';
import ReactPaginate from 'react-paginate';
import { Link, useLocation } from 'react-router-dom';
import images from '~/assets/images/images';
import * as request from '~/utils/request';

const cx = className.bind(styles);

function Shop() {
    const [productList, setProductList] = useState([]);
    const [pageCount, setPageCount] = useState();
    const [categories, setCategories] = useState([]);
    const postsPerPage = 8;

    const location = useLocation();
    const [urlParams, setUrlParams] = useState(new URLSearchParams(location.search));

    useEffect(() => {
        setUrlParams(new URLSearchParams(location.search));
    }, [location]);

    const query_String = window.location.search;
    const urlParam = new URLSearchParams(query_String);
    const category = urlParam.get('cate');

    useEffect(() => {
        const fetchApi = async () => {
            try {
                const res = await request.get(`/Shop/shop?page=1&limit=${postsPerPage}&cate=${category}`);
                setProductList(res.products);
                setPageCount(res.countProduct);
            } catch (error) {}
        };

        fetchApi();
    }, [urlParams, category]);

    useEffect(() => {
        const fetchApi = async () => {
            try {
                const res = await request.get(`/Shop/get-category`);
                console.log(res)
                setCategories(res.categories);
            } catch (error) {}
        };

        fetchApi();
    }, []);

    const getProducts = async (currentPage) => {
        try {
            const res = await request.get(`/Shop/shop?page=${currentPage}&limit=${postsPerPage}&cate=${category}`);
            setProductList(res.products);
            setPageCount(res.countProduct);
        } catch (error) {}
    };

    const handlePageClick = (event) => {
        let currentPage = event.selected + 1;
        getProducts(currentPage);
    };

    return (
        <div className={cx('container_m')}>
            <div className={cx('row')}>
                <div className={cx('page-shop')}>
                    <div className={cx('sidebar', 'container_m')}>
                        <div className={cx('categories-shop')}>
                            <h5 className={cx('title-category')}>Danh mục</h5>
                            <ul className={cx('title-product-list')}>
                                {categories.map((result) => (
                                    <li key={result.categoryId} className={cx('title-product-item')}>
                                        <div className={cx('product-item')}>
                                            <Image className={cx('')} src={result.image} alt={''} />
                                            <Link className={cx('render-by-category')} to={`/shop?cate=${result.cate}`}>
                                                {result.title}
                                            </Link>
                                        </div>
                                        <div className={cx('count-product')}>{result.count}</div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className={cx('banner-img-sidebar')}>
                            <img src={images.banner11} alt="" />
                            <div className={cx('title-banner-sidebar')}>
                                <p>Oganic</p>
                                <h4>
                                    Sale 17% on <span>Organic</span> Juice
                                </h4>
                            </div>
                        </div>
                    </div>
                    <div className={cx('content-page', 'container_m')}>
                        <div className={cx('row')}>
                            {productList.map((result) => (
                                <ProductItem key={result.productId} listProduct={result} flexCol={'col-3'} />
                            ))}
                        </div>
                        <div className={styles['pagination-container']}>
                            <ReactPaginate
                                onPageChange={handlePageClick}
                                previousLabel={'<'}
                                breakLabel={'...'}
                                nextLabel={'>'}
                                pageCount={pageCount}
                                marginPagesDisplayed={3}
                                pageRangeDisplayed={3}
                                containerClassName={'paginationn'}
                                pageClassName={'page-itemm'}
                                pageLinkClassName={'page-linkk'}
                                previousClassName={'page-itemm'}
                                previousLinkClassName={'page-linkk'}
                                nextClassName={'page-itemm'}
                                nextLinkClassName={'page-linkk'}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Shop;
