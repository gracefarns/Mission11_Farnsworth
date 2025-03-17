using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Mission11_Assignment.API.Data;

namespace Mission11_Assignment.API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class BookController : ControllerBase
    {
        private BookDbContext _bookContext;
        public BookController(BookDbContext temp) => _bookContext = temp;

        [HttpGet]
        public IActionResult GetBooks(int pageHowMany = 10, int pageNum = 1)
        {
            var something = _bookContext.Books
                .Skip((pageNum - 1) * pageHowMany)
                .Take(pageHowMany)
                .ToList();
            var totalNumBooks = _bookContext.Books.Count();
            var someObject = new
            {
                Books = something,
                TotalNumBooks = totalNumBooks
            };
            return Ok(someObject);
        }
    }
}