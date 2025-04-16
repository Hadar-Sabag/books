import { ReviewList } from "../cmps/ReviewList.jsx"
import { bookService } from "../services/book.service.js"
const { useParams, useNavigate, Link } = ReactRouterDOM

const { useState, useEffect } = React

export function BookDetails() {

    const [book, setBook] = useState(null)
    const params = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        loadBook()
    }, [params.bookId])

    function loadBook() {
        bookService.get(params.bookId)
            .then(book => setBook(book))
            .catch(err => console.log('err:', err))
    }

    function onBack() {
        navigate('/book-index')
    }

    function onPagesCount(pageCount) {

        if (pageCount > 500) return 'Serious Reading'
        else if (pageCount > 200) return 'Decent Reading'
        else if (pageCount < 100) return 'Light Reading'

    }
    function onPublishDate(publishedDate) {
        const currentYear = new Date().getFullYear();
        if (currentYear - publishedDate > 10) return '- Vintage'
        else if (currentYear - publishedDate <= 1) return '- New'
        else return ''
    }

    function onBookPriceColor(amount) {
        if (amount > 150) return 'red'
        if (amount < 20) return 'green'
        else return ''
    }

    if (!book) return <div>Loading...</div>
    const { title, subtitle, authors, pageCount, categories, language, publishedDate, description, thumbnail, listPrice: { amount, currencyCode, isOnSale } } = book
    return (
        <React.Fragment>
            <section className="book-details container">
                <div className="book-title">
                    <h1>{title}</h1>
                    <h3>{subtitle}</h3>
                    <img className={`book-on-sale ${!isOnSale ? 'hidden' : ''}`} src="../assets/img/on-sale.png" alt="" />
                </div>
                <h1 className="book-price"><span className={onBookPriceColor(amount)}>{amount}</span> [{currencyCode}]</h1>
                <p className="book-description">{description}</p>
                <p className="book-publish-date">Released : {publishedDate} {onPublishDate(publishedDate)} </p>
                <p className="book-page-count"> {pageCount} Pages - {onPagesCount(pageCount)} </p>
                <p className="book-categories">Categories : {[...categories]}</p>
                <p className="book-lang">language : {language}</p>
                <img className="book-img" src={`../assets/img/${thumbnail}.jpg`} alt="Book Image" />
                <p className="book-author">Authors : {[...authors]}</p>
                <button onClick={onBack}>Back</button>
            </section>
            <div className="next-prev-btns">
                <button className="btn prev-btn"><Link to={`/book-index/${book.prevBookId}`}>Prev</Link></button>
                <button className="btn next-btn"><Link to={`/book-index/${book.nextBookId}`}>Next</Link></button>
            </div>
            <button className="add-review-btn">Add Review</button>
            <div className="review-list-container">
                <ReviewList />
            </div>
        </React.Fragment>
    )
}
