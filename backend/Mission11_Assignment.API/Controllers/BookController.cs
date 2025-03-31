using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Mission11_Assignment.API.Data;
using System.Linq;

namespace Mission11_Assignment.API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class BookController : ControllerBase
    {
        private readonly BookDbContext _bookContext;

        public BookController(BookDbContext temp) => _bookContext = temp;

        [HttpGet]
        public IActionResult GetBooks(int pageHowMany = 5, int pageNum = 1, string sortOrder = "asc", [FromQuery] List<string> bookCategories = null)
        {
            var booksQuery = _bookContext.Books.AsQueryable();
            if (bookCategories != null)
            {
                booksQuery = booksQuery.Where(p => bookCategories.Contains(p.Category));
            }

            // Sorting
            booksQuery = sortOrder.ToLower() == "desc"
                ? booksQuery.OrderByDescending(b => b.Title)
                : booksQuery.OrderBy(b => b.Title);

            // Get total count BEFORE pagination
            int totalNumBooks = booksQuery.Count();

            // Apply pagination AFTER sorting
            var books = booksQuery
                .Skip((pageNum - 1) * pageHowMany) 
                .Take(pageHowMany)
                .ToList();

            return Ok(new
            {
                Books = books,
                TotalNumBooks = totalNumBooks
            });
        }

        [HttpGet("BookCategory")]
        public IActionResult GetBookCategory()
        {
            var bookCategories = _bookContext.Books
                .Select(b => b.Category)
                .Distinct()
                .ToList();

            return Ok(bookCategories);
        }


        [HttpPost("AddBook")]
        public IActionResult AddBook([FromBody] Book newBook)
        {
            _bookContext.Books.Add(newBook);
            _bookContext.SaveChanges();
            return Ok(newBook);
        }

        [HttpPut("UpdateBook/{BookID}")]
        public IActionResult UpdateBook(int BookID, [FromBody] Book updatedBook) {
            var existingBook = _bookContext.Books.Find(BookID);

            existingBook.Title = updatedBook.Title;
            existingBook.Author = updatedBook.Author;
            existingBook.Publisher = updatedBook.Publisher;
            existingBook.ISBN = updatedBook.ISBN;
            existingBook.Classification = updatedBook.Classification;
            existingBook.Category = updatedBook.Category;
            existingBook.PageCount = updatedBook.PageCount;
            existingBook.Price = updatedBook.Price;

            _bookContext.Books.Update(existingBook);
            _bookContext.SaveChanges();

            return Ok(existingBook);
        }
        [HttpDelete("DeleteBook/{BookID}")]
        public IActionResult DeleteProject(int BookID) {
            var book = _bookContext.Books.Find(BookID);

            if (book == null) {
                return NotFound(new {message = "Book not found"});
            }   

            _bookContext.Books.Remove(book);
            _bookContext.SaveChanges();

            return NoContent();
        }
    }
}
