import styles from './About.module.scss';
import className from 'classnames/bind';
import { Fragment } from 'react';
import images from '~/assets/images/images';

const cx = className.bind(styles);

function About() {
    return (
        <Fragment>
            <div className={cx('about-shop-wrap', 'mt-60')}>
                <div className={cx('container_m')}>
                    <div className={cx('row')}>
                        <div className={cx('about-shop', 'm-auto')}>
                            <div className={cx('about-header',' mb-30','row')}>
                                <div className={cx('col', 'col-xl-6', 'col-12')}>
                                    <div className={cx('about-img-primary')}>
                                        <img src={images.about1} alt="" />
                                    </div>
                                </div>
                                <div className={cx('col', 'col-xl-6', 'col-12', 'about-content-header')}>
                                    <div className={cx('about-title-content-header', )}>Welcome to Nest</div>
                                    <div className={cx('mb-30')}>
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                                        incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                                        nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                        Nullam quis ante etiam sit amet orci egetsedDuis aute irure dolor in
                                        reprehenderit in voluptate id est laborum.
                                    </div>
                                    <div className={cx('mb-30')}>
                                        Ius ferri velit sanctus cu, sed at soleat accusata. Dictas prompta et Ut
                                        placerat legendos interpre.Donec vitae sapien ut libero venenatis faucibus.
                                        Nullam quis ante etiam sit amet orci egetsed do eiusmod tempor incididunt ut
                                        labore et dolore magna aliqua.
                                    </div>

                                    <div className={cx('mb-30')}>
                                        Turpis massa tincidunt dui ut ornare lectus. Auctor elit sed vulputate mi sit
                                        amet. Commodo consequat. Duis aute irure dolor in reprehenderit in voluptate id
                                        est laborum.
                                    </div>

                                    <div className={cx('about-slide-img')}>
                                        <div className={cx('about-slide-img-item')}>
                                            <img src={images.about2} alt="" />
                                        </div>
                                        <div className={cx('about-slide-img-item')}>
                                            <img src={images.about3} alt="" />
                                        </div>
                                        <div className={cx('about-slide-img-item')}>
                                            <img src={images.about4} alt="" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={cx('row', 'mt-60')}>
                                <div className={cx('container')}>
                                    <h1 className={cx('our-team-title-primary')}>What We Provide?</h1>
                                    <div className={cx('row')}>
                                        <div className={cx('col col-4')}>
                                            <div className={cx('featured-card')}>
                                                <img src="assets/img/icon-1.svg" alt="" />
                                                <h4 className={cx('mb-30')}>Best Prices & Offers</h4>
                                                <p>
                                                    There are many variations of passages of Lorem Ipsum available, but
                                                    the majority have suffered alteration in some form
                                                </p>
                                            </div>
                                        </div>
                                        <div className={cx('col col-4')}>
                                            <div className={cx('featured-card')}>
                                                <img src="assets/img/icon-2.svg" alt="" />
                                                <h4 className={cx('mb-30')}>100% Satisfaction</h4>
                                                <p>
                                                    There are many variations of passages of Lorem Ipsum available, but
                                                    the majority have suffered alteration in some form
                                                </p>
                                            </div>
                                        </div>
                                        <div className={cx('col col-4')}>
                                            <div className={cx('featured-card')}>
                                                <img src="assets/img/icon-3.svg" alt="" />
                                                <h4 className={cx('mb-30')}>Great Daily Deal</h4>
                                                <p>
                                                    There are many variations of passages of Lorem Ipsum available, but
                                                    the majority have suffered alteration in some form
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={cx('row', 'about-description', 'mb-30', 'mt-60')}>
                                <div className={cx('col', 'col-4', 'about-description-item')}>
                                    <h1>Who we are</h1>
                                    <p className={cx('mt-30')}>
                                        Volutpat diam ut venenatis tellus in metus. Nec dui nunc mattis enim ut tellus
                                        eros donec ac odio orci ultrices in. ellus eros donec ac odio orci ultrices in.
                                    </p>
                                </div>
                                <div className={cx('col', 'col-4', 'about-description-item')}>
                                    <h1>Our history</h1>
                                    <p className={cx('mt-30')}>
                                        Volutpat diam ut venenatis tellus in metus. Nec dui nunc mattis enim ut tellus
                                        eros donec ac odio orci ultrices in. ellus eros donec ac odio orci ultrices in.
                                    </p>
                                </div>
                                <div className={cx('col', 'col-4', 'about-description-item')}>
                                    <h1>Our mission</h1>
                                    <p className={cx('mt-30')}>
                                        Volutpat diam ut venenatis tellus in metus. Nec dui nunc mattis enim ut tellus
                                        eros donec ac odio orci ultrices in. ellus eros donec ac odio orci ultrices in.
                                    </p>
                                </div>
                            </div>

                            <div className={cx('about-banner')}>
                                <img src={images.about9} alt="" />
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default About;
