using FolderProjectApp.Controllers;
using FolderProjectApp.Models.AuthModel;
using FolderProjectApp.Services;
using FolderProjectApp.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace FolderProjectApp.Tests
{
    public class UserControllerTests
    {
        #region snippet_Authenticate_ReturnsAIActionResult_WithResponse
        [Fact]
        public async Task Authenticate_ReturnsAIActionResult_WithResponse()
        {
            // Arrange
            var expected = "AccessToken test";
            var mockservice = new Mock<IUserAuthService>();
            mockservice.Setup(repo => repo.Authenticate(null))
                .ReturnsAsync(GetOneTestSessionsUser());

            var controller = new UserController(mockservice.Object);

            // Act
            var result = await controller.Authenticate(null);

            // Assert
            //var okObjectResult = result as OkObjectResult;
            var okObjectResult = Assert.IsType<OkObjectResult>(result);
            Assert.NotNull(okObjectResult);

            var model = okObjectResult.Value as AuthenticateResponse;
            Assert.NotNull(model);

            var actual = model.AccessToken;
            Assert.Equal(expected, actual);

        }
        #endregion

        #region snippet_GetAll_ReturnsAIActionResult_WithUser
        [Fact]
        public async Task GetAll_ReturnsAIActionResult_WithUser()
        {
            // Arrange
            var expected = 3;
            var mockservice = new Mock<IUserAuthService>();
            mockservice.Setup(repo => repo.GetAll())
                .ReturnsAsync(GetOneTestSessionsUserList());

            var controller = new UserController(mockservice.Object);

            // Act
            var result = await controller.GetAll();

            // Assert
            //var okObjectResult = result as OkObjectResult;
            var okObjectResult = Assert.IsType<OkObjectResult>(result);
            Assert.NotNull(okObjectResult);

            var model = okObjectResult.Value as IEnumerable<User>;
            Assert.NotNull(model);

            var actual = model.Count();
            Assert.Equal(expected, actual);

        }
        #endregion

        #region snippet_GetOneTestSessionsUser
        private AuthenticateResponse GetOneTestSessionsUser()
        {
            var session = new AuthenticateResponse
            {
               Name="Vlad",
               AccessToken= "AccessToken test",
               Id=7,
               RefreshToken= "RefreshToken test",
               Role="Super Admin",
               Username="Jaster"
            };

            return session;
        }
        #endregion

        #region snippet_GetOneTestSessionsUserList
        private IEnumerable<User> GetOneTestSessionsUserList()
        {
            var session = new List<User>
            {
                new User{Name="test one"},
                new User{Name="test two"},
                new User{Name="test three"},
            };

            return session;
        }
        #endregion

        #region snippet_GetOneTestSessionsAuthenticateUser
        private AuthenticateRequest GetOneTestSessionsAuthenticateUser()
        {
            var session = new AuthenticateRequest
            {
                Username = "test1",
                LoggedIn = false,
                Password= "test1"
            };

            return session;
        }
        #endregion

    }
}
