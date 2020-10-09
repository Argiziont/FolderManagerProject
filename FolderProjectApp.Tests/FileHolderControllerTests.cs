using FolderProjectApp.Controllers;
using FolderProjectApp.Hubs;
using FolderProjectApp.Models;
using FolderProjectApp.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Moq;
using System.Collections.Generic;
using System.IO;
using System.Net.Mime;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace FolderProjectApp.Tests
{
    public class FileHolderControllerTests
    {

        #region snippet_PostFile_ReturnsAIActionResult
        [Fact]
        public async Task PostFile_ReturnsAIActionResult()
        {
            // Arrange
            var mockDb = new Mock<IEFFileFolderContext>();
            mockDb.Setup(repo => repo.GetFolderByIdAsync(1))
             .ReturnsAsync(GetOneTestSessionsFolder());

            //SignalRHubMock
            var mockHub = new Mock<IHubContext<FolderHub>>();
            var mockClients = new Mock<IHubClients>();
            Mock<IClientProxy> mockClientProxy = new Mock<IClientProxy>();

            mockClients.Setup(clients => clients.All).Returns(mockClientProxy.Object);
            mockHub.Setup(repo => repo.Clients).Returns(mockClients.Object);

            var controller = new FileHolderController(mockDb.Object, mockHub.Object);
            // Act
            var result = await controller.PostFile(1, GetOneTestSessionsFile());
            //(local)\\SQLEXPRESS; Initial Catalog = AccountSystem; Integrated Security = True; MultipleActiveResultSets = True
            // Assert
            var okObjectResult = Assert.IsType<OkObjectResult>(result);
            Assert.NotNull(okObjectResult);

        }
        #endregion

        #region snippet_GetAllTestSessionsFolder
        private List<Folder> GetAllTestSessionsFolder()
        {
            var sessions = new List<Folder>();
            List<FileHolder> files1 = new List<FileHolder>();
            List<FileHolder> files2 = new List<FileHolder>();
            sessions.Add(new Folder
            {
                Files = null,
                Id = 1,
                Name = "Test One"
            });
            files1.Add(new FileHolder { Id = 3, Name = "Red", Folder = sessions[0], FolderId = 1 });
            files1.Add(new FileHolder { Id = 4, Name = "Green", Folder = sessions[0], FolderId = 1 });
            files1.Add(new FileHolder { Id = 5, Name = "White", Folder = sessions[0], FolderId = 1 });
            sessions[0].Files = files1;

            sessions.Add(new Folder
            {
                Files = new List<FileHolder>() { },
                Id = 2,
                Name = "Test Two"
            });
            files2.Add(new FileHolder { Id = 6, Name = "Red", Folder = sessions[1], FolderId = 2 });
            files2.Add(new FileHolder { Id = 7, Name = "Green", Folder = sessions[1], FolderId = 2 });
            files2.Add(new FileHolder { Id = 8, Name = "White", Folder = sessions[1], FolderId = 2 });
            sessions[1].Files = files2;

            return sessions;
        }
        #endregion

        #region snippet_GetOneTestSessionsFolder
        private Folder GetOneTestSessionsFolder()
        {
            var session = new Folder
            {
                Files = new List<FileHolder>(),
                Id = 1,
                Name = "Test One"
            };
            session.Files.Add(new FileHolder { Id = 3, Name = "Red", Folder = session, FolderId = 1 });
            session.Files.Add(new FileHolder { Id = 4, Name = "Green", Folder = session, FolderId = 1 });
            session.Files.Add(new FileHolder { Id = 5, Name = "White", Folder = session, FolderId = 1 });


            return session;
        }
        #endregion

        #region snippet_GetOneTestSessionsFile
        private FormFile GetOneTestSessionsFile()
        {
            using (FileStream fstream = new FileStream("Tests.txt", FileMode.OpenOrCreate))
            {
                // преобразуем строку в байты
                byte[] array = System.Text.Encoding.Default.GetBytes("Some Text");
                // запись массива байтов в файл
                fstream.Write(array, 0, array.Length);
            }

            FormFile session;
            using (FileStream fstream = File.OpenRead("Tests.txt"))
            {
                session = new FormFile(fstream, 0, fstream.Length, null, Path.GetFileName(fstream.Name))
                {
                    Headers = new HeaderDictionary(),
                    ContentType = "text/txt"
                };

            }
            return session;
        }
        #endregion
    }
}
