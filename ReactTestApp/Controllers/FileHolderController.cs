using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ReactTestApp.Components;
using ReactTestApp.Components.HelperComponents;
using ReactTestApp.Models;
using System;
using System.IO;
using System.Threading.Tasks;

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

                // byte[] fileData = null;
                //using (BinaryReader binaryReader = new BinaryReader(sendFile.OpenReadStream()))
                //{
                //    fileData = binaryReader.ReadBytes((int)sendFile.Length);
                //}
                //uplodadedFile.File = fileData;
                using (Stream fileStream = sendFile.OpenReadStream())
                {
                    SqlConnectionStringBuilder builder = new SqlConnectionStringBuilder(db.Database.GetDbConnection().ConnectionString);
                    await Extensions.InsertFileStream(builder, uplodadedFile.Id, fileStream);
                }

                var t = db.Database.GetDbConnection().ConnectionString;
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

                return File(writer, file.Type, file.Name);
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
            return Ok(file);
        }
    }
}
