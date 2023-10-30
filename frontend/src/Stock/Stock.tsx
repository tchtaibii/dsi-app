import './Stock.scss';

const Stock = () => {

    return (
        <div className='ContentMain'>
            <div className="header">
                <h1>Stock</h1>
            </div>
            <div className="main">
                <div className="headerStock">
                    <div className="s1h">
                        <p style={{width : '50%'}}>Type</p>
                        <p>Demande</p>
                        <p>Livré</p>
                        <p>Affécté</p>
                    </div>
                    <div style={{paddingLeft : '1.5rem'}} className="s1h">
                        <p style={{width : '50%'}}>Type</p>
                        <p>Demande</p>
                        <p>Livré</p>
                        <p>Affécté</p>
                    </div>
                </div>
                <div className="stocks">
                    <div className="stock"></div>
                    <div className="stock"></div>
                </div>
            </div>
        </div>
    )
}
export default Stock