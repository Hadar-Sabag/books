import { AddReview } from "../cmps/AddReview.jsx"
import { ReviewList } from "../cmps/ReviewList.jsx"
import { bookService } from "../services/book.service.js"
import { showErrorMsg } from "../services/event-bus.service.js";

const { useParams, useNavigate, Link } = ReactRouterDOM
const { useState, useEffect } = React


export function BookDetails() {

    const [book, setBook] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isLoadingReview, setIsLoadingReview] = useState(false)
    const [isShowReviewModal, setIsShowReviewModal] = useState(null)

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

    function onToggleReviewModal() {
        setIsShowReviewModal((prevIsReviewModal) => !prevIsReviewModal)
    }

    function onSaveReview(reviewToAdd) {
        setIsLoadingReview(true)
        return bookService.saveReview(book.id, reviewToAdd)
            .then((review => {
                setBook(prevBook => {
                    const reviews = [review, ...prevBook.reviews]
                    return { ...prevBook, reviews }
                })
            }))
            .catch(() => showErrorMsg(`Review to ${book.title} Failed!`))
            .finally(() => setIsLoadingReview(false))
    }

    function onRemoveReview(reviewId) {
        setIsLoadingReview(true)
        bookService.removeReview(book.id, reviewId)
            .then(() => {
                setBook(book => {
                    const filteredReviews = book.reviews.filter(review => review.id !== reviewId)
                    return { ...book, reviews: filteredReviews }
                })
            })
            .finally(() => setIsLoadingReview(false))
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
            <hr />

            <button className="add-review-btn" onClick={onToggleReviewModal}>Add Review</button>
            {isShowReviewModal && (
                <AddReview
                    toggleReview={onToggleReviewModal}
                    saveReview={onSaveReview}
                />
            )}

            {!!book.reviews.length && <div className='review-container'>
                {!isLoadingReview
                    ? <ReviewList reviews={book.reviews} onRemoveReview={onRemoveReview} />
                    : <div className="loader">Loading reviews..</div>
                }
            </div>}

        </React.Fragment>
    )
}
