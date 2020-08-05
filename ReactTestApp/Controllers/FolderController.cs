using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using ReactTestApp.Models;

namespace ReactTestApp.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class FolderController : ControllerBase
    {
        private static List<Folder> FolderSummary = new List<Folder> {
            new Folder {Id=1,Name="Pictures",Files=null },
            new Folder {Id=2,Name="Music",Files=null },
            new Folder {Id=3,Name="Documents",Files=null },
            new Folder {Id=4,Name="Other Files",Files=null },
            };
        private readonly ILogger<FolderController> _logger;

        public FolderController(ILogger<FolderController> logger)
        {
            _logger = logger;
        }
        [HttpGet]
        public IEnumerable<Folder> Get()
        {
            return FolderSummary;
        }
        [HttpGet("{id}")]
        public Folder Get(int id)
        {
            return FolderSummary.ElementAtOrDefault(id);
        }

        [HttpPost]
        public IActionResult Post(Folder folder)
        {
            folder.Id = FolderSummary.LastOrDefault().Id + 1;
            FolderSummary.Add(folder);
            return Ok(folder);
        }
    }
}
