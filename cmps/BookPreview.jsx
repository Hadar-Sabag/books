export function BookPreview({ book }) {
    
    const { title, thumbnail, listPrice: { amount, currencyCode } } = book
    return (
        <article className="book-preview">
            <h2 className="truncate text-lg font-bold w-full">{title}</h2>
            <h4>Price: {amount} [{currencyCode}]</h4>
            <img src={`../assets/img/${thumbnail}.jpg`} alt="Book Image" />
        </article>
    )
}