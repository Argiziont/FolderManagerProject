using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using FolderProjectApp.Components;
using FolderProjectApp.Components.HelperComponents;
using FolderProjectApp.Hubs;
using FolderProjectApp.Models;
using System;
using System.IO;
using System.Threading.Tasks;
using FolderProjectApp.Services.Interfaces;

namespace FolderProjectApp.Controllers 
{
    [Route("[controller]")]
    [ApiController]
    public class FileHolderController : ControllerBase
    {
        private readonly IEFFileFolderContext db;  

        private readonly IHubContext<FolderHub> _folderHub;

        public FileHolderController(IEFFileFolderContext context, IHubContext<FolderHub> hub)
        {
            db = context;
            _folderHub = hub;
        }

        [Authorize]
        [RequestSizeLimit(737280000)]
        [HttpPost("{Id}")]
        public async Task<IActionResult> PostFile(int Id,IFormFile sendFile)
        {
            if (sendFile != null)
            {
               
                Folder folder = await db.GetFolderByIdAsync(Id);

                IClientProxy hub = _folderHub.Clients.All;
                if (hub == null) return BadRequest();

                FileHolder uplodadedFile = new FileHolder
                {
                    Name = sendFile.FileName,
                    Folder = folder,
                    Size = sendFile.Length,
                    Type = sendFile.ContentType
                };
                await db.AddFileAsync(uplodadedFile);

                using (Stream fileStream = sendFile.OpenReadStream())
                {
                    SqlConnectionStringBuilder builder = new SqlConnectionStringBuilder(db.GetDatabase().GetDbConnection().ConnectionString);
                    await Extensions.InsertFileStream(builder, uplodadedFile.Id, fileStream);
                }

                await hub.SendAsync("DataUpdate");

                return Ok();
            }
            return NotFound();
        }

        [Authorize]
        [HttpGet("{Id}")]
        public async Task<IActionResult> Get(int Id)
        {
            var writer = new MemoryStream();
            SqlConnectionStringBuilder builder = new SqlConnectionStringBuilder(db.GetDatabase().GetDbConnection().ConnectionString);
            try
            {
                FileHolder file =await db.GetFileByIdAsync(Id);

                Extensions.ReadFileStream(builder, file.Id, file.Name, writer);
                writer.Position = 0;
                return File(writer, file.Type, file.Name);
            }
            catch (Exception)
            {
                writer.Dispose();
                return NotFound();
            }
        }

        [Authorize("Moderator")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFile(int id)
        {
            FileHolder file = await db.GetFileByIdAsync(id);
            if (file == null)
            {
                return NotFound();
            }
            await db.RemoveFileAsync(file);
            await _folderHub.Clients.All.SendAsync("DataUpdate");

            return Ok(file);
        }
    }
}
