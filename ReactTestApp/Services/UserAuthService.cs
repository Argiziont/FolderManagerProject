using Microsoft.Extensions.Options;
using ReactTestApp.Components.HelperComponents;
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
        private static List<User> _users = new List<User>
        {
            new User { Id = 1, Role = "User", Name = "Andrew", Username = "test", Password = "test" },
            new User { Id = 2, Role = "Admin", Name = "Jake", Username = "Admin", Password = "Admin" },
            new User { Id = 3, Role = "Moderator", Name = "Nick", Username = "Moderator", Password = "Moderator" },
        };
        public UserAuthService(IOptions<AppSettings> appSettings)
        {
            _appSettings = appSettings.Value;
        }

        public AuthenticateResponse Authenticate(AuthenticateRequest model)
        {
            var user = _users.SingleOrDefault(x => x.Username == model.Username && x.Password == model.Password);
            // return null if user not found
            if (user == null) return null;

            // authentication successful so generate jwt token
           
            var token = JWTToken.generateJwtToken(user, _appSettings.Secret);

            return new AuthenticateResponse (user, token);
        }

        public IEnumerable<User> GetAll()
        {
            return _users;
        }

        public User GetById(int id)
        {
            return _users.FirstOrDefault(x => x.Id == id);
        }
    }
}
