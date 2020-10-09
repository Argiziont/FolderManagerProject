using FolderProjectApp.Controllers;
using FolderProjectApp.Hubs;
using FolderProjectApp.Models;
using FolderProjectApp.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace FolderProjectApp.Tests
{
    public class FolderControllerTests
    {

        #region snippet_Get_ReturnsAIActionResult_WithAListOfFoldersInDatabase
        [Fact]
        public async Task Get_ReturnsAIActionResult_WithAListOfFoldersInDatabase()
        {
            // Arrange
            var expected = 2;//Number of folders in list
            var mockDb = new Mock<IEFFileFolderContext>();
            mockDb.Setup(repo => repo.GetFolders())
                .ReturnsAsync(GetAllTestSessions());

            var mockHub = new Mock<IHubContext<FolderHub>>();

            var controller = new FolderController(mockDb.Object, mockHub.Object);

            // Act
            var result = await controller.Get();

            // Assert
            //var okObjectResult = result as OkObjectResult;
            var okObjectResult = Assert.IsType<OkObjectResult>(result);
            Assert.NotNull(okObjectResult);

            var model = okObjectResult.Value as IEnumerable<FolderResponse>;
            Assert.NotNull(model);

            var actual = model.Count();
            Assert.Equal(expected, actual);
        }
        #endregion

        #region snippet_GetById_ReturnsAIActionResult_WithAFolderFromDatabase
        [Fact]
        public async Task GetById_ReturnsAIActionResult_WithAFolderFromDatabase()
        {
            // Arrange
            var expected = "Test One";//Name of folder
            var mockDb = new Mock<IEFFileFolderContext>();
            mockDb.Setup(repo => repo.GetFolderByIdAsync(1))
                .ReturnsAsync(GetOneTestSessions());

            var mockHub = new Mock<IHubContext<FolderHub>>();

            var controller = new FolderController(mockDb.Object, mockHub.Object);
            // Act
            var result = await controller.Get(1);

            // Assert
            //var okObjectResult = result as OkObjectResult;
            var okObjectResult = Assert.IsType<OkObjectResult>(result);
            Assert.NotNull(okObjectResult);

            var model = okObjectResult.Value as FolderResponse;
            Assert.NotNull(model);

            var actual = model.FolderName;
            Assert.Equal(expected, actual);
        }
        #endregion

        #region snippet_PostFolder_ReturnsAIActionResult_WithAFolder
        [Fact]
        public async Task PostFolder_ReturnsAIActionResult_WithAFolder()
        {
            // Arrange
            var expected = "Test One";//Name of folder
            var mockDb = new Mock<IEFFileFolderContext>();

            //SignalRHubMock
            var mockHub = new Mock<IHubContext<FolderHub>>();
            var mockClients = new Mock<IHubClients>();
            Mock<IClientProxy> mockClientProxy = new Mock<IClientProxy>();

            mockClients.Setup(clients => clients.All).Returns(mockClientProxy.Object);
            mockHub.Setup(repo => repo.Clients).Returns(mockClients.Object);

            var controller = new FolderController(mockDb.Object, mockHub.Object);
            // Act
            var result = await controller.PostFolder(GetOneTestSessions());

            // Assert
            var okObjectResult = Assert.IsType<OkObjectResult>(result);
            Assert.NotNull(okObjectResult);

            var model = okObjectResult.Value as Folder;
            Assert.NotNull(model);

            var actual = model.Name;
            Assert.Equal(expected, actual);
        }
        #endregion

        #region snippet_DeleteById_ReturnsAIActionResult_WithAFolderFromDatabase
        [Fact]
        public async Task GetById_ReturnsAIActionResult_WithARemovedFolderFromDatabase()
        {
            // Arrange
            var expected = "Test One";//Name of folder

            //SignalRHubMock
                       var mockHub = new Mock<IHubContext<FolderHub>>();
            var mockClients = new Mock<IHubClients>();
            Mock<IClientProxy> mockClientProxy = new Mock<IClientProxy>();

            mockClients.Setup(clients => clients.All).Returns(mockClientProxy.Object);
            mockHub.Setup(repo => repo.Clients).Returns(mockClients.Object);

            //EF database Mock
            var mockDb = new Mock<IEFFileFolderContext>();
            mockDb.Setup(repo => repo.GetFolderByIdAsync(1))
               .ReturnsAsync(GetOneTestSessions());

            var controller = new FolderController(mockDb.Object, mockHub.Object);
            // Act
            var result = await controller.DeleteFolder(1);

            // Assert
            //var okObjectResult = result as OkObjectResult;
            var okObjectResult = Assert.IsType<OkObjectResult>(result);
            Assert.NotNull(okObjectResult);

            var model = okObjectResult.Value as Folder;
            Assert.NotNull(model);

            var actual = model.Name;
            Assert.Equal(expected, actual);
        }
        #endregion

        #region snippet_GetAllTestSessions
        private List<Folder> GetAllTestSessions()
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

        #region snippet_GetOneTestSessions
        private Folder GetOneTestSessions()
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

    }
}
