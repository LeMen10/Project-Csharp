import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import className from 'classnames/bind';
import ReactPaginate from 'react-paginate';
import styles from './TrashUsers.module.scss';
import { useNavigate } from 'react-router-dom';
import * as request from '~/utils/request';

const cx = className.bind(styles);

function TrashUsers() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [checkedItems, setCheckedItems] = useState([]);
    const [pageCount, setPageCount] = useState();
    const [currentPageProduct, setCurrentPageProduct] = useState();
    console.log(users)
    const postsPerPage = 10;

    const handleRestoreMultipleUser = async () => {
        var dataIds = checkedItems;
        try {
            await request.put(`/Admin/restore-multiple-users`, dataIds);
            getUsers(currentPageProduct || 1);
        } catch (error) {if (error.response.status === 401) navigate('/login');}
    };

    const handleRestoreUser = async (event) => {
        const id = event.target.dataset.id;
        try {
            const res = await request.put(`/Admin/restore-user/${id}`);
            setUsers(res.users);
            setPageCount(res.countUser);
        } catch (error) {if (error.response.status === 401) navigate('/login');}
    };

    useEffect(() => {
        (async () => {
            try {
                const res = await request.get(`/Admin/trash-users?page=1&limit=${postsPerPage}`);
                setUsers(res.users);
                setPageCount(res.countUser );
            } catch (error) { 
                if (error.response && error.response.status === 401) { navigate('/login'); }
            }
        })();
    }, [navigate]);

    const handleChange = (event) => {
        const item = event.target.value;
        const isChecked = event.target.checked;
        // const targetElement = document.querySelector(`[data-product_id="${item}"]`);
        isChecked
            ? setCheckedItems([...checkedItems, Number(item)])
            : setCheckedItems(checkedItems.filter((i) => i !== Number(item)));
    };

    const handleCheckAll = (event) => {
        const arrItemChecked = document.querySelectorAll(`[name="checkProductItem"]`);
        if (event.target.checked) {
            const newListCart = [];
            users.forEach((item) => {
                newListCart.push(Number(item.userId));
            });
            arrItemChecked.forEach((item) => (item.checked = true));
            setCheckedItems(newListCart);
        } else {
            arrItemChecked.forEach((item) => (item.checked = false));
            setCheckedItems([]);
        }
    };

    const getUsers = async (currentPage) => {
        try {
            const res = await request.get(`/Admin/trash-users?page=${currentPage}&limit=${postsPerPage}`);
            setUsers(res.users);
            setPageCount(res.countUser);
        } catch (error) {if (error.response.status === 401) navigate('/login');}
    };

    const handlePageClick = (event) => {
        let currentPage = event.selected + 1;
        getUsers(currentPage);
        setCurrentPageProduct(currentPage);
    };

    return (
        <div className={cx('container_m')}>
            <div className={cx('mt-4', 'mb-4', 'pd-top-40px')}>
                <div className={cx('action')}>
                    <div className={cx('action-container')}>
                        <div className={cx('actions-wrap')}>
                            <div className={cx('action-list')}>
                                <button
                                    className={cx('btn', 'btn--primary', 'mr-10')}
                                    onClick={handleRestoreMultipleUser}
                                >
                                    Khôi phục
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={cx('table-wrap', 'mt-4')}>
                    <div className={cx('table-container')}>
                        <table className={cx('table')}>
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
                                                checked={checkedItems.length === users.length}
                                            />
                                        </div>
                                    </td>
                                    <th scope="col">Họ và tên</th>
                                    <th scope="col" style={{ textAlign: 'center' }}>
                                        Liên lạc
                                    </th>
                                    <th scope="col" style={{ textAlign: 'center' }}>
                                        Email
                                    </th>
                                    <th scope="col" style={{ textAlign: 'center' }}>
                                        Quyền
                                    </th>
                                    <th scope="col" style={{ textAlign: 'center' }} colSpan="2">
                                        Chỉnh sửa
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length > 0 ? (
                                    users.map((result) => (
                                        <tr key={result.userId}>
                                            <td>
                                                <div className={cx('form-check')}>
                                                    <input
                                                        type="checkbox"
                                                        className={cx('form-check-input', 'check-input-product')}
                                                        value={result.userId}
                                                        name="checkProductItem"
                                                        onChange={handleChange}
                                                        checked={checkedItems.includes(result.userId)}
                                                    />
                                                </div>
                                            </td>
                                            <td>
                                                <p>{result.fullName}</p>
                                            </td>

                                            <td style={{ textAlign: 'center' }}>
                                                <p>{result.phone}</p>
                                            </td>

                                            <td style={{ textAlign: 'center' }}>{result.email}</td>
                                            <td
                                                style={{ textAlign: 'center' }}
                                                className={cx('product-total')}
                                                data-total={result.userId}
                                            >
                                                {result.role}
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                    <span
                                                        className={cx('btn-delete')}
                                                        data-id={result.userId}
                                                        onClick={handleRestoreUser}
                                                    >
                                                        Khôi phục
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className={cx('text-center')}>
                                            Chưa có người dùng nào bị xóa.
                                            <Link to={'/users'}> Quay lại</Link>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {pageCount > 0 && (
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

export default TrashUsers;
