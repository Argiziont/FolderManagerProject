using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using ReactTestApp.Components.HelperComponents;
using ReactTestApp.Hubs;
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

        private readonly IHubContext<FolderHub> _folderHub;

        public FolderController(ApplicationDbContext context, IHubContext<FolderHub> hub)
        {
            db = context;

            _folderHub = hub;
        }
        [Authorize]
        [HttpGet]
        public IActionResult Get()
        {

            return Ok(db.Folders.Select(x => new FolderResponse(x.Id, x.Name, x.Files.Select(u => u.Id).ToList(), x.Files.Select(u => u.Name).ToList() )));

        }
        [Authorize]
        [HttpGet("{id}")]
        public Folder Get(int id)
        {
            //
            return db.Folders.Find(id);
            // 
        }
        [Authorize("Admin")]
        [HttpPost]
        public IActionResult PostFolder(Folder folder)
        {

            db.Folders.Add(folder);
            db.SaveChanges();
            return Ok(folder);
        }
        [Authorize("Moderator", "Admin")]
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
            _folderHub.Clients.All.SendAsync("DataUpdate");
            return Ok(folder);
        }
    }
}
