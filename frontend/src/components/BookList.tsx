import { useEffect, useState } from "react";
import { Book } from "../types/Book";
import { useNavigate } from "react-router-dom";
import "./PageNum.css";

function BookList({ selectedCategories }: { selectedCategories: string[] }) {
  const [books, setBooks] = useState<Book[]>([]);
  const [pageSize, setPageSize] = useState<number>(5);
  const [pageNum, setPageNum] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc"); // Sorting order state
  const [price] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    const categoryParams = selectedCategories
      .map((cat) => `bookCategories=${encodeURIComponent(cat)}`)
      .join("&");

    const fetchBooks = async () => {
      const response = await fetch(
        `https://localhost:5000/Book?pageHowMany=${pageSize}&pageNum=${pageNum}&sortOrder=${sortOrder}${selectedCategories.length ? `&${categoryParams}` : ""}`
      );
      const data = await response.json();

      setBooks(data.books);
      setTotalItems(data.totalNumBooks);
      setTotalPages(Math.ceil(totalItems / pageSize));
    };

    fetchBooks();
  }, [pageSize, pageNum, sortOrder, selectedCategories]);

  return (
    <>
      <button
        onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
      >
        Sort by Title ({sortOrder === "asc" ? "A-Z" : "Z-A"})
      </button>
      <br />

      {books.map((b) => (
        <div id="bookID" className="card" key={b.bookID}>
          <h3 className="card-title">{b.title}</h3>
          <div className="card-body">
            <ul className="list-unstyled">
              <li>
                <strong>Author:</strong> {b.author}
              </li>
              <li>
                <strong>Publisher:</strong> {b.publisher}
              </li>
              <li>
                <strong>ISBN: </strong>
                {b.isbn}
              </li>
              <li>
                <strong>Classification/Category: </strong>
                {b.classification}/{b.category}
              </li>
              <li>
                <strong>Number of Pages: </strong>
                {b.pageCount}
              </li>
              <li>
                <strong>Price: </strong>
                {b.price}
              </li>
            </ul>
            <button
              className="btn btn-success"
              onClick={() => navigate(`/buy/${b.title}/${b.title}/${b.price}`)}
            >
              Buy
            </button>
          </div>
        </div>
      ))}
      <br></br>
      <div className="divider-fade"></div>
      <br></br>
      <ul className="pagination justify-content-center pagination-gradient">
        <li className={`page-item ${pageNum === 1 ? "disabled" : ""}`}>
          <button
            className="page-link"
            onClick={() => setPageNum(pageNum - 1)}
            disabled={pageNum === 1}
          >
            Previous
          </button>
        </li>

        {[...Array(totalPages)].map((_, i) => (
          <li
            key={i + 1}
            className={`page-item ${pageNum === i + 1 ? "active" : ""}`}
          >
            <button
              className="page-link"
              onClick={() => setPageNum(i + 1)}
              disabled={pageNum === i + 1}
            >
              {i + 1}
            </button>
          </li>
        ))}

        <li className={`page-item ${pageNum === totalPages ? "disabled" : ""}`}>
          <button
            className="page-link"
            onClick={() => setPageNum(pageNum + 1)}
            disabled={pageNum === totalPages}
          >
            Next
          </button>
        </li>
      </ul>

      <br />
      <label>
        Results per page:
        <select
          value={pageSize}
          onChange={(p) => {
            setPageSize(Number(p.target.value));
            setPageNum(1);
          }}
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
        </select>
      </label>
    </>
  );
}

export default BookList;
