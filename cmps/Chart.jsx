
export function Chart({data}) {
    return (
        <ul className="chart">
            {
                data.map((item) =>
                    <React.Fragment>
                        <li key={item.title}>
                            <span title={item.title}
                                style={{ height: item.value + '%' }}>
                                {item.value + '%'}
                            </span>
                            <p className="dashbored-title">{item.title}</p>
                        </li>
                    </React.Fragment>
                )
            }
        </ul>
    )
}
    
