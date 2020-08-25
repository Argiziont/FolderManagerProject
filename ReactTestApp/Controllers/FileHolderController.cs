using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using ReactTestApp.Models;

namespace ReactTestApp.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class FileHolderController : ControllerBase
    {
        private ApplicationDbContext db;

        private readonly ILogger<FolderController> _logger;

        public FileHolderController(ILogger<FolderController> logger, ApplicationDbContext context)
        {
            db = context;

            _logger = logger;

        }
        [HttpPost]
        public IActionResult PostFile(IFormCollection Data)
        {
            ////folder.Id = FolderSummary.Count > 0 ? FolderSummary.LastOrDefault().Id+1 : 0;

            //db.Folders.Add(folder);
            //db.SaveChanges();
            return Ok();
        }
    }
}
