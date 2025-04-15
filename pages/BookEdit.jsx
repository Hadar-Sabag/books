import { bookService } from "../services/book.service.js"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
const { useEffect } = React
const { useNavigate, useParams, Link } = ReactRouterDOM

const { useState } = React

export function BookEdit() {

    const [bookToEdit, setBookToEdit] = useState(bookService.getEmptyBook())
    const [isLoading, setIsLoading] = useState(false)

    const navigate = useNavigate()
    const { bookId } = useParams()

    useEffect(() => {
        if (bookId) loadBook()
    }, [])

    function loadBook() {
        setIsLoading(true)
        bookService.get(bookId)
            .then(book => setBookToEdit(book))
            .catch(err => console.log('err:', err))
            .finally(() => setIsLoading(false))
    }

    function handleChange({ target }) {
        const field = target.name
        let value = target.value
        switch (target.type) {
            case 'number':
            case 'range':
                value = +value
                break;

            case 'checkbox':
                value = target.checked
                break
        }
        setBookToEdit(prevBook => ({ ...prevBook, [field]: value }))
    }

    function handleChangePrice({ target }) {
        const field = target.name
        let value = target.value
        switch (target.type) {
            case 'number':
            case 'range':
                value = +value
                break;

            case 'checkbox':
                value = target.checked
                break
        }
        setBookToEdit((prevBook) => ({ ...prevBook, listPrice: { ...prevBook.listPrice, [field]: value } }))
    }

    function onSaveBook(ev) {
        ev.preventDefault()
        bookService.save(bookToEdit)
            .then(() => {
                navigate('/book-index')
                showSuccessMsg('Book Saved!')
            })
            .catch(err => {
                console.log('Cannot save book!:', err)
                showErrorMsg('Cannot save book!')
            })
    }

    const loadingClass = isLoading ? 'loading' : ''
    const { title, listPrice } = bookToEdit

    return (
        <section className={"book-edit " + loadingClass}>
            <h1>{bookId ? 'Edit' : 'Add'} Book</h1>
            <form onSubmit={onSaveBook}>
                <label htmlFor="title">Title</label>
                <input value={title} onChange={handleChange} type="text" name="title" id="title" />

                <label htmlFor="price">Price</label>
                <input value={listPrice.amount} onChange={handleChangePrice} type="number" name="amount" id="price" />
                <div>
                    <button>Save</button>
                    <button type="button">
                        <Link to='/book-index'>Back</Link>
                    </button>
                </div>
            </form>
        </section>
    )


}