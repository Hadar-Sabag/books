import { Chart } from "../cmps/Chart.jsx"
import { bookService } from "../services/book.service.js"
// Calls bookService.query() to get all books
// Calls bookService.getCategoryStats() to get stats grouped by category
// Stores them in books and categoryStats state
// Renders a title, a subtitle with total book count, and a <Chart> with stats
const { useState,useEffect } = React
export function Dashbored() {
    const [books, setBooks] = useState([])
    const [categoryStats, setCategoryStats] = useState([])
  
    useEffect(() => {
      bookService.query().then(setBooks)                  
      bookService.getCategoryStats().then(setCategoryStats)  
    }, [])
  
    return (
      <section className="dashboard">
        <h1>Dashboard</h1>
        <h2>Statistics for {books.length} Books</h2>
        <h4>By Category</h4>
        <Chart data={categoryStats} />
      </section>
    )
  }