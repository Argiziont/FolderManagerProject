using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using FolderProjectApp.Components;
using FolderProjectApp.Components.HelperComponents;
using FolderProjectApp.Hubs;
using FolderProjectApp.Models;
using System;
using System.IO;
using System.Threading.Tasks;

namespace FolderProjectApp.Controllers 
{
    [Route("[controller]")]
    [ApiController]
    public class FileHolderController : ControllerBase
    {
        private ApplicationDbContext db;  

        private readonly IHubContext<FolderHub> _folderHub;

        public FileHolderController(ApplicationDbContext context, IHubContext<FolderHub> hub)
        {
            db = context;
            _folderHub = hub;
        }
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> PostFile(IFormCollection Data, IFormFile sendFile)
        {
            if (sendFile != null)
            {
                int key = Convert.ToInt32(Data["id"]);
                Folder folder = db.Folders.Find(key);
                FileHolder uplodadedFile = new FileHolder
                {
                    Name = sendFile.FileName,
                    Folder = folder,
                    Size = sendFile.Length,
                    Type = sendFile.ContentType
                };
                db.Files.Add(uplodadedFile);
                db.SaveChanges();

                using (Stream fileStream = sendFile.OpenReadStream())
                {
                    SqlConnectionStringBuilder builder = new SqlConnectionStringBuilder(db.Database.GetDbConnection().ConnectionString);
                    await Extensions.InsertFileStream(builder, uplodadedFile.Id, fileStream);
                }

                var t = db.Database.GetDbConnection().ConnectionString;

                await _folderHub.Clients.All.SendAsync("DataUpdate");

                return Ok();
            }
            return NotFound();
        }
        [Authorize]
        [HttpGet("{Id}")]
        public IActionResult Get(int Id)
        {
            var writer = new MemoryStream();
            SqlConnectionStringBuilder builder = new SqlConnectionStringBuilder(db.Database.GetDbConnection().ConnectionString);
            try
            {
                FileHolder file = db.Files.Find(Id);

                Extensions.ReadFileStream(builder, file.Id, file.Name, writer);
                writer.Position = 0;

                return new FileStreamResult(writer, file.Type)
                {
                    FileDownloadName = file.Name
                };

            }
            catch (Exception)
            {
                writer.Dispose();
                return NotFound();
            }
        }
        [Authorize("Moderator", "Admin")]
        [HttpDelete("{id}")]
        public IActionResult DeleteFile(int id)
        {
            FileHolder file = db.Files.Find(id);
            if (file == null)
            {
                return NotFound();
            }
            db.Files.Remove(file);
            db.SaveChanges();
            _folderHub.Clients.All.SendAsync("DataUpdate");

            return Ok(file);
        }
    }
}
