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
        public IActionResult GetBooks(int pageHowMany = 5, int pageNum = 1, string sortOrder = "asc")
        {

            var booksQuery = _bookContext.Books.AsQueryable();

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
    }
}
