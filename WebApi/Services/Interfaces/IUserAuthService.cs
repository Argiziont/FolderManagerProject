using FolderProjectApp.Models.AuthModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FolderProjectApp.Services.Interfaces
{
    public interface IUserAuthService
    {
        public Task<AuthenticateResponse> Authenticate(AuthenticateRequest model);
        public Task<IEnumerable<User>> GetAll();
        public Task<User> GetById(int id);
    }
}
