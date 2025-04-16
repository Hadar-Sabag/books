import { bookService } from "../services/book.service.js"
import { TextboxRating } from "./TextboxRating.jsx"
import { SelectRating } from "./dynamic-inputs/SelectRating.jsx"
import { StarRating } from "./dynamic-inputs/StarRating.jsx"

const { useState, useRef, useEffect } = React

export function AddReview({ saveReview, toggleReview }) {
    
    const inputRef = useRef()
    const [review, setReview] = useState(bookService.getEmptyReview())

    useEffect(() => {
        inputRef.current.focus()
    }, [])

    function onAddReview(ev) {
        ev.preventDefault()
        // review.date = new Date(date).getTime()
        saveReview(review).then(toggleReview)
    }

    function handleChange({ target }) {
        const { value, name: field } = target
        setReview((prevReview) => ({ ...prevReview, [field]: value }))
    }

    function onChangeCmpType(selectedType) {
        setCmpType(selectedType)
    }


    const { fullName, date, txt, rating } = review
    return (
        <section className='review-add'>
            <form onSubmit={onAddReview} className='review-form'>
                <div className='review-modal'>
                    <h1>Add review</h1>
                    <button className='btn-toggle-modal'
                        onClick={toggleReview}>X
                    </button>
                    <label className='bold-txt' htmlFor='fullname'>Full name:</label>
                    <input
                        autoFocus
                        ref={inputRef}
                        placeholder='Enter full name'
                        name='fullName'
                        type='text'
                        id='fullname'
                        value={fullName}
                        onChange={handleChange}
                        autoComplete='off'
                    />
                    <label className='bold-txt' htmlFor='date'>Date:</label>

                    <input
                        type='date'
                        id='date'
                        name='date'
                        value={date}
                        onChange={handleChange}
                    />


                    <section>
                        <SelectRating handleChange={handleChange} rating={rating} />
                    </section>
                    <TextboxRating handleChange={handleChange} txt={txt} />
                    <button>Save</button>
                </div>
            </form>
        </section>
    )
}
