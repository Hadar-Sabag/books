const { Link } = ReactRouterDOM

import { BookPreview } from "./BookPreview.jsx";


export function BookList({ books, onRemoveBook, loadingClass }) {

    if (!books.length) return <div>No Books To Show...</div>
    return (
        <React.Fragment>
            <button className="add-btn">
                <Link to={`/book-index/edit/`}>Add Book</Link>
            </button>

            <ul className="book-list container">
                {books.map(book => (
                    <li className={loadingClass} key={book.id}>
                        <BookPreview book={book} />
                        <section>
                            <button onClick={() => onRemoveBook(book.id)}>
                                Remove
                            </button>
                            <button >
                                <Link to={`/book-index/${book.id}`}>Details</Link>
                            </button>
                            <button >
                                <Link to={`/book-index/edit/${book.id}`}>Edit</Link>
                            </button>
                        </section>
                    </li>
                ))}
            </ul>
        </React.Fragment>

    )
}