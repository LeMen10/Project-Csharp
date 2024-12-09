import className from 'classnames/bind';
import styles from './TypicalComponent.module.scss';

const cx = className.bind(styles);

function TypicalComponent({ data }) {
    return (
        <div className={cx('typical-products-list')}>
            {data.map((item) => (
                <div className={cx('typical-products-item')} key={item.title}>
                    <div className={cx('row')}>
                        <div className={cx('col', 'col-xl-4', 'col-lg-4', 'col-12', 'typical-products-img')}>
                            <img src={item.img} alt="" />
                        </div>
                        <div className={cx('col', 'col-xl-8', 'col-lg-8', 'col-12', 'typical-products-item-title')}>
                            <h6>{item.title}</h6>
                            <p className={cx('typical-products-item-price')}>${item.price}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default TypicalComponent;
