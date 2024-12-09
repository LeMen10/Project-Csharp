import React from 'react';

import className from 'classnames/bind';
import styles from './Footer.module.scss';
// import Image from '~/components/Image';
import { Link } from 'react-router-dom';
import images from '~/assets/images/images';

const cx = className.bind(styles);

function Footer() {
    return (
        <div className={cx('footer')}>
            <div className={cx('container_m')}>
                <div className={cx('footer-body')}>
                    <div className={cx('footer-body__item')}>
                        <img className={cx('icon-logo')} src={images.logo} alt="nest-ecommerce" />
                        <p className={cx('footer-logo__heading')}>Awesome grocery store website template</p>
                        <ul className={cx('contact-info')}>
                            <li className={cx('footer-logo__info')}>
                                <img src={images.iconLocation} alt="" />
                                <strong>Address:</strong>
                                <span>5171 W Campbell Ave undefined Kent, Utah 53127 United States</span>
                            </li>
                            <li className={cx('footer-logo__info')}>
                                <img src={images.iconContact} alt="" />
                                <strong> Call Us:</strong>
                                <span>(+91) - 540-025-124553</span>
                            </li>
                            <li className={cx('footer-logo__info')}>
                                <img src={images.iconEmail} alt="" />
                                <strong>Email:</strong>
                                <span>sale@Nest.com</span>
                            </li>
                            <li className={cx('footer-logo__info')}>
                                <img src={images.iconClock} alt="" />
                                <strong>Hours:</strong>
                                <span>10:00 - 18:00, Mon - Sat</span>
                            </li>
                        </ul>
                    </div>
                    <div className={cx('footer-body__item')}>
                        <h4 className={cx('footer-body_title')}>Company</h4>
                        <ul className={cx('contact-info')}>
                            <li>
                                <Link to={''} href="#" className={cx('footer-item__link')}>
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link to={''} href="#" className={cx('footer-item__link')}>
                                    Delivery Information
                                </Link>
                            </li>
                            <li>
                                <Link to={''} href="#" className={cx('footer-item__link')}>
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link to={''} href="#" className={cx('footer-item__link')}>
                                    Terms &amp; Conditions
                                </Link>
                            </li>
                            <li>
                                <Link to={''} href="#" className={cx('footer-item__link')}>
                                    Contact Us
                                </Link>
                            </li>
                            <li>
                                <Link to={''} href="#" className={cx('footer-item__link')}>
                                    Support Center
                                </Link>
                            </li>
                            <li>
                                <Link to={''} href="#" className={cx('footer-item__link')}>
                                    Careers
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className={cx('footer-body__item')}>
                        <h4 className={cx('footer-body_title')}>Account</h4>
                        <ul className={cx('contact-info')}>
                            <li>
                                <Link to={''} href="#" className={cx('footer-item__link')}>
                                    Sign In
                                </Link>
                            </li>
                            <li>
                                <Link to={''} href="#" className={cx('footer-item__link')}>
                                    View Cart
                                </Link>
                            </li>
                            <li>
                                <Link to={''} href="#" className={cx('footer-item__link')}>
                                    My Wishlist
                                </Link>
                            </li>
                            <li>
                                <Link to={''} href="#" className={cx('footer-item__link')}>
                                    Track My Order
                                </Link>
                            </li>
                            <li>
                                <Link to={''} href="#" className={cx('footer-item__link')}>
                                    Help Ticket
                                </Link>
                            </li>
                            <li>
                                <Link to={''} href="#" className={cx('footer-item__link')}>
                                    Shipping Details
                                </Link>
                            </li>
                            <li>
                                <Link to={''} href="#" className={cx('footer-item__link')}>
                                    Compare products
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className={cx('footer-body__item')}>
                        <h4 className={cx('footer-body_title')}>Corporate</h4>
                        <ul className={cx('contact-info')}>
                            <li>
                                <Link to={''} href="#" className={cx('footer-item__link')}>
                                    Become a Vendor
                                </Link>
                            </li>
                            <li>
                                <Link to={''} href="#" className={cx('footer-item__link')}>
                                    Affiliate Progra
                                </Link>
                            </li>
                            <li>
                                <Link to={''} href="#" className={cx('footer-item__link')}>
                                    Farm Business
                                </Link>
                            </li>
                            <li>
                                <Link to={''} href="#" className={cx('footer-item__link')}>
                                    Farm Careers
                                </Link>
                            </li>
                            <li>
                                <Link to={''} href="#" className={cx('footer-item__link')}>
                                    Our Suppliers
                                </Link>
                            </li>
                            <li>
                                <Link to={''} href="#" className={cx('footer-item__link')}>
                                    Accessibility
                                </Link>
                            </li>
                            <li>
                                <Link to={''} href="#" className={cx('footer-item__link')}>
                                    Promotions
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className={cx('footer-body__item')}>
                        <h4 className={cx('footer-body_title')}>Popular</h4>
                        <ul className={cx('contact-info')}>
                            <li>
                                <Link to={''} href="#" className={cx('footer-item__link')}>
                                    Milk & Flavoured Milk
                                </Link>
                            </li>
                            <li>
                                <Link to={''} href="#" className={cx('footer-item__link')}>
                                    Butter and Margarine
                                </Link>
                            </li>
                            <li>
                                <Link to={''} href="#" className={cx('footer-item__link')}>
                                    Eggs Substitutes
                                </Link>
                            </li>
                            <li>
                                <Link to={''} href="#" className={cx('footer-item__link')}>
                                    Marmalades
                                </Link>
                            </li>
                            <li>
                                <Link to={''} href="#" className={cx('footer-item__link')}>
                                    Sour Cream and Dips
                                </Link>
                            </li>
                            <li>
                                <Link to={''} href="#" className={cx('footer-item__link')}>
                                    Tea & Kombucha
                                </Link>
                            </li>
                            <li>
                                <Link to={''} href="#" className={cx('footer-item__link')}>
                                    Cheese
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className={cx('footer-last__line')}></div>
                <div className={cx("footer-last")}>
                    <div className={cx("footer-last__info")}>
                        <p className={cx("font-last__info")}>
                            © 2022,<strong className={cx("color-font__lasinfo")}>Nest</strong> - HTML Ecommerce Template
                        </p>
                    </div>
                    <div className={cx("footer-last__info")}>
                        <div className={cx("footer-hotline")}>
                            <li className={cx("footer-last__infoicon")}>
                                <img className={cx("hotline")} src={images.iconPhone} alt="" />
                                <strong>1900 - 6666</strong>
                                <span>Working 8:00 - 22:00</span>
                            </li>
                        </div>
                        <div className={cx("footer-hotline__02")}>
                            <li className={cx("footer-last__infoicon")}>
                                <img className={cx("hotline")} src={images.iconPhone} alt="" />
                                <strong>1900 - 8888</strong>
                                <span>24/7 Support Center</span>
                            </li>
                        </div>
                    </div>
                    <div className={cx("footer-last__info")}>
                        <div className={cx("socical-info")}>
                            <div className={cx("mobile-social-icon")}>
                                <h6 className={cx("last-title")}>Follow Us</h6>
                                <Link to={'https://www.facebook.com/meennn.vv'} style={{ marginLeft: '4px'}}>
                                    <img className={cx("mobile-icon")} src={images.iconFb} alt="" />
                                </Link>
                                <Link to={'#'} style={{ marginLeft: '4px'}}>
                                    <img className={cx("mobile-icon")} src={images.iconIns} alt="" />
                                </Link>
                                <Link to={'#'} style={{ marginLeft: '4px'}}>
                                    <img className={cx("mobile-icon")} src={images.iconTwitter} alt="" />
                                </Link>
                                <Link to={'#'} style={{ marginLeft: '4px'}}>
                                    <img className={cx("mobile-icon")} src={images.iconYt} alt="" />
                                </Link>
                                <Link to={'#'} style={{ marginLeft: '4px'}}>
                                    <img className={cx("mobile-icon")} src={images.iconPinterest} alt="" />
                                </Link>
                            </div>
                            <p className={cx("")}>Up to 15% discount on your first subscribe</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Footer;
