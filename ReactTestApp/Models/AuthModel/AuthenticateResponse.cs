using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ReactTestApp.Models.AuthModel
{
    public class AuthenticateResponse
    {
        public int Id { get; set; }
        public string Role { get; set; }
        public string Username { get; set; }
        public string Name { get; set; }
        public string AccessToken { get; set; }
        public string RefreshToken { get; set; }

        public AuthenticateResponse(User user, string access,string refresh)
        {
            Id = user.Id;
            Role = user.Role;
            Name = user.Name;
            Username = user.Username;
            AccessToken = access;
            RefreshToken = refresh;
        }
    }
}
