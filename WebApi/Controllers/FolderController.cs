using FolderProjectApp.Components.HelperComponents;
using FolderProjectApp.Hubs;
using FolderProjectApp.Models;
using FolderProjectApp.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System.Linq;
using System.Threading.Tasks;

namespace FolderProjectApp.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class FolderController : ControllerBase
    {
        private readonly IEFFileFolderContext db;

        private readonly IHubContext<FolderHub> _folderHub;

        public FolderController(IEFFileFolderContext context, IHubContext<FolderHub> hub)
        {
            db = context;

            _folderHub = hub;
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var folders = await db.GetFolders();
            if (folders != null)
            {
                return Ok(folders.Select(x => new FolderResponse(x.Id, x.Name, x.Files.Select(u => u.Id).ToList(), x.Files.Select(u => u.Name).ToList())));
            }
            else
            {
                return NotFound();
            }
        }

        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var folder = await db.GetFolderByIdAsync(id);
            if (folder != null)
            {
                return Ok(new FolderResponse(folder.Id, folder.Name, folder.Files.Select(u => u.Id).ToList(), folder.Files.Select(u => u.Name).ToList()));
            }
            else
            {
                return NotFound();
            }
        }

        [Authorize("Moderator")]
        [HttpPost]
        public async Task<IActionResult> PostFolder(Folder folder)
        {
            IClientProxy hub = _folderHub.Clients.All;
            if (hub == null) return BadRequest();
            if (folder == null) return BadRequest();

            await db.AddFolderAsync(folder);

            await hub.SendAsync("DataUpdate");

            return Ok(folder);

        }

        [Authorize("Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFolder(int id)
        {

            Folder folder = await db.GetFolderByIdAsync(id);
            IClientProxy hub = _folderHub.Clients.All;


            if (folder == null) return NotFound();
            if (hub == null) return BadRequest();

            await db.RemoveFolderAsync(folder);

            await hub.SendAsync("DataUpdate");

            return Ok(folder);
        }
    }
}
