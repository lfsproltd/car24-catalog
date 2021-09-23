import React from 'react';
import Footer from '../Footer';
import Header from '../Header';
import LeftNav from '../LeftNav';

function AdminLayout(LoadedComponent, leftnav = true, header = true, footer = true) {

    return (props) => {
        return (
            <>
                {leftnav && <LeftNav />}
                <div className="wrapper">
                    <div id="content">
                        <Header />
                        <LoadedComponent {...props} />
                        {footer && <Footer />}
                    </div>
                </div>

            </>
        );
    };
}

export default AdminLayout;
