import { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import className from 'classnames/bind';
import styles from './Orders.module.scss';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import * as request from '~/utils/request';

const cx = className.bind(styles);

function Orders() {
    const navigate = useNavigate();
    const [orderList, setOrderList] = useState([]);
    const [pageCount, setPageCount] = useState('');

    const postsPerPage = 12;

    const getOrder = async (currentPage) => {
        try {
            const res = await request.get(`/Admin/get-orders?page=${currentPage}&limit=${postsPerPage}`);
            setOrderList(res.orderDetails);
            setPageCount(res.countProduct);
        } catch (error) {
            if (error.response.status === 401) navigate('/login');
        }
    };

    const updateStatusOrder = async (event, dataId) => {
        const status = event.target.value;
        const orderDetailId = dataId;
        console.log(status)
        try {
            await request.put(`/Admin/update-status-order/${orderDetailId}`, { status });
            getOrder(1);
        } catch (error) {
            if (error.response.status === 401) navigate('/login');
        }
    };

    useEffect(() => {
        const fetchApi = async () => {
            try {
                const res = await request.get(`/Admin/get-orders?page=1&limit=${postsPerPage}`);
                console.log(res)
                setOrderList(res.orderDetails);
                setPageCount(res.countProduct);
            } catch (error) { if (error.response.status === 401) navigate('/login'); }
        };
        fetchApi();
    }, [navigate]);

    const handlePageClick = (event) => {
        let currentPage = event.selected + 1;
        getOrder(currentPage);
    };

    return (
        <div className={cx('container_m')}>
            <div className={cx('mt-4', 'mb-4', 'pd-top-10px')}>
                <div className={cx('table-wrap', 'mt-4')}>
                    <div className={cx('table-container')}>
                        {orderList.length > 0 ? (
                        <table className={cx('table')}>
                            <thead>
                                <tr>
                                    <th scope="col" style={{ textAlign: 'center' }}>
                                        Mã
                                    </th>
                                    <th scope="col" style={{ textAlign: 'center' }}>
                                        Khách hàng
                                    </th>
                                    <th scope="col" style={{ textAlign: 'center' }}>
                                        Thanh toán
                                    </th>
                                    <th scope="col" style={{ textAlign: 'center' }}>
                                        Trạng thái
                                    </th>
                                    <th scope="col" style={{ textAlign: 'center' }}>
                                        Hành động
                                    </th>
                                    <th scope="col" style={{ textAlign: 'center' }}>
                                        Ngày tạo
                                    </th>
                                    <th scope="col" style={{ textAlign: 'center' }}>
                                        Tổng tiền
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {orderList.length > 0 && (
                                    orderList.map((result) => (
                                        <tr key={result.orderDetailId}>
                                            <td>
                                                <p style={{ textAlign: 'center' }}>#{result.orderDetailId}</p>
                                            </td>
                                            <td>
                                                <p style={{ textAlign: 'center' }}>{result.fullName}</p>
                                            </td>
                                            <td style={{ textAlign: 'center' }}>{result.paymentStatus}</td>
                                            <td style={{ textAlign: 'center' }}>{result.status}</td>
                                            <td style={{ textAlign: 'center' }} data-id={result.orderDetailId}>
                                                <select
                                                    disabled={
                                                        result.status === 'Đã hủy' || result.status === 'Hoàn thành'
                                                    }
                                                    onChange={(event) => updateStatusOrder(event, result.orderDetailId)}
                                                    className={cx('select-status')}
                                                    defaultValue={result.status}
                                                >
                                                    <option>Đang chờ</option>
                                                    <option>Đang giao</option>
                                                    <option>Hoàn thành</option>
                                                    <option>Đã hủy</option>
                                                </select>
                                            </td>
                                            <td style={{ textAlign: 'center' }}>{result.createDate}</td>
                                            <td
                                                style={{ textAlign: 'center' }}
                                                className={cx('')}
                                                data-total={result.orderDetailId}
                                            >
                                                {result.total}$
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>): (
                                    <tr>
                                        <td colSpan="5" className={cx('text-center')}>
                                            Chưa có đơn hàng nào để xử lý. Hãy kiên nhẫn chờ nhá !!!
                                        </td>
                                    </tr>
                                )}
                    </div>
                </div>
                {pageCount && (
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
                )}
            </div>
        </div>
    );
}

export default Orders;
