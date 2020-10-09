using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Options;
using FolderProjectApp.Components.HelperComponents;
using FolderProjectApp.Hubs;
using FolderProjectApp.Models;
using FolderProjectApp.Models.AuthModel;
using FolderProjectApp.Models.Entity;
using FolderProjectApp.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FolderProjectApp.Services
{
    public class UserAuthService : IUserAuthService
    {
        private readonly AppSettings _appSettings;
        private IEFFileFolderContext db;
        public UserAuthService(IOptions<AppSettings> appSettings, IEFFileFolderContext context)
        {
            _appSettings = appSettings.Value;
            db = context;
        }

        public async Task<AuthenticateResponse> Authenticate(AuthenticateRequest model)
        {
            var user =await  db.GetUserByData(model.Password, model.Username);

            // return null if user not found
            if (user == null|| user.LoggedIn) return null;
            
            // authentication successful so generate jwt token

            var accessToken = JWTToken.generateAccessJwtToken(user, _appSettings.Secret);
            var refreshToken = JWTToken.generateRefreshJwtToken(user, _appSettings.Secret);
            await db.UpdateUserTokensAsync(user.Id, accessToken, refreshToken);

            return new AuthenticateResponse (user, accessToken, refreshToken);
        }

        public async Task<IEnumerable<User>> GetAll()
        {
            return await db.GetUsers();
        }

        public async Task<User> GetById(int id)
        {
            // return _users.FirstOrDefault(x => x.Id == id);
            User user = await db.GetUserByData(id);
            if (user != null)
            {
                return user;
            }
            return null;
        }
    }
}
