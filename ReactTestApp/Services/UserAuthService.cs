using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using ReactTestApp.Components.HelperComponents;
using ReactTestApp.Models;
using ReactTestApp.Models.AuthModel;
using ReactTestApp.Models.Entity;
using ReactTestApp.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ReactTestApp.Services
{
    public class UserAuthService : IUserAuthService
    {
        private readonly AppSettings _appSettings;
        private ApplicationDbContext db;
        public UserAuthService(IOptions<AppSettings> appSettings, ApplicationDbContext context)
        {
            _appSettings = appSettings.Value;
            db = context;
        }

        public AuthenticateResponse Authenticate(AuthenticateRequest model)
        {
            var user = db.Users.SingleOrDefault(x => x.Username == model.Username && x.Password == model.Password);
            // return null if user not found
            if (user == null) return null;
            if (user.LoggedIn) return null;
            
            // authentication successful so generate jwt token

            var accessToken = JWTToken.generateAccessJwtToken(user, _appSettings.Secret);
            var refreshToken = JWTToken.generateRefreshJwtToken(user, _appSettings.Secret);
            user.RequestToken = accessToken;
            user.RefreshToken = refreshToken;
            //user.LoggedIn = true;
            db.SaveChanges();

            return new AuthenticateResponse (user, accessToken, refreshToken);
        }

        public IEnumerable<User> GetAll()
        {
            return db.Users.ToList();
        }

        public User GetById(int id)
        {
            // return _users.FirstOrDefault(x => x.Id == id);
            User user = db.Users.Find(id);
            if (user != null)
            {
                return user;
            }
            return null;
        }
    }
}
