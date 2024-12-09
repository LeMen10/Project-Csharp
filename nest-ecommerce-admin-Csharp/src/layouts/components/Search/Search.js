import styles from './Search.module.scss';
import { useState } from 'react';
import classNames from 'classnames/bind';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function Search() {
    const [dataSearch, setDataSearch] = useState('');

    const navigate = useNavigate();

    const handleSubmit = () => {
        
        axios
            .post('http://localhost:9000/search', {
                q:dataSearch
            })
            .then(function (response) {
                var data = response.data.products;
                navigate('/search', { state: { data } });
            })
            .catch(function (error) {
                console.log(error);
            });
    };
    return (
        <div className={cx('search')}>
            <div className={cx('input-search-wrap')}>
                <input
                    className={cx('input-search')}
                    
                    placeholder="Search for items..."
                    value={dataSearch}
                    onChange={(e) => setDataSearch(e.target.value)}
                />
                <button className={cx('icon-search-header')} onClick={handleSubmit}>
                    <FontAwesomeIcon className={cx('icon-user')} icon={faMagnifyingGlass} />
                </button>
            </div>
        </div>
    );
}

export default Search;
