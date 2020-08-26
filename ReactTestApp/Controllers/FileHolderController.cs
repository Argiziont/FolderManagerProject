using System;
using System.Collections.Generic;
using System.IO;
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
        public IActionResult PostFile(IFormCollection Data, IFormFile sendFile) 
        {
            if (sendFile!=null)
            {
                int key = Convert.ToInt32(Data["id"]);
                Folder folder = db.Folders.Find(key);
                FileHolder uplodadedFile = new FileHolder { Name = sendFile.FileName, Folder = folder, Size = sendFile.Length };

                byte[] fileData = null;
                using (var binaryReader = new BinaryReader(sendFile.OpenReadStream()))
                {
                    fileData = binaryReader.ReadBytes((int)sendFile.Length);
                }
                uplodadedFile.File = fileData;
                db.Files.Add(uplodadedFile);
                db.SaveChanges();
                return Ok();
            }
            return NotFound();
        }

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
