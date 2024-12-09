import PropTypes from 'prop-types'
import classNames from 'classnames';
import { useState, forwardRef } from 'react';
import images from '~/assets/images/images';
import styles from './Image.module.scss'
const Image = forwardRef(({ src, alt, className, fallback: customFallback = images.noImage, ...props }, ref) => {
    const [fallback, setFallback] = useState('')
    const handleErrol = () => {
        setFallback(customFallback)
    }
    return ( 
        <img className={classNames(styles.wapper, className)} 
        ref={ref} 
        src={fallback || src} 
        alt={alt} {...props} 
        onError={handleErrol}
        />
    );
});

Image.propTypes = {
    src: PropTypes.string,
    alt: PropTypes.string,
    className: PropTypes.string,
    fallback: PropTypes.string,
}

export default Image;