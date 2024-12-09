import { Fragment } from 'react';
import className from 'classnames/bind';
import styles from './Contact.module.scss';
import images from '~/assets/images/images';

const cx = className.bind(styles);

function Contact() {
    return (
        <Fragment>
            <div className={cx('page-contact-wrap')}>
                <div className={cx('body-main_page')}>
                    <div className={cx('container_m')}>
                        <div className={cx('row')}>
                            <div className={cx('first-body_main')}>
                                <div className={cx('row', 'align-items-end')}>
                                    <div className={cx('col-first-body_main')}>
                                        <h4 className={cx('title_first-body')}>How can help you ?</h4>
                                        <h1 className={cx('content_first_main-page')}>
                                            Let us know how we can help you
                                        </h1>
                                        <p className={cx('mb-30')}>
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus,
                                            luctus nec ullamcorper mattis, pulvinar dapibus leo.
                                        </p>
                                        <p>
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus,
                                            luctus nec ullamcorper mattis, pulvinar dapibus leo.`
                                        </p>
                                    </div>
                                    <div className={cx('item_frist-body')}>
                                        <div className={cx('row')}>
                                            <div className={cx('item_first')}>
                                                <h5 className={cx('title-item')}>01. Visit Feedback</h5>
                                                <p>
                                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit
                                                    tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
                                                </p>
                                            </div>
                                            <div className={cx('item_first')}>
                                                <h5 className={cx('title-item')}>02. Employer Services</h5>
                                                <p>
                                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit
                                                    tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
                                                </p>
                                            </div>
                                            <div className={cx('item_first')}>
                                                <h5 className={cx('title-item')}>03. Billing Inquiries</h5>
                                                <p>
                                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit
                                                    tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
                                                </p>
                                            </div>
                                            <div className={cx('item_first')}>
                                                <h5 className={cx('title-item')}>04. General Inquiries</h5>
                                                <p>
                                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit
                                                    tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={cx('container_m')}>
                        <div className={cx('row')}>
                            <div className={cx('last_main-page')}>
                                
                                <div className={cx('row')}>
                                    <div className={cx('info_Contact-from')}>
                                        <h5 className={cx('titel-Contact_from')}>Contact form</h5>
                                        <h2 className={cx('titel-Contact_from_2')}>Drop Us a Line</h2>
                                        <p className={cx('text-Contact_from')}>
                                            Your email address will not be published. Required fields are marked *
                                        </p>
                                        <form className={cx('contact-from-style')} action="">
                                            <div className={cx('row')}>
                                                <div className={cx('from_Contact')}>
                                                    <div className={cx('input-style')}>
                                                        <input name="name" placeholder="First Name" type="text" />
                                                    </div>
                                                </div>
                                                <div className={cx('from_Contact')}>
                                                    <div className={cx('input-style', 'input-style-odd')}>
                                                        <input name="email" placeholder="Your Email" type="email" />
                                                    </div>
                                                </div>
                                                <div className={cx('from_Contact')}>
                                                    <div className={cx('input-style')}>
                                                        <input name="telephone" placeholder="Your Phone" type="tel" />
                                                    </div>
                                                </div>
                                                <div className={cx('from_Contact')}>
                                                    <div className={cx('input-style', 'input-style-odd')}>
                                                        <input name="subject" placeholder="Subject" type="text" />
                                                    </div>
                                                </div>
                                                <div className={cx('from_Contact-1')}>
                                                    <div className={cx('textarea-style')}>
                                                        <textarea name="messenge" placeholder="Messenge"></textarea>
                                                    </div>
                                                </div>
                                                <button className={cx('btn-Messenge')} type="submit">
                                                    Send message
                                                </button>
                                            </div>
                                        </form>
                                        <p className={cx('form-messenger')}></p>
                                    </div>
                                    <div className={cx('img_Contact-1')}>
                                        <img className={cx('img_Contact')} src={images.contact2} alt="" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}
export default Contact;
