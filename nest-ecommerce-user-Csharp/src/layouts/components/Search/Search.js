import styles from './Search.module.scss';
import { useState } from 'react';
import classNames from 'classnames/bind';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function Search() {
    const [dataSearch, setDataSearch] = useState('');
    const navigate = useNavigate();

    const handleSubmit = () => {
        var data = dataSearch;
        setDataSearch('');
        navigate(`/search?query=${data}`);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSubmit();
        }
    };

    return (
        <div className={cx('search')}>
            <div className={cx('input-search-wrap')}>
                <input
                    className={cx('input-search')}
                    placeholder="Tìm kiếm sản phẩm..."
                    value={dataSearch}
                    onChange={(e) => setDataSearch(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <button className={cx('icon-search-header')} onClick={handleSubmit}>
                    <FontAwesomeIcon className={cx('icon-user')} icon={faMagnifyingGlass} />
                </button>
            </div>
        </div>
    );
}

export default Search;
