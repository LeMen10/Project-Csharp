import PropTypes from 'prop-types';
import className from 'classnames/bind';
// import className from 'classname';
import Header from '../components/Header/Header';

import Sidebar from '../components/Sidebar/Sidebar';
import styles from './DefaultLayout.module.scss';

const cx = className.bind(styles);

function DefaultLayout({ children }) {
    return (
        <div className={cx('wrapper')}>
            <Sidebar />
            <div className={cx('content')}>
                <Header />
                <div className={cx('children')}>{children}</div>
            </div>
        </div>
    );
}

DefaultLayout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default DefaultLayout;
