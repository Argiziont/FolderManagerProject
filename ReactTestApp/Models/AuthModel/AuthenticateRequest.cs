using System.ComponentModel.DataAnnotations;

namespace ReactTestApp.Models.AuthModel
{
    public class AuthenticateRequest
    {
        [Required]
        public string Username { get; set; }
        [Required]
        public string Password { get; set; }
        public bool LoggedIn { get; set; }
    }
}
