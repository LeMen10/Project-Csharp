import React, { Fragment } from 'react';
import className from 'classnames/bind';
import styles from './Search.module.scss';
import ProductItem from '~/layouts/components/ProductItem/ProductItem';
import ReactPaginate from 'react-paginate';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import * as request from '~/utils/request';

const cx = className.bind(styles);

function Search() {
    const query_String = window.location.search;
    const urlParam = new URLSearchParams(query_String);
    const query = urlParam.get('query');
    const [productList, setProductList] = useState([]);
    const [pageCount, setPageCount] = useState();
    const postsPerPage = 10;

    const location = useLocation();
    const [urlParams, setUrlParams] = useState(new URLSearchParams(location.search));

    useEffect(() => {
        setUrlParams(new URLSearchParams(location.search));
    }, [location]);

    useEffect(() => {
        const fetchApi = async () => {
            try {
                const res = await request.post(`/Site/search?query=${query}&page=${1}&limit=${postsPerPage}`);
                setProductList(res.result);
                setPageCount(res.countProduct);
            } catch (error) {}
        };

        fetchApi();
    }, [query, urlParams]);

    const getProducts = async (currentPage) => {
        try {
            const res = await request.post(`Site/search?query=${query}&page=${currentPage}&limit=${postsPerPage}`);
            setProductList(res.result);
            setPageCount(res.countProduct);
        } catch (error) {}
    };

    const handlePageClick = (event) => {
        let currentPage = event.selected + 1;
        getProducts(currentPage);
    };
    return (
        <div className={cx('container_m')}>
            <div className={cx('title-page')}>
                <h3>Tìm kiếm</h3>
            </div>
            <div className={cx('result-title')}>
                <p>
                    Kết quả tìm kiếm cho "<span>{query}</span>".
                </p>
            </div>
            <div className={cx('row')}>
                <div className={cx('page-shop')}>
                    {productList.length > 0 ? (
                        <Fragment>
                            <div className={cx('content-page', 'container_m')}>
                                <div className={cx('row')}>
                                    {productList.map((result) => (
                                        <ProductItem key={result.productId} listProduct={result} flexCol={'col-2-4'} />
                                    ))}
                                </div>
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
                        </Fragment>
                    ) : (
                        <Fragment>
                            <p className={cx('no-result')}>Không có sản phẩm mà bạn cần tìm.</p>
                        </Fragment>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Search;
