import { loadFromStorage, makeId, saveToStorage } from './util.service.js'
import { storageService } from './async-storage.service.js'

const BOOK_KEY = 'bookDB'
_createBooks()

export const bookService = {
    query,
    get,
    remove,
    save,
    getEmptyBook,
    getDefaultFilter,
    getFilterFromSearchParams,
    getCategoryStats,
    removeReview,
    getEmptyReview,
    saveReview
}

function query(filterBy = {}) {
    return storageService.query(BOOK_KEY)
        .then(books => {
            if (filterBy.txt) {
                const regExp = new RegExp(filterBy.txt, 'i')
                books = books.filter(book => regExp.test(book.title))
            }
            if (filterBy.price) {
                books = books.filter(book => book.listPrice.amount >= filterBy.price)
            }

            return books
        })
}

function get(bookId) {
    return storageService.get(BOOK_KEY, bookId).then(_setNextPrevBookId)
}

function saveReview(bookId, reviewToSave) {
    console.log(bookId, reviewToSave);
    
    reviewToSave.date = new Date(reviewToSave.date).getTime()
    return get(bookId).then(book => {
        const review = _createReview(reviewToSave)
        book.reviews.unshift(review)
        return save(book).then(() => review)
    })
}

function getEmptyReview() {
    return {
        fullName: 'new name',
        rating: 0,
        date: new Date().toISOString().slice(0, 10),
        txt: '',
        selected: 0,
    }
}


function removeReview(bookId, reviewId) {
    return get(bookId).then(book => {
        const newReviews = book.reviews.filter((review) => review.id !== reviewId)
        book.reviews = newReviews
        return save(book)
    })
}

function remove(bookId) {
    // return Promise.reject('Oh No!')
    return storageService.remove(BOOK_KEY, bookId)
}

function save(book) {
    if (book.id) {
        return storageService.put(BOOK_KEY, book)
    } else {
        return storageService.post(BOOK_KEY, book)
    }
}
function getDefaultFilter() {
    return { txt: '', price: '' }
}

function getFilterFromSearchParams(searchParams) {
    const txt = searchParams.get('txt') || ''
    const price = searchParams.get('price') || ''
    return {
        txt,
        price
    }
}

function getEmptyBook(title = '', description = '', thumbnail = '') {
    return {
        title,
        description,
        thumbnail,
        listPrice: {
            amount: '',
            currencyCode: 'EUR',
            isOnSale: ''
        },
        reviews: []
    }
}

function _createBooks() {
    const ctgs = ['Love', 'Fiction', 'Poetry', 'Computers', 'Religion']
    let books = loadFromStorage(BOOK_KEY) || []
    console.log(books);
    
    if (!books || !books.length) {
        for (let i = 0; i < 20; i++) {
            const book = {
                id: utilService.makeId(),
                title: utilService.makeLorem(2),
                subtitle: utilService.makeLorem(4),
                authors: [
                    utilService.makeLorem(1)
                ],
                publishedDate: utilService.getRandomIntInclusive(1950, 2024),
                description: utilService.makeLorem(20),
                pageCount: utilService.getRandomIntInclusive(20, 600),
                categories: [ctgs[utilService.getRandomIntInclusive(0, ctgs.length - 1)]],
                thumbnail: `${i + 1}`,
                language: "en",
                listPrice: {
                    amount: utilService.getRandomIntInclusive(80, 500),
                    currencyCode: "EUR",
                    isOnSale: Math.random() > 0.7
                },
                reviews: []
            }
            books.push(book)
        }
    }
    saveToStorage(BOOK_KEY, books)
}

function _createReview(reviewToSave) {
    return {
        id: utilService.makeId(),
        ...reviewToSave,
    }
}


function _createBook(title, description, thumbnail, { amount, currencyCode, isOnSale }) {
    const book = getEmptyBook(title, description, thumbnail, { amount, currencyCode, isOnSale })
    book.id = makeId()
    return book
}


function _setNextPrevBookId(book) {
    return query().then((books) => {
        const bookIdx = books.findIndex((currBook) => currBook.id === book.id)
        const nextBook = books[bookIdx + 1] ? books[bookIdx + 1] : books[0]
        const prevBook = books[bookIdx - 1] ? books[bookIdx - 1] : books[books.length - 1]
        book.nextBookId = nextBook.id
        book.prevBookId = prevBook.id
        return book
    })
}

function getCategoryStats() {
    return storageService.query(BOOK_KEY)
        .then(books => {
            const bookCountByCategoryMap = _getBookCountByCategoryMap(books)
            const data = Object.keys(bookCountByCategoryMap)
                .map(category => ({
                    title: category,
                    value: Math.round((bookCountByCategoryMap[category] / books.length) * 100)
                }))
            return data
        })
}

function _getBookCountByCategoryMap(books) {
    const bookCountByCategoryMap = books.reduce((map, book) => {
        if (!map[book.categories]) map[book.categories] = 0
        map[book.categories]++
        return map
    }, {})
    console.log(bookCountByCategoryMap)
    return bookCountByCategoryMap
}