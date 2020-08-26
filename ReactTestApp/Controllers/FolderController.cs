using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using ReactTestApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ReactTestApp.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class FolderController : ControllerBase
    {
        private ApplicationDbContext db;

        private readonly ILogger<FolderController> _logger;

        public FolderController(ILogger<FolderController> logger, ApplicationDbContext context)
        {
            db = context;

            _logger = logger;

            #region standartValues
            //var folder0 = db.Folders.ToList()[0];
            //var folder1 = db.Folders.ToList()[1];
            //var folder2 = db.Folders.ToList()[2];
            //var folder3 = db.Folders.ToList()[3];
            //var folder4 = db.Folders.ToList()[4];
            //var file1 = new FileHolder { Name = "red.png", Folder = folder3 };
            //var file2 = new FileHolder { Name = "red.png", Folder = folder0 };
            //var file3 = new FileHolder { Name = "purple.jpg", Folder = folder0 };
            //var file4 = new FileHolder { Name = "green.exe", Folder = folder0 };
            //var file5 = new FileHolder { Name = "Zack.pg", Folder = folder1 };
            //var file6 = new FileHolder { Name = "Files.ini", Folder = folder1 };
            //var file7 = new FileHolder { Name = "Elis.exe", Folder = folder2 };
            //var file8 = new FileHolder { Name = "Open.exp", Folder = folder3 };
            //var file9 = new FileHolder { Name = "colors.ini", Folder = folder3 };

            //db.Files.AddRange(file1, file2, file3, file4, file5, file6, file7, file8, file9);
            //db.Folders.AddRange(folder0, folder1, folder2, folder3, folder4);

            //db.SaveChanges();
            #endregion

        }
        [HttpGet]
        public IEnumerable<Tuple<int,string,List<string>,List<int>>> Get()
        {
            return db.Folders.Select(x => new Tuple<int, string, List<string>, List<int>>(x.Id, x.Name, x.Files.Select(u => u.Name).ToList(), x.Files.Select(u => u.Id).ToList())).ToList();
        }
        [HttpGet("{id}")]
        public Folder Get(int id)
        {
            //
            return db.Folders.Find(id);
            //
        }

        [HttpPost]
        public IActionResult PostFolder(Folder folder)
        {
            //folder.Id = FolderSummary.Count > 0 ? FolderSummary.LastOrDefault().Id+1 : 0;

            db.Folders.Add(folder);
            db.SaveChanges();
            return Ok(folder);
        }
        [HttpDelete("{id}")]
        public IActionResult DeleteFolder(int id)
        {

            Folder folder = db.Folders.Find(id);
            if (folder == null)
            {
                return NotFound();
            }
            db.Folders.Remove(folder);
            db.SaveChanges();
            return Ok(folder);
        }
    }
}
