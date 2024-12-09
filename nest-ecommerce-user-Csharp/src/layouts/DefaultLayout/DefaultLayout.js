import PropTypes from 'prop-types';
import React from 'react';
import className from 'classnames/bind';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import styles from './DefaultLayout.module.scss';
import { useState } from 'react';

const cx = className.bind(styles);
function DefaultLayout({ children }) {
    const [headerVariable, setHeaderVariable] = useState('');

    const handleSetHeaderVariable = (newValue) => {
        setHeaderVariable(newValue);
    };

    return (
        <div className={cx('wrapper')}>
            <Header variable={headerVariable}/>
            <div className={cx('content')}>
                {React.cloneElement(children, { setHeaderVariable: handleSetHeaderVariable })}
            </div>
            <Footer />
        </div>
    );
}

DefaultLayout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default DefaultLayout;
