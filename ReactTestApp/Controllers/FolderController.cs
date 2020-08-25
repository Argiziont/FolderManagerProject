using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using ReactTestApp.Models;
using System.Collections.Generic;
using System.Linq;

namespace ReactTestApp.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class FolderController : ControllerBase
    {
        private static List<Folder> FolderSummary = new List<Folder> {
            new Folder {Id=1,Name="Pictures",Files=null,TmpFileNames=new string[] { "red.png", "purple.jpg", "green.exe" } },
            new Folder {Id=2,Name="Music",Files=null,TmpFileNames=new string[] { "Zack.pg", "Files.ini" } },
            new Folder {Id=3,Name="Documents",Files=null,TmpFileNames=new string[] { "Elis.exe" } },
            new Folder {Id=4,Name="Other Files",Files=null,TmpFileNames=new string[] { "red.png", "Open.exp", "colors.ini" } },
            new Folder {Id=5,Name="My files",Files=null,},
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
        public IActionResult PostFolder(Folder folder)
        {
            folder.Id = FolderSummary.Count > 0 ? FolderSummary.LastOrDefault().Id + 1 : 1;
            FolderSummary.Add(folder);
            return Ok(folder);
        }
        [HttpDelete("{id}")]
        public IActionResult DeleteFolder(int id)
        {

            var folder = FolderSummary.ElementAt(id - 1);
            if (folder == null)
            {
                return NotFound();
            }
            FolderSummary.Remove(folder);
            for (int i = 0; i < FolderSummary.Count; i++)
            {
                FolderSummary[i].Id = i + 1;
            }

            return Ok(folder);
        }
    }
}
